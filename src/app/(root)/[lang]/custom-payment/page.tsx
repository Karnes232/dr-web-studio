import { Metadata } from "next"
import { getSEO } from "@/sanity/queries/seo"
import CheckoutContentDynamic from "@/components/CheckoutComponents/CheckoutContentDynamic"
import { headers } from "next/headers"
import { getCustomPayment } from "@/sanity/queries/payment/customPayment"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function CustomPaymentPage() {
  const customPaymentData = await getCustomPayment()
  return <CheckoutContentDynamic customPaymentData={customPaymentData} />
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

  const canonicalUrl = `${baseUrl}/${lang}/custom-payment`

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
      images: seoData.openGraph.image
        ? [
            {
              url: seoData.openGraph.image.url,
              width: seoData.openGraph.image.width,
              height: seoData.openGraph.image.height,
            },
          ]
        : [],
    },
    robots: {
      index: false,
      follow: true,
    },
    twitter: {
      card: "summary_large_image",
      title: seoData.openGraph[lang]?.title || seoData.meta[lang]?.title,
      description:
        seoData.openGraph[lang]?.description || seoData.meta[lang]?.description,
      images: seoData.openGraph.image ? [seoData.openGraph.image.url] : [],
    },
    ...(canonicalUrl && { canonical: canonicalUrl }),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/custom-payment`,
        es: `${baseUrl}/es/custom-payment`,
        "x-default": `${baseUrl}/en/custom-payment`,
      },
    },
  }
}
