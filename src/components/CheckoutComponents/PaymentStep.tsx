"use client"

import { useMemo } from "react"
import { Elements } from "@stripe/react-stripe-js"
import type { StripeElementLocale } from "@stripe/stripe-js"
import { getStripe } from "@/lib/stripe-client"
import CheckoutForm from "@/components/CheckoutComponents/CheckoutForm"

interface PaymentStepProps {
  clientSecret: string
  lang: "es" | "en"
}

/**
 * Step 2: Stripe's Payment Element. Loaded with next/dynamic (ssr: false) by
 * CheckoutFlow so Stripe.js stays off the initial page and never runs on the
 * server.
 */
export default function PaymentStep({ clientSecret, lang }: PaymentStepProps) {
  const stripePromise = useMemo(() => getStripe(), [])

  return (
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
      <CheckoutForm lang={lang} />
    </Elements>
  )
}
