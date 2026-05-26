import { Metadata } from "next"
import CheckoutContentDynamic from "@/components/CheckoutComponents/CheckoutContentDynamic"
import { getCustomPayment } from "@/sanity/queries/payment/customPayment"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function CustomPaymentPage() {
  const customPaymentData = await getCustomPayment()
  return <CheckoutContentDynamic customPaymentData={customPaymentData} />
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
