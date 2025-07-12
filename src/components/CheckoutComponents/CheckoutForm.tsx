import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { useRouter } from "next/navigation"
import { useLocale } from "@/i18n/useLocale"

export default function CheckoutForm({ lang }: { lang: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { t } = useLocale()
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })

    if (error) {
      setMessage(error.message || "An unexpected error occurred.")
      setLoading(false)
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Redirect with payment details
      const searchParams = new URLSearchParams({
        payment_intent: paymentIntent.id,
        payment_intent_client_secret: paymentIntent.client_secret || "",
        amount: paymentIntent.amount.toString(),
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      })

      router.push(`/${lang}/payment-success?${searchParams.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="w-full mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 disabled:opacity-50"
      >
        {loading ? t("checkout.processing") : t("checkout.pay")}
      </button>
      {message && <div className="mt-4 text-red-600 text-sm">{message}</div>}
    </form>
  )
}
