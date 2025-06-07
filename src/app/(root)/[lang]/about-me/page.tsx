// import CTASection from "@/components/AboutUsSectionComponents/CTASection"
import DevelopmentApproach from "@/components/AboutUsSectionComponents/DevelopmentApproach"
import LocationAvailability from "@/components/AboutUsSectionComponents/LocationAvailability"
import PersonalStory from "@/components/AboutUsSectionComponents/PersonalStory"
import ProfileCard from "@/components/AboutUsSectionComponents/ProfileCard"
import SectionHeader from "@/components/AboutUsSectionComponents/SectionHeader"
import StatsGrid from "@/components/AboutUsSectionComponents/StatsGrid"
import TechStack from "@/components/AboutUsSectionComponents/TechStack"
import WhyChooseUs from "@/components/AboutUsSectionComponents/WhyChooseUs"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import React from "react"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function AboutUs({ params }: PageProps) {
  const { lang } = await params
  const seoData = await getSeoSchema("about")

  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <SectionHeader
            title="About DR Web Studio"
            description="Professional web developer specializing in modern, fast, and SEO-optimized websites for businesses across the Dominican Republic and beyond."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Personal Information */}
            <div>
              <ProfileCard
                name="Your Web Developer"
                location="Based in Dominican Republic"
              />
              <PersonalStory />
              <LocationAvailability />
            </div>

            {/* Right Column - Technical Information */}
            <div>
              <StatsGrid />
              <TechStack />
              <DevelopmentApproach />
              <WhyChooseUs />
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
