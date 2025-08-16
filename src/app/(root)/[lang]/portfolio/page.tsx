import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import PortfolioContent from "@/components/PortfolioComponents/PortfolioContent"
import { getPortfolioHeader } from "@/sanity/queries/portfolio/portfolioHeader"
import { getProjects } from "@/sanity/queries/portfolio/project"
import { headers } from "next/headers"
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

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const canonicalUrl = seoData?.canonicalUrl
    ? `${baseUrl}/${lang}/${seoData.canonicalUrl}`
    : `${baseUrl}/${lang}/portfolio`

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
      images: seoData.openGraph.image ? [{
        url: seoData.openGraph.image.url,
        width: seoData.openGraph.image.width,
        height: seoData.openGraph.image.height,
      }] : [],
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
