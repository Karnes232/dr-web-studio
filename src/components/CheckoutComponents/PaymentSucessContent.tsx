"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getStripe } from "@/lib/stripe-client"
import {
  CheckCircle,
  ArrowRight,
  Download,
  Mail,
  Calendar,
  Home,
  CreditCard,
  User,
  DollarSign,
} from "lucide-react"
import type { PaymentSuccessData } from "@/sanity/queries/payment/paymentSuccess"
import { useLocale } from "@/i18n/useLocale"
const PaymentSucessContent = ({
  paymentSuccessData,
  email,
}: {
  paymentSuccessData: PaymentSuccessData
  email: { email: string }
}) => {
  const [message, setMessage] = useState<string>("")
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const searchParams = useSearchParams()
  const { currentLocale, t } = useLocale()
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const paymentIntentId = searchParams.get("payment_intent")
      const paymentIntentClientSecret = searchParams.get(
        "payment_intent_client_secret",
      )

      if (paymentIntentId) {
        try {
          // Option 1: Fetch from your API endpoint
          const response = await fetch(
            `/api/payment-details/${paymentIntentId}`,
          )
          const data = await response.json()
          if (data.success) {
            setPaymentDetails(data.paymentIntent)
            if (currentLocale === "en") {
              setMessage(
                `Payment of $${(data.paymentIntent.amount / 100).toFixed(2)} completed successfully!`,
              )
            } else {
              setMessage(
                `Pago de $${(data.paymentIntent.amount / 100).toFixed(2)} completado exitosamente!`,
              )
            }
          }
        } catch (error) {
          console.error("Error fetching payment details:", error)

          // Option 2: Fallback - retrieve from Stripe client-side
          if (paymentIntentClientSecret) {
            const stripe = await getStripe()
            if (stripe) {
              const { paymentIntent } = await stripe.retrievePaymentIntent(
                paymentIntentClientSecret,
              )

              if (paymentIntent) {
                setPaymentDetails(paymentIntent)
                setMessage(
                  `${t("checkout.payment_of")} $${(paymentIntent.amount / 100).toFixed(2)} ${t("checkout.completed_successfully")}!`,
                )
              }
            }
          }
        }
      }
    }

    fetchPaymentDetails()
  }, [searchParams])

  const handleContinue = () => {
    window.location.href = "/"
  }

  // const handleDownloadReceipt = () => {
  //   // Implement receipt download functionality
  //   console.log("Download receipt")
  // }

  // const handleScheduleCall = () => {
  //   // Redirect to calendar scheduling
  //   window.location.href = "#calendar"
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-950 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* Success Animation Container */}
        <div className="text-center mb-8">
          <div className="relative">
            {/* Animated Success Icon */}
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 mb-4 shadow-lg animate-pulse motion-reduce:animate-none">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>

            {/* Confetti-like decoration */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                <div
                  className="w-2 h-2 bg-orange-400 rounded-full animate-ping"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-teal-400 rounded-full animate-ping"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {
              paymentSuccessData.title[
                currentLocale as keyof typeof paymentSuccessData.title
              ]
            }
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {
              paymentSuccessData.subtitle[
                currentLocale as keyof typeof paymentSuccessData.subtitle
              ]
            }
          </p>
        </div>

        {/* Main Success Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
          {/* Payment Details Section */}
          <div className="p-8">
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-teal-600 mr-3" />
                <h2 className="text-lg font-semibold text-teal-800">
                  {t("checkout.payment_details")}
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <span className="text-slate-600">
                    {t("checkout.transaction_id")}:
                  </span>
                  <span className="font-mono text-sm text-slate-800 ">
                    #{paymentDetails?.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">
                    {t("checkout.amount")}:
                  </span>
                  <span className="font-semibold text-slate-800 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {paymentDetails?.amount
                      ? `${(paymentDetails.amount / 100).toFixed(2)}`
                      : "Loading..."}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">{t("checkout.date")}:</span>
                  <span className="text-slate-800">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">
                    {t("checkout.status")}:
                  </span>
                  <span className="flex items-center text-teal-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {t("checkout.completed")}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 px-4 py-3 rounded-lg inline-block">
                <p className="font-medium">{message}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Primary Action */}
              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2" />
                {t("checkout.back_to_home")}
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>

              {/* Secondary Actions */}
              {/* <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadReceipt}
                  className="flex items-center justify-center py-3 px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t("checkout.receipt")}
                </button>

                <button
                  onClick={handleScheduleCall}
                  className="flex items-center justify-center py-3 px-4 bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 rounded-lg hover:bg-teal-200 dark:hover:bg-teal-500/25 transition-colors duration-200 font-medium"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {t("checkout.schedule_call")}
                </button>
              </div> */}
            </div>
          </div>

          {/* Next Steps Section */}
          <div className="bg-slate-50 dark:bg-slate-900 px-8 py-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-orange-500" />
              {
                paymentSuccessData.whatsNext.title[
                  currentLocale as keyof typeof paymentSuccessData.whatsNext.title
                ]
              }
            </h3>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {paymentSuccessData.whatsNext.steps.map((step, index) => {
                return (
                  <div className="flex items-start" key={index}>
                    <div
                      className={`flex-shrink-0 w-6 h-6 ${step.color} text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5`}
                    >
                      {step.number}
                    </div>
                    <p>
                      {
                        step.description[
                          currentLocale as keyof typeof step.description
                        ]
                      }
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {t("checkout.need_help")}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {t("checkout.have_questions")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`mailto:${email.email}`}
              className="flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 font-medium"
            >
              <Mail className="h-4 w-4 mr-2" />
              {t("checkout.email_us")}
            </a>
            {/*             
            <a
              href="https://wa.me/18091234567"
              className="flex items-center justify-center px-4 py-2 bg-teal-100 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 rounded-lg hover:bg-teal-200 dark:hover:bg-teal-500/25 transition-colors duration-200 font-medium"
            >
              <User className="h-4 w-4 mr-2" />
              WhatsApp
            </a> */}
          </div>
        </div>

        {/* Footer */}
        {/* <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            Powered by{' '}
            <span className="font-semibold text-orange-600">DR Web Studio</span>
          </p>
          <p className="mt-1">
            Professional Website Development • Dominican Republic
          </p>
        </div> */}
      </div>
    </div>
  )
}

export default PaymentSucessContent
