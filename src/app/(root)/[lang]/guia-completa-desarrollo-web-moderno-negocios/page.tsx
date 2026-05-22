import dynamic from "next/dynamic"
import type { Language } from "@/components/GuiaCompletaComponents/types"

const PageClientComponent = dynamic(
  () => import("@/components/GuiaCompletaComponents/PageClientComponent"),
  { ssr: true },
)
import { getPillarPageContent } from "@/sanity/queries/pillarPage"
import { getSEO } from "@/sanity/queries/seo"
import { Metadata } from "next"
import { SITE_URL } from "@/lib/site"

export const revalidate = 3600

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
      {content.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: content.structuredData }}
        />
      )}
    </main>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("guia-completa-desarrollo-web-moderno-negocios")

  if (!seoData) return {}

  const canonicalUrl = seoData.canonicalUrl
    ? `${SITE_URL}/${lang}/${seoData.canonicalUrl}`
    : `${SITE_URL}/${lang}/guia-completa-desarrollo-web-moderno-negocios`

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
        en: `${SITE_URL}/en/guia-completa-desarrollo-web-moderno-negocios`,
        es: `${SITE_URL}/es/guia-completa-desarrollo-web-moderno-negocios`,
        "x-default": `${SITE_URL}/en/guia-completa-desarrollo-web-moderno-negocios`,
      },
    },
  }
}
