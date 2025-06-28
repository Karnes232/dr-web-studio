import WebsiteQuestionnaire from "@/components/projectPlannerComponents/WebsiteQuestionnaire"
import { client } from "@/sanity/lib/client"
import { getBudget } from "@/sanity/queries/project-planner/budget"
import { getContactForm } from "@/sanity/queries/project-planner/contactForm"
import { getContentStatus } from "@/sanity/queries/project-planner/contentStatus"
import { getDesignStyle } from "@/sanity/queries/project-planner/designStyle"
import { getFeatures } from "@/sanity/queries/project-planner/features"
import { getLanguages } from "@/sanity/queries/project-planner/languages"
import { getPagesCount } from "@/sanity/queries/project-planner/pagesCount"
import { getProjectPlannerHeader } from "@/sanity/queries/project-planner/projectPlannerHeader"
import { getTimeline } from "@/sanity/queries/project-planner/timeline"
import { getWebsiteType } from "@/sanity/queries/project-planner/websiteType"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import React from "react"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

const getCompanyEmail = async () => {
  const companyEmail = await client.fetch(`
    *[_type == "generalLayout"][0] {
      email
    }
  `)
  return companyEmail.email
}

export default async function Pricing({ params }: PageProps) {
  const { lang } = await params
  const seoData = await getSeoSchema("project-planner")
  const projectPlannerHeader = await getProjectPlannerHeader()
  const websiteType = await getWebsiteType()
  const pagesCount = await getPagesCount()
  const designStyle = await getDesignStyle()
  const features = await getFeatures()
  const budget = await getBudget()
  const timeline = await getTimeline()
  const contentStatus = await getContentStatus()
  const languages = await getLanguages()
  const contactForm = await getContactForm()
  const companyEmail = await getCompanyEmail()

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
          designStyle={designStyle}
          features={features}
          budget={budget}
          timeline={timeline}
          contentStatus={contentStatus}
          languages={languages}
          contactForm={contactForm}
          companyEmail={companyEmail}
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
