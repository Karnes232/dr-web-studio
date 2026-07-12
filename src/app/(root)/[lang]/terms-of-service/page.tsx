import BlockContent from "@/components/BlogComponents/BlogPost/BlockContent/BlockContent"
import { getLegal } from "@/sanity/queries/legal/legal"
import { getSEO } from "@/sanity/queries/seo"
import { Metadata } from "next"
import { buildAlternates } from "@/lib/urls"
import { getStandardGraph } from "@/lib/schema/graph"
import { JsonLd } from "@/components/seo/JsonLd"

export const revalidate = 604800

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function TermsOfService({ params }: PageProps) {
  const { lang } = await params
  const title = lang === "es" ? "Términos de Servicio" : "Terms of Service"
  const [legalData, graph] = await Promise.all([
    getLegal("terms-of-service"),
    getStandardGraph({
      lang,
      pageName: "terms-of-service",
      href: "/terms-of-service",
      crumbs: [
        { name: lang === "es" ? "Inicio" : "Home", href: "/" },
        { name: title, href: "/terms-of-service" },
      ],
    }),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-950 dark:to-slate-950">
      <JsonLd data={graph} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="mb-8 font-serif text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
          {title}
        </h1>
        <div className="prose prose-lg prose-slate max-w-none">
          <BlockContent
            content={legalData?.content as any}
            language={lang as "en" | "es"}
          />
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("terms-of-service")

  if (!seoData) return {}

  const { canonical: canonicalUrl, languages } = buildAlternates({
    currentLocale: lang,
    hrefFor: () => "/terms-of-service",
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
