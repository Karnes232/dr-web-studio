import { Metadata } from "next"
import IndividualServiceContent from "@/components/IndividualServicePage/IndividualServiceContent"
import { getServiceGraph } from "@/lib/schema/graph"
import { JsonLd } from "@/components/seo/JsonLd"
import { SERVICE_PRICES } from "@/lib/schema/config"
import {
  getServiceItemBySlug,
  getServiceItemSEO,
} from "@/sanity/queries/services/serviceItem"
import { notFound } from "next/navigation"
import { getServiceItemsSitemap } from "@/sanity/queries/services/serviceItem"
import { buildAlternates } from "@/lib/urls"
import { slugPair, type LocalizedSlugDoc } from "@/lib/slugs"
import SetLocalizedHrefs from "@/i18n/SetLocalizedHrefs"

export const revalidate = 86400

export async function generateStaticParams() {
  const items = await getServiceItemsSitemap()
  return items.flatMap(item => {
    const pair = slugPair(item)
    return [
      { lang: "en", slug: pair.en },
      { lang: "es", slug: pair.es },
    ]
  })
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
  const pair = slugPair(serviceSEO)
  const { canonical: canonicalUrl, languages } = buildAlternates({
    currentLocale: lang,
    hrefFor: l => ({
      pathname: "/our-services/[slug]",
      params: { slug: pair[l] },
    }),
  })

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
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  }
}

export default async function IndividualService({ params }: PageProps) {
  const { lang, slug } = await params
  const service = await getServiceItemBySlug(slug)

  if (!service) {
    notFound()
  }

  // `service.slug` is the slug object at runtime (the type understates it as a
  // string); cast so slugPair can read both locale slugs for the switcher.
  const slugs = slugPair(service as unknown as LocalizedSlugDoc)

  const ogImg = service.seo?.openGraph?.image as unknown
  const image =
    typeof ogImg === "string" ? ogImg : (ogImg as { url?: string })?.url
  const name = service.seo?.meta?.[lang]?.title || service.title[lang]
  const description =
    service.seo?.meta?.[lang]?.description || service.description?.[lang]
  const priceInfo = SERVICE_PRICES[slugs.en]
  const serviceHref = {
    pathname: "/our-services/[slug]" as const,
    params: { slug: slugs[lang] },
  }

  const graph = await getServiceGraph({
    lang,
    href: serviceHref,
    enSlug: slugs.en,
    name,
    description,
    image,
    price: priceInfo?.price,
    unit: priceInfo?.unit,
    crumbs: [
      { name: lang === "es" ? "Inicio" : "Home", href: "/" },
      {
        name: lang === "es" ? "Servicios" : "Services",
        href: "/our-services",
      },
      { name, href: serviceHref },
    ],
  })

  return (
    <>
      <SetLocalizedHrefs
        pathname="/our-services/[slug]"
        enSlug={slugs.en}
        esSlug={slugs.es}
      />
      <JsonLd data={graph} />
      <IndividualServiceContent
        // lang={lang}
        service={service}
      />
    </>
  )
}
