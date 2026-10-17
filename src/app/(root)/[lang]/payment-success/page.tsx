import { Metadata } from "next"
import { notFound } from "next/navigation"
import PaymentSucessContent from "@/components/CheckoutComponents/PaymentSucessContent"
import { getPaymentSuccess } from "@/sanity/queries/payment/paymentSuccess"
import { getContactEmail } from "@/sanity/queries/layout/generalLayout"
import { getPaymentSummary } from "@/lib/payments/summary"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
  searchParams: Promise<{ payment_intent?: string | string[] }>
}

// Reading searchParams makes this route dynamic: the status shown is whatever
// Stripe says right now, never a cached or client-claimed one.
export default async function PaymentSuccess({
  params,
  searchParams,
}: PageProps) {
  const [{ lang }, { payment_intent }] = await Promise.all([
    params,
    searchParams,
  ])
  const id = Array.isArray(payment_intent) ? payment_intent[0] : payment_intent

  const summary = await getPaymentSummary(id)
  if (!summary) notFound()

  const [paymentSuccessData, email] = await Promise.all([
    getPaymentSuccess(),
    getContactEmail(),
  ])

  return (
    <main>
      <PaymentSucessContent
        lang={lang}
        summary={summary}
        paymentSuccessData={paymentSuccessData}
        email={{ email: email ?? "james@dr-webstudio.com" }}
      />
    </main>
  )
}

export async function generateMetadata({
  params,
}: Pick<PageProps, "params">): Promise<Metadata> {
  const { lang } = await params
  return {
    title:
      lang === "es"
        ? "Pago Exitoso | DR Web Studio"
        : "Payment Successful | DR Web Studio",
    description:
      lang === "es"
        ? "Tu pago ha sido procesado exitosamente."
        : "Your payment has been processed successfully.",
    robots: { index: false, follow: false },
  }
}
