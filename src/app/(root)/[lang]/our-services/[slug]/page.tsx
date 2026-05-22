import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import IndividualServiceContent from "@/components/IndividualServicePage/IndividualServiceContent"
import {
  getServiceItemBySlug,
  getServiceItemSEO,
} from "@/sanity/queries/services/serviceItem"
import { notFound } from "next/navigation"
import { SITE_URL } from "@/lib/site"
import { getServiceItemsSitemap } from "@/sanity/queries/services/serviceItem"

export const revalidate = 3600

export async function generateStaticParams() {
  const items = await getServiceItemsSitemap()
  return items.flatMap(item => [
    { lang: "en", slug: item.slug.current },
    { lang: "es", slug: item.slug.current },
  ])
}

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
  const canonicalUrl = serviceSEO?.seo?.canonicalUrl
    ? `${SITE_URL}/${lang}/${serviceSEO.seo.canonicalUrl}`
    : `${SITE_URL}/${lang}/our-services/${slug}`

  // Use SEO data if available, otherwise fall back to basic service data
  const metaTitle = serviceSEO.seo?.meta[lang]?.title || serviceSEO.title[lang]
  const metaDescription = serviceSEO.seo?.meta[lang]?.description || ""
  const ogTitle = serviceSEO.seo?.openGraph[lang]?.title || metaTitle
  const ogDescription =
    serviceSEO.seo?.openGraph[lang]?.description || metaDescription

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: serviceSEO.seo?.meta[lang]?.keywords?.join(", "),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      type: "website",
      locale: lang === "es" ? "es_ES" : "en_US",
      images: serviceSEO.seo?.openGraph.image
        ? [
            {
              url: serviceSEO.seo.openGraph.image.url,
              width: serviceSEO.seo.openGraph.image.width,
              height: serviceSEO.seo.openGraph.image.height,
            },
          ]
        : [],
    },
    robots: {
      index: !serviceSEO.seo?.noIndex,
      follow: !serviceSEO.seo?.noFollow,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: serviceSEO.seo?.openGraph.image
        ? [serviceSEO.seo.openGraph.image.url]
        : [],
    },
    ...(canonicalUrl && { canonical: canonicalUrl }),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/our-services/${slug}`,
        es: `${SITE_URL}/es/our-services/${slug}`,
        "x-default": `${SITE_URL}/en/our-services/${slug}`,
      },
    },
  }
}

export default async function IndividualService({ params }: PageProps) {
  const { lang, slug } = await params
  const service = await getServiceItemBySlug(slug)

  if (!service) {
    notFound()
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
