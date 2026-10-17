import { Metadata } from "next"
import { CheckCircle, CreditCard, Shield } from "lucide-react"
import { getTranslations } from "next-intl/server"
import CheckoutFlow from "@/components/CheckoutComponents/CheckoutFlow"
import { getCustomPayment } from "@/sanity/queries/payment/customPayment"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function CustomPaymentPage({ params }: PageProps) {
  const { lang } = await params
  const [customPaymentData, t] = await Promise.all([
    getCustomPayment(),
    getTranslations({ locale: lang, namespace: "checkout" }),
  ])

  // The whole shell (heading, subtitle, card, trust row) is server-rendered so
  // it paints with the HTML. Only the form inside the card is client code, and
  // the card's contents are the one thing that changes between steps.
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded-full">
              <CreditCard className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {customPaymentData.title[lang]}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {customPaymentData.subtitle[lang]}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <CheckoutFlow />
        </div>

        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-8 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-1">
                <Shield
                  className="h-4 w-4 text-slate-600 dark:text-slate-400"
                  aria-hidden="true"
                />
              </div>
              <span>{t("256_bit_ssl")}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-1">
                <CreditCard
                  className="h-4 w-4 text-slate-600 dark:text-slate-400"
                  aria-hidden="true"
                />
              </div>
              <span>{t("pci_compliant")}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-1">
                <CheckCircle
                  className="h-4 w-4 text-slate-600 dark:text-slate-400"
                  aria-hidden="true"
                />
              </div>
              <span>{t("verified")}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  return {
    title:
      lang === "es"
        ? "Pago Personalizado | DR Web Studio"
        : "Custom Payment | DR Web Studio",
    description:
      lang === "es"
        ? "Completa tu pago personalizado de forma segura."
        : "Complete your custom payment securely.",
    robots: { index: false, follow: false },
  }
}
