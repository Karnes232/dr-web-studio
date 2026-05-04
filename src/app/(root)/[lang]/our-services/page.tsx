import { Metadata } from "next"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import ServicesContent from "@/components/ServicesComponents/ServicesContent"
import { getServicesHeader } from "@/sanity/queries/services/servicesHeader"
import { getFeaturesStrip } from "@/sanity/queries/services/featuresStrip"
import { getCustomSolutionCTA } from "@/sanity/queries/services/customSolutionCTA"
import { getCategories } from "@/sanity/queries/services/category"
import { getServiceItems } from "@/sanity/queries/services/serviceItem"
import { headers } from "next/headers"
interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function OurServices({ params }: PageProps) {
  const { lang } = await params
  const [
    seoData,
    servicesHeader,
    featuresStrip,
    customSolutionCTA,
    categories,
    serviceItems,
  ] = await Promise.all([
    getSeoSchema("services"),
    getServicesHeader(),
    getFeaturesStrip(),
    getCustomSolutionCTA(),
    getCategories(),
    getServiceItems(),
  ])
  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <ServicesContent
        servicesHeader={servicesHeader}
        featuresStrip={featuresStrip}
        customSolutionCTA={customSolutionCTA}
        categories={categories}
        serviceItems={serviceItems}
        faqs={servicesHeader.faq}
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

  if (!seoData) return {}

  const canonicalUrl = seoData.canonicalUrl
    ? `${baseUrl}/${lang}/${seoData.canonicalUrl}`
    : `${baseUrl}/${lang}/our-services`

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
      locale: lang === "es" ? "es_ES" : "en_US",
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
      index: !seoData.noIndex,
      follow: !seoData.noFollow,
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
        en: `${baseUrl}/en/our-services`,
        es: `${baseUrl}/es/our-services`,
        "x-default": `${baseUrl}/en/our-services`,
      },
    },
  }
}
