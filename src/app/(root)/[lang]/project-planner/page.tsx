import WebsiteQuestionnaire from "@/components/projectPlannerComponents/WebsiteQuestionnaire"
import { getPagesCount } from "@/sanity/queries/project-planner/pagesCount"
import { getProjectPlannerHeader } from "@/sanity/queries/project-planner/projectPlannerHeader"
import { getWebsiteType } from "@/sanity/queries/project-planner/websiteType"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import React from "react"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function Pricing({ params }: PageProps) {
  const { lang } = await params
  const seoData = await getSeoSchema("project-planner")
  const projectPlannerHeader = await getProjectPlannerHeader()
  const websiteType = await getWebsiteType()
  const pagesCount = await getPagesCount()

  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <section
        id="project-planner"
        className="py-20 bg-gradient-to-br from-slate-50 to-orange-50"
      >
        <WebsiteQuestionnaire
          projectPlannerHeader={projectPlannerHeader}
          websiteType={websiteType}
          pagesCount={pagesCount}
        />
      </section>
    </>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("project-planner")

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
