import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { useRouter } from "next/navigation"
import { useLocale } from "@/i18n/useLocale"
import { getPathname } from "@/i18n/navigation"
import type { Locale } from "@/lib/slugs"

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
    setMessage("")

    const successPath = getPathname({
      locale: lang as Locale,
      href: "/payment-success",
    })

    try {
      // Redirect-based methods (3DS fallbacks, bank redirects) come back to
      // return_url; cards finish in place, so redirect: "if_required".
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}${successPath}`,
        },
        redirect: "if_required",
      })

      if (error) {
        // Card and validation errors are written for the customer; anything
        // else (network, API) gets our own translated message.
        setMessage(
          (error.type === "card_error" || error.type === "validation_error") &&
            error.message
            ? error.message
            : t("checkout.error_generic_payment"),
        )
        setLoading(false)
        return
      }

      if (
        paymentIntent &&
        (paymentIntent.status === "succeeded" ||
          paymentIntent.status === "processing")
      ) {
        // The id is all the success page needs: it reads the real status from
        // Stripe on the server. The confirmation email comes from the webhook.
        router.push(
          `${successPath}?payment_intent=${encodeURIComponent(paymentIntent.id)}`,
        )
        return
      }

      setMessage(t("checkout.error_generic_payment"))
      setLoading(false)
    } catch (err) {
      console.error("confirmPayment failed", err)
      setMessage(t("checkout.error_generic_payment"))
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="w-full mt-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 disabled:opacity-50"
      >
        {loading ? t("checkout.processing") : t("checkout.pay")}
      </button>
      {message && (
        <div role="alert" className="mt-4 text-red-600 text-sm">
          {message}
        </div>
      )}
    </form>
  )
}
