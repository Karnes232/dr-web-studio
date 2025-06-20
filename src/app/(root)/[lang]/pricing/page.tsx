import CustomQuoteCard from "@/components/PricingPageComponents/CustomQuoteCard"
import PricingCard from "@/components/PricingPageComponents/PricingCard"
import PricingFAQ from "@/components/PricingPageComponents/PricingFAQ"
import PricingHeader from "@/components/PricingPageComponents/PricingHeader"
import CustomSolutionCTA from "@/components/ServicesComponents/CustomSolutionCTA"
import { getFAQs } from "@/sanity/queries/pricing/faq"
import { getFAQsHeader } from "@/sanity/queries/pricing/faqsHeader"
import { getPricingData } from "@/sanity/queries/pricing/pricingData"
import { getPricingHeader } from "@/sanity/queries/pricing/pricingHeader"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { getCustomSolutionCTA } from "@/sanity/queries/services/customSolutionCTA"
import { Globe, MessageCircle, ShoppingCart, Zap } from "lucide-react"
import { Metadata } from "next"
import React from "react"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

type PricingPackage = {
  title: string
  price: string
  originalPrice: string
  description: string
  iconName: "Zap" | "Globe" | "ShoppingCart"
  variant?: "default" | "popular" | "premium"
  badge?: { text: string; variant: string }
  features: (string | { text: string; included?: boolean })[]
  ctaText: string
  ctaHref: string
}



export default async function Pricing({ params }: PageProps) {
  const { lang } = await params
  const seoData = await getSeoSchema("pricing")
  const customSolutionCTA = await getCustomSolutionCTA()
  const pricingHeader = await getPricingHeader()
  const faqsHeader = await getFAQsHeader()
  const faqs = await getFAQs()
  const pricingData = await getPricingData()
  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <section
        id="pricing"
        className="py-20 bg-gradient-to-br from-slate-50 to-orange-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <PricingHeader
            title={pricingHeader?.title[lang]}
            description={pricingHeader?.description[lang]}
          />

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {pricingData.map((pkg, index) => (
              <PricingCard key={index} pricingData={pkg} lang={lang} />
            ))}
          </div>

     
          <div className="mb-16">
            <CustomSolutionCTA customSolutionCTA={customSolutionCTA} />
          </div>

          {/* FAQ Section */}
          <PricingFAQ
            title={faqsHeader?.title[lang]}
            subtitle={faqsHeader?.subtitle[lang]}
            faqs={faqs}
            lang={lang}
          />
        </div>
      </section>
    </>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("pricing")

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
