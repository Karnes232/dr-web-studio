import PageClientComponent from "@/components/GuiaCompletaComponents/PageClientComponent"
import type { Language } from "@/components/GuiaCompletaComponents/types"
import { getPillarPageContent } from "@/sanity/queries/pillarPage"
import { getSEO } from "@/sanity/queries/seo"
import { Metadata } from "next"
import { headers } from "next/headers"
import Script from "next/script"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function GuiaCompletaDesarrolloWebModernoNegocios({
  params,
}: PageProps) {
  const { lang } = await params
  const content = await getPillarPageContent(lang as Language)

  if (!content) return null

  return (
    <main>
      <PageClientComponent content={content} lang={lang as Language} />
      <Script
        id="structured-data"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: content.structuredData || "" }}
      />
    </main>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("guia-completa-desarrollo-web-moderno-negocios")

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const canonicalUrl = seoData?.canonicalUrl
    ? `${baseUrl}/${lang}/${seoData.canonicalUrl}`
    : `${baseUrl}/${lang}/about-me`

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
      index: !seoData.noIndex,
      follow: !seoData.noFollow,
    },
    ...(canonicalUrl && { canonical: canonicalUrl }),
    alternates: {
      canonical: canonicalUrl,
    },
  }
}
