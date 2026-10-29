import CustomQuoteCard from "@/components/PricingPageComponents/CustomQuoteCard"
import PricingCard from "@/components/PricingPageComponents/PricingCard"
import PricingFAQ from "@/components/PricingPageComponents/PricingFAQ"
import PricingHeader from "@/components/PricingPageComponents/PricingHeader"
import CustomSolutionCTA from "@/components/ServicesComponents/CustomSolutionCTA"
import { getFAQs } from "@/sanity/queries/pricing/faq"
import { getFAQsHeader } from "@/sanity/queries/pricing/faqsHeader"
import { getPricingData } from "@/sanity/queries/pricing/pricingData"
import { getPricingHeader } from "@/sanity/queries/pricing/pricingHeader"
import { getSEO } from "@/sanity/queries/seo"
import { getStandardGraph } from "@/lib/schema/graph"
import { JsonLd } from "@/components/seo/JsonLd"
import { getCustomSolutionCTA } from "@/sanity/queries/services/customSolutionCTA"
import { Metadata } from "next"
import React from "react"
import { buildAlternates } from "@/lib/urls"

export const revalidate = 86400

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

/**
 * Centres a short last row. On the xl six-column grid (three cards a row) a
 * row of two starts at column 2 and a row of one at column 3; on the md
 * two-column grid an odd last card spans both columns at single-card width.
 */
function lastRowStart(index: number, count: number): string {
  const classes: string[] = []
  if (count % 3 === 2 && index === count - 2) classes.push("xl:col-start-2")
  if (count % 3 === 1 && index === count - 1) classes.push("xl:col-start-3")
  if (count % 2 === 1 && index === count - 1)
    classes.push(
      "md:col-span-2 md:w-[calc(50%-1rem)] md:justify-self-center xl:w-auto xl:justify-self-stretch",
    )
  return classes.join(" ")
}

export default async function Pricing({ params }: PageProps) {
  const { lang } = await params
  const [customSolutionCTA, pricingHeader, faqsHeader, faqs, pricingData] =
    await Promise.all([
      getCustomSolutionCTA(),
      getPricingHeader(),
      getFAQsHeader(),
      getFAQs(),
      getPricingData(),
    ])
  const graph = await getStandardGraph({
    lang,
    pageName: "pricing",
    href: "/pricing",
    withOffers: true,
    faqItems: faqs.map(f => ({
      question: f.question[lang],
      answer: f.answer[lang],
    })),
    crumbs: [
      { name: lang === "es" ? "Inicio" : "Home", href: "/" },
      { name: lang === "es" ? "Precios" : "Pricing", href: "/pricing" },
    ],
  })
  return (
    <>
      <JsonLd data={graph} />
      <section
        id="pricing"
        className="py-20 bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-950 dark:to-slate-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <PricingHeader
            title={pricingHeader?.title[lang]}
            description={pricingHeader?.description[lang]}
          />

          {/* Pricing Cards */}
          {/* Three per row on a six-column grid, each card two columns wide,
              so a short last row can be centred (3 + 2 for five cards) while
              auto-rows-fr keeps both rows the same height. */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 xl:auto-rows-fr gap-8 mb-16">
            {pricingData.map((pkg, index) => (
              <div
                key={index}
                className={`xl:col-span-2 ${lastRowStart(index, pricingData.length)}`}
              >
                <PricingCard pricingData={pkg} lang={lang} />
              </div>
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
