import { Suspense } from "react"
import { client } from "@/sanity/lib/client"
import HeroSection from "@/components/HeroComponent/HeroSection"
import QuickServicesOverview from "@/components/ServicesOverview/QuickServicesOverview"
import HomeFeaturedWork from "@/components/HomeFeaturedWorkComponents/HomeFeaturedWork"
import TrustSignals from "@/components/TrustSignalsComponents/TrustSignals"
import { Metadata } from "next"
import { getSEO } from "@/sanity/queries/seo"
import { getHomeGraph } from "@/lib/schema/graph"
import { JsonLd } from "@/components/seo/JsonLd"
import { getHomePageService } from "@/sanity/queries/home/homePageService"
import { getServices } from "@/sanity/queries/services/services"
import {
  getProjects,
  projectProjection,
} from "@/sanity/queries/portfolio/project"
import { getHomeFeaturedWork } from "@/sanity/queries/home/homeFeaturedWork"
import { getTrustSignals } from "@/sanity/queries/home/trustSignals"
import { getPreviousClients } from "@/sanity/queries/home/previousClients"
import { getAllTestimonials } from "@/sanity/queries/home/testimonials"
import { buildAlternates } from "@/lib/urls"

export const revalidate = 86400

async function getContent() {
  const query = `*[_type == "heroSection"][0] {
heading,
subheading,
heroProjects[]-> ${projectProjection},
backgroundImage {
  asset->{
    _id,
    url,
    metadata {
      dimensions,
      lqip,
      palette
    }
  }
}
}
`
  return await client.fetch(query)
}

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("home")

  if (!seoData) return {}

  const { canonical: canonicalUrl, languages } = buildAlternates({
    currentLocale: lang,
    hrefFor: () => "/",
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

export default async function Home({ params }: PageProps) {
  const { lang } = await params
  const [
    graph,
    pageData,
    serviceData,
    services,
    trustSignals,
    previousClients,
    testimonials,
    projects,
    featuredWork,
  ] = await Promise.all([
    getHomeGraph(lang),
    getContent(),
    getHomePageService(),
    getServices(),
    getTrustSignals(),
    getPreviousClients(),
    getAllTestimonials(),
    getProjects(),
    getHomeFeaturedWork(),
  ])

  // Fallback when an editor hasn't picked projects yet: featured-first, then latest.
  const latestProjects = [
    ...projects.filter(p => p.featured),
    ...projects.filter(p => !p.featured),
  ].slice(0, 3)

  // Editor-selected projects (Sanity) win; otherwise fall back to latest.
  const heroProjects = pageData?.heroProjects?.length
    ? pageData.heroProjects
    : latestProjects
  const recentWorkProjects = featuredWork?.projects?.length
    ? featuredWork.projects
    : latestProjects
   
  return (
    <>
      <JsonLd data={graph} />
      <main className="bg-white dark:bg-slate-900">
        <HeroSection
          heading={pageData.heading ? pageData.heading[lang] : pageData.heading}
          subheading={
            pageData.subheading
              ? pageData.subheading[lang]
              : pageData.subheading
          }
          backgroundImage={pageData.backgroundImage}
          projects={heroProjects}
          lang={lang}
          happyClients={trustSignals.stats?.happyClients ?? 20}
        />
        <QuickServicesOverview
          title={serviceData.title[lang]}
          subtitle={serviceData.subtitle[lang]}
          ctaText={serviceData.ctaButton.text[lang]}
          services={services}
          lang={lang}
        />
        {recentWorkProjects.length > 0 && (
          <HomeFeaturedWork
            projects={recentWorkProjects}
            title={featuredWork?.title?.[lang]}
            subtitle={featuredWork?.subtitle?.[lang]}
            lang={lang}
          />
        )}
        <Suspense fallback={null}>
          <TrustSignals
            title={trustSignals.title[lang]}
            subtitle={trustSignals.subtitle[lang]}
            previousClients={previousClients}
            testimonials={testimonials}
            stats={trustSignals.stats}
          />
        </Suspense>
      </main>
    </>
  )
}
