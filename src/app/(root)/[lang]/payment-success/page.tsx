import { Metadata } from "next"
import { Suspense } from "react"
import PaymentSucessContent from "@/components/CheckoutComponents/PaymentSucessContent"
import { getPaymentSuccess } from "@/sanity/queries/payment/paymentSuccess"
import { getContactEmail } from "@/sanity/queries/layout/generalLayout"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}
export default async function PaymentSuccess() {
  const [paymentSuccessData, email] = await Promise.all([
    getPaymentSuccess(),
    getContactEmail(),
  ])
  return (
    // PaymentSucessContent reads useSearchParams(); it needs its own boundary
    // now that there is no route-level loading.tsx providing one.
    <Suspense>
      <PaymentSucessContent
        paymentSuccessData={paymentSuccessData}
        email={{ email: email ?? "james@dr-webstudio.com" }}
      />
    </Suspense>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
