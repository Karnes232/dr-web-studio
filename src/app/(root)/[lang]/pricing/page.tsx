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
    customSolutionCTA,
    pricingHeader,
    faqsHeader,
    faqs,
    pricingData,
  ] = await Promise.all([
    getSeoSchema("pricing"),
    getCustomSolutionCTA(),
    getPricingHeader(),
    getFAQsHeader(),
    getFAQs(),
    getPricingData(),
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

  const { canonical: canonicalUrl, languages } = buildAlternates({
    currentLocale: lang,
    hrefFor: () => "/pricing",
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
