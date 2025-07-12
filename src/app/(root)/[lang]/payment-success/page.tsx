import { Metadata } from "next"
import { getSEO } from "@/sanity/queries/seo"
import PaymentSucessContent from "@/components/CheckoutComponents/PaymentSucessContent"
import { headers } from "next/headers"
import { getPaymentSuccess } from "@/sanity/queries/payment/paymentSuccess"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}
export default async function PaymentSuccess() {
  const paymentSuccessData = await getPaymentSuccess()
  return (
    <>
      <PaymentSucessContent paymentSuccessData={paymentSuccessData} />
    </>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("services")

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const canonicalUrl = seoData?.canonicalUrl
    ? `${baseUrl}/${lang}/${seoData.canonicalUrl}`
    : `${baseUrl}/${lang}/payment-success`

  if (!seoData) return {}

  return {
    title: seoData.meta[lang]?.title,
    description: seoData.meta[lang]?.description,
    openGraph: {
      title: seoData.openGraph[lang]?.title || seoData.meta[lang]?.title,
      description:
        seoData.openGraph[lang]?.description || seoData.meta[lang]?.description,
      images: seoData.openGraph.image ? [seoData.openGraph.image] : [],
    },
    robots: {
      index: false,
      follow: false,
    },
    ...(canonicalUrl && { canonical: canonicalUrl }),
    alternates: {
      canonical: canonicalUrl,
    },
  }
}
