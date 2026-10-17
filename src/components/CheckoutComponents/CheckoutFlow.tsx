"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import { DollarSign, Shield, CheckCircle, User, Mail } from "lucide-react"
import { useLocale } from "@/i18n/useLocale"
import {
  BOTPOISON_PUBLIC_KEY,
  MAX_CENTS,
  MIN_CENTS,
} from "@/lib/payments/config"

// Stripe.js and the Payment Element only load once there is a client secret.
// Step 1 (the form) is server-rendered; this placeholder holds step 2's space
// so nothing below it jumps when the iframe arrives.
const PaymentStep = dynamic(
  () => import("@/components/CheckoutComponents/PaymentStep"),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-72 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800 motion-reduce:animate-none"
        aria-hidden="true"
      />
    ),
  },
)

const CheckoutFlow = () => {
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [error, setError] = useState("")
  const { t, currentLocale } = useLocale()
  // One id per form session: a double-click or retry with the same details
  // reuses the server's PaymentIntent instead of creating a second one.
  const attemptId = useRef<string | null>(null)

  const formatMoney = (cents: number) =>
    new Intl.NumberFormat(currentLocale === "es" ? "es-DO" : "en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100)

  // Server error codes -> translated messages.
  const errorMessage = (code: unknown) => {
    switch (code) {
      case "amount_invalid":
        return t("checkout.error_amount_invalid")
      case "amount_min":
        return t("checkout.error_amount_min")
      case "amount_max":
        return t("checkout.error_amount_max")
      case "name_required":
        return t("checkout.error_name_required")
      case "email_required":
        return t("checkout.error_email_required")
      case "email_invalid":
        return t("checkout.error_email_invalid")
      case "verification_required":
      case "verification_failed":
        return t("checkout.error_verification_failed")
      default:
        return t("checkout.error_create_failed")
    }
  }

  const createPaymentIntent = async (paymentAmount: number) => {
    setLoading(true)
    setError("")

    try {
      // Loaded on submit, inside the try, so a blocked request surfaces as an
      // error message rather than a button that silently does nothing.
      const { default: Botpoison } = await import("@botpoison/browser")
      const botpoison = new Botpoison({ publicKey: BOTPOISON_PUBLIC_KEY })
      const { solution } = await botpoison.challenge()
      if (!solution) {
        setError(t("checkout.error_verification_failed"))
        return
      }

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: paymentAmount,
          customerName,
          customerEmail,
          lang: currentLocale,
          attemptId:
            attemptId.current ?? (attemptId.current = crypto.randomUUID()),
          _botpoison: solution,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error || !data.clientSecret) {
        setError(errorMessage(data.error))
        return
      }

      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error("Error creating payment intent:", error)
      setError(t("checkout.error_create_failed"))
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
      setError(t("checkout.error_amount_invalid"))
      return
    }

    // Round once, here, to whole cents; the server only accepts integers.
    const amountInCents = Math.round(numericAmount * 100)

    if (amountInCents < MIN_CENTS) {
      setError(t("checkout.error_amount_min"))
      return
    }

    if (amountInCents > MAX_CENTS) {
      setError(t("checkout.error_amount_max"))
      return
    }

    if (!customerName.trim()) {
      setError(t("checkout.error_name_required"))
      return
    }

    if (!customerEmail.trim()) {
      setError(t("checkout.error_email_required"))
      return
    }

    if (!validateEmail(customerEmail)) {
      setError(t("checkout.error_email_invalid"))
      return
    }

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
    attemptId.current = null
  }

  return (
    <>
      {!clientSecret ? (
        <>
          {/* Payment Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Name Input */}
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
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
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900 dark:text-white"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Customer Email Input */}
              <div>
                <label
                  htmlFor="customerEmail"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
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
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900 dark:text-white"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
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
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-semibold text-slate-900 dark:text-white"
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
                disabled={loading || !amount || !customerName || !customerEmail}
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
                    {t("checkout.pay")}{" "}
                    {formatMoney(Math.round((parseFloat(amount) || 0) * 100))}
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Security Features */}
          <div className="bg-slate-50 dark:bg-slate-900 px-8 py-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-600 dark:text-slate-400">
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
                {t("checkout.payment_amount")}:{" "}
                {formatMoney(Math.round((parseFloat(amount) || 0) * 100))}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p>
                  <strong>{t("checkout.name")}:</strong> {customerName}
                </p>
                <p>
                  <strong>{t("checkout.email")}:</strong> {customerEmail}
                </p>
              </div>
            </div>

            <PaymentStep clientSecret={clientSecret} lang={currentLocale} />

            {/* Back Button */}
            <button
              onClick={resetForm}
              className="mt-6 w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 font-medium"
            >
              ← {t("checkout.change_details")}
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default CheckoutFlow
