import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import PortfolioContent from "@/components/PortfolioComponents/PortfolioContent"
import { getPortfolioHeader } from "@/sanity/queries/portfolio/portfolioHeader"
import { getProjects } from "@/sanity/queries/portfolio/project"
import { buildAlternates } from "@/lib/urls"

export const revalidate = 86400

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function Portfolio({ params }: PageProps) {
  const { lang } = await params
  const [seoData, portfolioHeader, projects] = await Promise.all([
    getSeoSchema("portfolio"),
    getPortfolioHeader(),
    getProjects(),
  ])

  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <PortfolioContent
        lang={lang}
        portfolioHeader={portfolioHeader}
        projects={projects}
      />
    </>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("portfolio")

  if (!seoData) return {}

  const { canonical: canonicalUrl, languages } = buildAlternates({
    currentLocale: lang,
    hrefFor: () => "/portfolio",
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
