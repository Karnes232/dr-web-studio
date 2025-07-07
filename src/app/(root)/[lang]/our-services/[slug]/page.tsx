import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import IndividualServiceContent from "@/components/IndividualServicePage/IndividualServiceContent"
import {
  getServiceItemBySlug,
  getServiceItemSEO,
} from "@/sanity/queries/services/serviceItem"
import { headers } from "next/headers"

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

  // Get host information for canonical URL
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const canonicalUrl = serviceSEO?.seo?.canonicalUrl
    ? `${baseUrl}/${lang}/${serviceSEO.seo.canonicalUrl}`
    : `${baseUrl}/${lang}/our-services/${slug}`

  if (!serviceSEO) return {}

  // Use SEO data if available, otherwise fall back to basic service data
  const metaTitle = serviceSEO.seo?.meta[lang]?.title || serviceSEO.title[lang]
  const metaDescription = serviceSEO.seo?.meta[lang]?.description || ""
  const ogTitle = serviceSEO.seo?.openGraph[lang]?.title || metaTitle
  const ogDescription =
    serviceSEO.seo?.openGraph[lang]?.description || metaDescription

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: serviceSEO.seo?.meta[lang]?.keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: serviceSEO.seo?.openGraph.image
        ? [serviceSEO.seo.openGraph.image]
        : [],
    },
    robots: {
      index: !serviceSEO.seo?.noIndex,
      follow: !serviceSEO.seo?.noFollow,
    },
    ...(canonicalUrl && { canonical: canonicalUrl }),
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function IndividualService({ params }: PageProps) {
  const { lang, slug } = await params
  const service = await getServiceItemBySlug(slug)

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
