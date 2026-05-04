import { Metadata } from "next"
import PaymentSucessContent from "@/components/CheckoutComponents/PaymentSucessContent"
import { getPaymentSuccess } from "@/sanity/queries/payment/paymentSuccess"
import { client } from "@/sanity/lib/client"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}
export default async function PaymentSuccess() {
  const paymentSuccessData = await getPaymentSuccess()
  const email = await client.fetch(`
    *[_type == "generalLayout"][0] {
      email
    }
  `)
  return (
    <>
      <PaymentSucessContent
        paymentSuccessData={paymentSuccessData}
        email={email}
      />
    </>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === "es" ? "Pago Exitoso | DR Web Studio" : "Payment Successful | DR Web Studio",
    description: lang === "es" ? "Tu pago ha sido procesado exitosamente." : "Your payment has been processed successfully.",
    robots: { index: false, follow: false },
  }
}
