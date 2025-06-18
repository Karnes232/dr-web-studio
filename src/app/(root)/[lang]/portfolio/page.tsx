import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import PortfolioContent from "@/components/PortfolioComponents/PortfolioContent"
import { getPortfolioHeader } from "@/sanity/queries/portfolio/portfolioHeader"
import { getProjects } from "@/sanity/queries/portfolio/project"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function Portfolio({ params }: PageProps) {
  const { lang } = await params
  const seoData = await getSeoSchema("portfolio")
  const portfolioHeader = await getPortfolioHeader()
  const projects = await getProjects()

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
