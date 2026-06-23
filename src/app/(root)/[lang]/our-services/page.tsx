import { Metadata } from "next"
import { getSEO } from "@/sanity/queries/seo"
import { getStandardGraph } from "@/lib/schema/graph"
import { JsonLd } from "@/components/seo/JsonLd"
import ServicesContent from "@/components/ServicesComponents/ServicesContent"
import { getServicesHeader } from "@/sanity/queries/services/servicesHeader"
import { getFeaturesStrip } from "@/sanity/queries/services/featuresStrip"
import { getCustomSolutionCTA } from "@/sanity/queries/services/customSolutionCTA"
import { getCategories } from "@/sanity/queries/services/category"
import { getServiceItems } from "@/sanity/queries/services/serviceItem"
import { buildAlternates } from "@/lib/urls"

export const revalidate = 86400

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function OurServices({ params }: PageProps) {
  const { lang } = await params
  const [
    graph,
    servicesHeader,
    featuresStrip,
    customSolutionCTA,
    categories,
    serviceItems,
  ] = await Promise.all([
    getStandardGraph({
      lang,
      pageName: "services",
      href: "/our-services",
      withOffers: true,
      crumbs: [
        { name: lang === "es" ? "Inicio" : "Home", href: "/" },
        {
          name: lang === "es" ? "Servicios" : "Services",
          href: "/our-services",
        },
      ],
    }),
    getServicesHeader(),
    getFeaturesStrip(),
    getCustomSolutionCTA(),
    getCategories(),
    getServiceItems(),
  ])
  return (
    <>
      <JsonLd data={graph} />
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

  if (!seoData) return {}

  const { canonical: canonicalUrl, languages } = buildAlternates({
    currentLocale: lang,
    hrefFor: () => "/our-services",
  })

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
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  }
}
