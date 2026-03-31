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
import { getLocationAvailability } from "@/sanity/queries/about-me/locationAvailability"
import { getPersonalStory } from "@/sanity/queries/about-me/personalStory"
import { getSectionHeader } from "@/sanity/queries/about-me/sectionHeader"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import React from "react"
import { getTechnologies } from "@/sanity/queries/about-me/technologies"
import { getDevelopmentApproach } from "@/sanity/queries/about-me/developmentApproach"
import { getWhyChooseUs } from "@/sanity/queries/about-me/whyChooseUs"
import { headers } from "next/headers"
interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function AboutUs({ params }: PageProps) {
  const { lang } = await params
  const [
    seoData,
    sectionHeader,
    personalStory,
    locationAvailability,
    stats,
    technologies,
    developmentApproach,
    whyChooseUs,
  ] = await Promise.all([
    getSeoSchema("about"),
    getSectionHeader(),
    getPersonalStory(),
    getLocationAvailability(),
    getStats(),
    getTechnologies(),
    getDevelopmentApproach(),
    getWhyChooseUs(),
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
        id="about"
        className="py-16 bg-gradient-to-br from-slate-50 to-orange-50"
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
              <StatsGrid stats={stats} />
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

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const canonicalUrl = seoData?.canonicalUrl
    ? `${baseUrl}/${lang}/${seoData.canonicalUrl}`
    : `${baseUrl}/${lang}/about-me`

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
        en: `${baseUrl}/en/about-me`,
        es: `${baseUrl}/es/about-me`,
        "x-default": `${baseUrl}/en/about-me`,
      },
    },
  }
}
