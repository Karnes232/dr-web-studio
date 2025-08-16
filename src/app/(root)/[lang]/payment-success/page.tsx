import { Metadata } from "next"
import { getSEO } from "@/sanity/queries/seo"
import PaymentSucessContent from "@/components/CheckoutComponents/PaymentSucessContent"
import { headers } from "next/headers"
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
  const seoData = await getSEO("services")

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const canonicalUrl = `${baseUrl}/${lang}/payment-success`

  if (!seoData) return {}

  return {
    title: seoData.meta[lang]?.title,
    description: seoData.meta[lang]?.description,
    keywords: seoData.meta[lang]?.keywords.join(", "),
    openGraph: {
      title: seoData.openGraph[lang]?.title || seoData.meta[lang]?.title,
      description:
        seoData.openGraph[lang]?.description || seoData.meta[lang]?.description,
      url: canonicalUrl,
      type: "website",
      images: seoData.openGraph.image ? [{
        url: seoData.openGraph.image.url,
        width: seoData.openGraph.image.width,
        height: seoData.openGraph.image.height,
      }] : [],
    },
    robots: {
      index: false,
      follow: true,
    },
    ...(canonicalUrl && { canonical: canonicalUrl }),
    alternates: {
      canonical: canonicalUrl,
    },
  }
}
