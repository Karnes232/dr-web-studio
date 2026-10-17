import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  CreditCard,
  Home,
  Mail,
  RotateCcw,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { formatMoney, formatPaidAt } from "@/lib/payments/format"
import type { PaymentLocale } from "@/lib/payments/config"
import type { PaymentSummary } from "@/lib/payments/summary"
import type { PaymentSuccessData } from "@/sanity/queries/payment/paymentSuccess"

interface PaymentSucessContentProps {
  lang: PaymentLocale
  summary: PaymentSummary
  paymentSuccessData: PaymentSuccessData
  email: { email: string }
}

const buttonClass =
  "w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"

/**
 * Rendered on the server from Stripe's own record of the payment, so it can
 * only ever say what Stripe says. Three outcomes: paid, still processing, and
 * everything else ("not completed": canceled, needs a new payment method, ...).
 */
const PaymentSucessContent = async ({
  lang,
  summary,
  paymentSuccessData,
  email,
}: PaymentSucessContentProps) => {
  const t = await getTranslations({ locale: lang, namespace: "checkout" })

  const succeeded = summary.status === "succeeded"
  const processing = summary.status === "processing"

  const heading = succeeded
    ? paymentSuccessData.title[lang]
    : processing
      ? t("processing_title")
      : t("not_completed_title")
  const subheading = succeeded
    ? paymentSuccessData.subtitle[lang]
    : processing
      ? t("processing_body")
      : t("not_completed_body")

  const statusLabel = succeeded
    ? t("completed")
    : processing
      ? t("status_processing")
      : t("error_not_completed")

  const StatusIcon = succeeded ? CheckCircle : processing ? Clock : AlertCircle
  const iconWrap = succeeded
    ? "from-teal-600 to-teal-700"
    : processing
      ? "from-orange-500 to-yellow-500"
      : "from-slate-500 to-slate-600"
  const statusColor = succeeded
    ? "text-teal-700 dark:text-teal-300"
    : processing
      ? "text-orange-700 dark:text-orange-300"
      : "text-slate-700 dark:text-slate-300"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div
            className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r ${iconWrap} mb-4 shadow-lg`}
          >
            <StatusIcon
              className={`h-12 w-12 ${processing ? "text-slate-950" : "text-white"}`}
              aria-hidden="true"
            />
          </div>

          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {heading}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {subheading}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
          <div className="p-8">
            <div className="bg-teal-50 dark:bg-slate-800 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <CreditCard
                  className="h-6 w-6 text-teal-700 dark:text-teal-300 mr-3"
                  aria-hidden="true"
                />
                <h2 className="text-lg font-semibold text-teal-900 dark:text-teal-200">
                  {t("payment_details")}
                </h2>
              </div>

              <dl className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <dt className="text-slate-600 dark:text-slate-300">
                    {t("transaction_id")}:
                  </dt>
                  <dd className="font-mono text-sm text-slate-800 dark:text-slate-100 break-all">
                    {summary.id}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-slate-600 dark:text-slate-300">
                    {t("amount")}:
                  </dt>
                  <dd className="font-semibold text-slate-800 dark:text-slate-100">
                    {formatMoney(summary.amount, summary.currency, lang)}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-slate-600 dark:text-slate-300">
                    {t("date")}:
                  </dt>
                  <dd className="text-slate-800 dark:text-slate-100">
                    {formatPaidAt(summary.created * 1000, lang)}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-slate-600 dark:text-slate-300">
                    {t("status")}:
                  </dt>
                  <dd
                    className={`flex items-center font-medium ${statusColor}`}
                  >
                    <StatusIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                    {statusLabel}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="space-y-4">
              {succeeded || processing ? (
                <Link href="/" className={buttonClass}>
                  <Home className="h-5 w-5 mr-2" aria-hidden="true" />
                  {t("back_to_home")}
                  <ArrowRight className="h-5 w-5 ml-2" aria-hidden="true" />
                </Link>
              ) : (
                <Link href="/custom-payment" className={buttonClass}>
                  <RotateCcw className="h-5 w-5 mr-2" aria-hidden="true" />
                  {t("try_again")}
                </Link>
              )}
            </div>
          </div>

          {succeeded && (
            <div className="bg-slate-50 dark:bg-slate-900 px-8 py-6 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                <Mail
                  className="h-5 w-5 mr-2 text-orange-700 dark:text-orange-400"
                  aria-hidden="true"
                />
                {paymentSuccessData.whatsNext.title[lang]}
              </h2>

              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                {paymentSuccessData.whatsNext.steps.map(step => (
                  <div className="flex items-start" key={step.number}>
                    <div
                      className={`flex-shrink-0 w-6 h-6 ${step.color} text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5`}
                    >
                      {step.number}
                    </div>
                    <p>{step.description[lang]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {t("need_help")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {t("have_questions")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`mailto:${email.email}`}
              className="flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 font-medium"
            >
              <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
              {t("email_us")}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSucessContent
