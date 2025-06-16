import { Metadata } from "next"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import ServicesContent from "@/components/ServicesComponents/ServicesContent"
import { getServicesHeader } from "@/sanity/queries/services/servicesHeader"
import { getFeaturesStrip } from "@/sanity/queries/services/featuresStrip"
import { getCustomSolutionCTA } from "@/sanity/queries/services/customSolutionCTA"
import { getCategories } from "@/sanity/queries/services/category"
import { getServiceItems } from "@/sanity/queries/services/serviceItem"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function OurServices({ params }: PageProps) {
  const { lang } = await params
  const seoData = await getSeoSchema("services")
  const servicesHeader = await getServicesHeader()
  const featuresStrip = await getFeaturesStrip()
  const customSolutionCTA = await getCustomSolutionCTA()
  const categories = await getCategories()
  const serviceItems = await getServiceItems()
  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <ServicesContent servicesHeader={servicesHeader} featuresStrip={featuresStrip} customSolutionCTA={customSolutionCTA} categories={categories} serviceItems={serviceItems} />
    </>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("services")

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
      index: !seoData.noIndex,
      follow: !seoData.noFollow,
    },
    ...(seoData.canonicalUrl && { canonical: seoData.canonicalUrl }),
    alternates: {
      canonical: seoData.canonicalUrl,
    },
  }
}
