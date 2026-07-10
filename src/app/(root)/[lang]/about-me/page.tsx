// import CTASection from "@/components/AboutUsSectionComponents/CTASection"
import DevelopmentApproach from "@/components/AboutUsSectionComponents/DevelopmentApproach"
import LocationAvailability from "@/components/AboutUsSectionComponents/LocationAvailability"
import PersonalStory from "@/components/AboutUsSectionComponents/PersonalStory"
import ProfileCard from "@/components/AboutUsSectionComponents/ProfileCard"
import SectionHeader from "@/components/AboutUsSectionComponents/SectionHeader"
import StatsGrid from "@/components/AboutUsSectionComponents/StatsGrid"
import TechStack from "@/components/AboutUsSectionComponents/TechStack"
import WhyChooseUs from "@/components/AboutUsSectionComponents/WhyChooseUs"
import { getStats } from "@/sanity/queries/layout/stats"
import { getTrustSignals } from "@/sanity/queries/home/trustSignals"
import { getLocationAvailability } from "@/sanity/queries/about-me/locationAvailability"
import { getPersonalStory } from "@/sanity/queries/about-me/personalStory"
import { getSectionHeader } from "@/sanity/queries/about-me/sectionHeader"
import { getSEO } from "@/sanity/queries/seo"
import { getStandardGraph } from "@/lib/schema/graph"
import { JsonLd } from "@/components/seo/JsonLd"
import { Metadata } from "next"
import React from "react"
import { getTechnologies } from "@/sanity/queries/about-me/technologies"
import { getDevelopmentApproach } from "@/sanity/queries/about-me/developmentApproach"
import { getWhyChooseUs } from "@/sanity/queries/about-me/whyChooseUs"
import { buildAlternates } from "@/lib/urls"

export const revalidate = 86400

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function AboutUs({ params }: PageProps) {
  const { lang } = await params
  const [
    graph,
    sectionHeader,
    personalStory,
    locationAvailability,
    stats,
    technologies,
    developmentApproach,
    whyChooseUs,
    trustSignals,
  ] = await Promise.all([
    getStandardGraph({
      lang,
      pageName: "about",
      href: "/about-me",
      includePerson: true,
      crumbs: [
        { name: lang === "es" ? "Inicio" : "Home", href: "/" },
        { name: lang === "es" ? "Sobre mí" : "About", href: "/about-me" },
      ],
    }),
    getSectionHeader(),
    getPersonalStory(),
    getLocationAvailability(),
    getStats(),
    getTechnologies(),
    getDevelopmentApproach(),
    getWhyChooseUs(),
    getTrustSignals(),
  ])

  return (
    <>
      <JsonLd data={graph} />
      <section
        id="about"
        className="py-16 bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-950 dark:to-slate-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <SectionHeader
            title={sectionHeader.title[lang]}
            description={sectionHeader.description[lang]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Personal Information */}
            <div>
              <ProfileCard
                name="James Karnes"
                location={sectionHeader.basedOutOf[lang]}
              />
              <PersonalStory
                title={personalStory.title[lang]}
                story1={personalStory.story1[lang]}
                story2={personalStory.story2[lang]}
              />
              <LocationAvailability
                availabilityItems={locationAvailability.availabilityItems.map(
                  item => item[lang],
                )}
                title={locationAvailability.title[lang]}
              />
            </div>

            {/* Right Column - Technical Information */}
            <div>
              <StatsGrid
                stats={{
                  // Single source of truth for the project count is the
                  // trustSignals doc (shared with the homepage/footer).
                  projectsCompleted:
                    trustSignals?.stats?.projectsCompleted ??
                    stats.websitesDelivered,
                  yearsExperience: stats.yearsExperience,
                }}
              />
              <TechStack
                technologies={technologies.technologies}
                title={technologies.title[lang]}
              />
              <DevelopmentApproach
                approaches={developmentApproach.approaches.map(approach => ({
                  iconName: approach.iconName,
                  title: approach.title[lang],
                  description: approach.description[lang],
                }))}
                title={developmentApproach.title[lang]}
              />
              <WhyChooseUs
                reasons={whyChooseUs.reasons.map(reason => ({
                  title: reason.title[lang],
                  description: reason.description[lang],
                }))}
                title={whyChooseUs.title[lang]}
              />
            </div>
          </div>

          {/* Call to Action */}
          {/* <CTASection /> */}
        </div>
      </section>
    </>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("about")

  if (!seoData) return {}

  const { canonical: canonicalUrl, languages } = buildAlternates({
    currentLocale: lang,
    hrefFor: () => "/about-me",
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
