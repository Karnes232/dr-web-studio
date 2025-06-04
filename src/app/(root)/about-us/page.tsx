// import CTASection from "@/components/AboutUsSectionComponents/CTASection"
import DevelopmentApproach from "@/components/AboutUsSectionComponents/DevelopmentApproach"
import LocationAvailability from "@/components/AboutUsSectionComponents/LocationAvailability"
import PersonalStory from "@/components/AboutUsSectionComponents/PersonalStory"
import ProfileCard from "@/components/AboutUsSectionComponents/ProfileCard"
import SectionHeader from "@/components/AboutUsSectionComponents/SectionHeader"
import StatsGrid from "@/components/AboutUsSectionComponents/StatsGrid"
import TechStack from "@/components/AboutUsSectionComponents/TechStack"
import WhyChooseUs from "@/components/AboutUsSectionComponents/WhyChooseUs"
import React from "react"

export default function AboutUs() {
  return (
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
  )
}
