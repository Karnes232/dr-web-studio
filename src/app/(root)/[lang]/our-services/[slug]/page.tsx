import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import IndividualServiceContent from "@/components/IndividualServicePage/IndividualServiceContent"
import { getServiceItemBySlug, getServiceItemSEO } from "@/sanity/queries/services/serviceItem"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params
  const serviceSEO = await getServiceItemSEO(slug)

  if (!serviceSEO) return {}

  // Use SEO data if available, otherwise fall back to basic service data
  const metaTitle = serviceSEO.seo?.meta[lang]?.title || serviceSEO.title[lang]
  const metaDescription = serviceSEO.seo?.meta[lang]?.description || ""
  const ogTitle = serviceSEO.seo?.openGraph[lang]?.title || metaTitle
  const ogDescription = serviceSEO.seo?.openGraph[lang]?.description || metaDescription

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: serviceSEO.seo?.meta[lang]?.keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: serviceSEO.seo?.openGraph.image ? [serviceSEO.seo.openGraph.image] : [],
    },
    robots: {
      index: !serviceSEO.seo?.noIndex,
      follow: !serviceSEO.seo?.noFollow,
    },
    ...(serviceSEO.seo?.canonicalUrl && { canonical: serviceSEO.seo.canonicalUrl }),
    alternates: {
      canonical: serviceSEO.seo?.canonicalUrl,
    },
  }
}

export default async function IndividualService({ params }: PageProps) {
  const { lang, slug } = await params
  const service = await getServiceItemBySlug(slug)
  console.log(service)
  if (!service) {
    return <div>Service not found</div>
  }

  return (
    <>
      {service.seo?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: service.seo.structuredData[lang] }}
        />
      )}
      <IndividualServiceContent
        // lang={lang}
        service={service}
      />
    </>
  )
}
