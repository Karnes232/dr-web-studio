"use client"

import { useEffect, useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe-client"
import CheckoutForm from "@/components/CheckoutComponents/CheckoutForm"
import {
  CreditCard,
  DollarSign,
  Shield,
  CheckCircle,
  User,
  Mail,
} from "lucide-react"
import { useParams } from "next/navigation"
import { CustomPaymentData } from "@/sanity/queries/payment/customPayment"
import { useLocale } from "@/i18n/useLocale"
import { StripeElementLocale } from "@stripe/stripe-js"

const stripePromise = getStripe()

const CheckoutContent = ({
  customPaymentData,
}: {
  customPaymentData: CustomPaymentData
}) => {
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [error, setError] = useState("")
  const { lang } = useParams()
  const { t } = useLocale()
  const createPaymentIntent = async (paymentAmount: number) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: paymentAmount,
          customerName,
          customerEmail,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error("Error creating payment intent:", error)
      setError("Failed to create payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const numericAmount = parseFloat(amount)

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid payment amount")
      return
    }

    if (numericAmount < 1) {
      setError("Minimum payment amount is $1.00")
      return
    }

    if (numericAmount > 10000) {
      setError("Maximum payment amount is $10,000.00")
      return
    }

    if (!customerName.trim()) {
      setError("Please enter your name")
      return
    }

    if (!customerEmail.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!validateEmail(customerEmail)) {
      setError("Please enter a valid email address")
      return
    }

    // Convert to cents for Stripe
    const amountInCents = Math.round(numericAmount * 100)
    createPaymentIntent(amountInCents)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
      setError("")
    }
  }

  const resetForm = () => {
    setClientSecret("")
    setAmount("")
    setCustomerName("")
    setCustomerEmail("")
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded-full">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {
              customPaymentData.title[
                lang as keyof typeof customPaymentData.title
              ]
            }
          </h1>
          <p className="text-slate-600">
            {
              customPaymentData.subtitle[
                lang as keyof typeof customPaymentData.subtitle
              ]
            }
          </p>
        </div>

        {/* Main Payment Card */}
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          {!clientSecret ? (
            <>
              {/* Payment Form */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Name Input */}
                  <div>
                    <label
                      htmlFor="customerName"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      {t("checkout.full_name")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="customerName"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder={t("checkout.full_name_placeholder")}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Customer Email Input */}
                  <div>
                    <label
                      htmlFor="customerEmail"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      {t("checkout.email_address")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        id="customerEmail"
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        placeholder={t("checkout.email_address_placeholder")}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      {t("checkout.payment_amount")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        id="amount"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0.00"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-semibold text-slate-900"
                        disabled={loading}
                      />
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-4 h-4 mr-1">⚠️</span>
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Payment Button */}
                  <button
                    type="submit"
                    disabled={
                      loading || !amount || !customerName || !customerEmail
                    }
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t("checkout.processing")}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Shield className="h-5 w-5 mr-2" />
                        {t("checkout.pay")} ${amount || "0.00"}
                      </div>
                    )}
                  </button>
                </form>
              </div>

              {/* Security Features */}
              <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
                <div className="flex items-center justify-center space-x-6 text-sm text-slate-600">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-teal-500 mr-1" />
                    <span>{t("checkout.ssl_encrypted")}</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-teal-500 mr-1" />
                    <span>{t("checkout.stripe_secured")}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Stripe Elements Form */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 px-4 py-2 rounded-lg inline-block font-semibold mb-2">
                    {t("checkout.payment_amount")}: $
                    {(parseFloat(amount) || 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>
                      <strong>{t("checkout.name")}:</strong> {customerName}
                    </p>
                    <p>
                      <strong>{t("checkout.email")}:</strong> {customerEmail}
                    </p>
                  </div>
                </div>

                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    locale: lang as StripeElementLocale,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#f97316",
                        colorBackground: "#ffffff",
                        colorText: "#1e293b",
                        colorDanger: "#ef4444",
                        borderRadius: "8px",
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    lang={lang as string}
                    customerEmail={customerEmail}
                    customerName={customerName}
                  />
                </Elements>

                {/* Back Button */}
                <button
                  onClick={resetForm}
                  className="mt-6 w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
                >
                  ← {t("checkout.change_details")}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-8 text-xs text-slate-500">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mb-1">
                <Shield className="h-4 w-4 text-slate-600" />
              </div>
              <span>{t("checkout.256_bit_ssl")}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mb-1">
                <CreditCard className="h-4 w-4 text-slate-600" />
              </div>
              <span>{t("checkout.pci_compliant")}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mb-1">
                <CheckCircle className="h-4 w-4 text-slate-600" />
              </div>
              <span>{t("checkout.verified")}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            Powered by{" "}
            <span className="font-semibold text-orange-600">DR Web Studio</span>
          </p>
        </div> */}
      </div>
    </div>
  )
}

export default CheckoutContent
