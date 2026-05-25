import dynamic from "next/dynamic"

const WebsiteQuestionnaire = dynamic(
  () => import("@/components/projectPlannerComponents/WebsiteQuestionnaire"),
  { ssr: true },
)
import { getContactEmail } from "@/sanity/queries/layout/generalLayout"
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
import { buildAlternates } from "@/lib/urls"

export const revalidate = 3600

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function Pricing({ params }: PageProps) {
  const { lang } = await params
  const [
    seoData,
    projectPlannerHeader,
    websiteType,
    pagesCount,
    designStyle,
    features,
    budget,
    timeline,
    contentStatus,
    languages,
    contactForm,
    companyEmail,
  ] = await Promise.all([
    getSeoSchema("project-planner"),
    getProjectPlannerHeader(),
    getWebsiteType(),
    getPagesCount(),
    getDesignStyle(),
    getFeatures(),
    getBudget(),
    getTimeline(),
    getContentStatus(),
    getLanguages(),
    getContactForm(),
    getContactEmail(),
  ])

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
          companyEmail={companyEmail ?? "james@dr-webstudio.com"}
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

  const { canonical: canonicalUrl, languages } = buildAlternates({
    currentLocale: lang,
    hrefFor: () => "/project-planner",
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
