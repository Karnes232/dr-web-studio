import ContactFAQ from "@/components/ContactPageComponents/ContactFAQ"
import ContactForm from "@/components/ContactPageComponents/ContactForm"
import ContactHero from "@/components/ContactPageComponents/ContactHero"
import LocationInfo from "@/components/ContactPageComponents/LocationInfo"
import { getContactFaqs } from "@/sanity/queries/contact/contactFaq"
import { getContactHero } from "@/sanity/queries/contact/contactHero"
import { getLocationInfo } from "@/sanity/queries/contact/locationInfo"
import { getFAQsHeader } from "@/sanity/queries/pricing/faqsHeader"
import { getSEO } from "@/sanity/queries/seo"
import { getStandardGraph } from "@/lib/schema/graph"
import { JsonLd } from "@/components/seo/JsonLd"
import { Metadata } from "next"
import React from "react"
import { buildAlternates } from "@/lib/urls"

export const revalidate = 86400

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function Contact({ params }: PageProps) {
  const { lang } = await params
  const [graph, contactHero, locationInfo, faqsHeader, contactFaqs] =
    await Promise.all([
      getStandardGraph({
        lang,
        pageName: "contact",
        href: "/contact",
        crumbs: [
          { name: lang === "es" ? "Inicio" : "Home", href: "/" },
          { name: lang === "es" ? "Contacto" : "Contact", href: "/contact" },
        ],
      }),
      getContactHero(),
      getLocationInfo(),
      getFAQsHeader(),
      getContactFaqs(),
    ])

  return (
    <>
      <JsonLd data={graph} />
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-950 dark:to-slate-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactHero
            title={contactHero.title[lang]}
            highlightedText={contactHero.highlightedText[lang]}
            description={contactHero.description[lang]}
          />
          {/* <ContactMethods /> */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <ContactForm />
            <div className="space-y-8">
              <LocationInfo
                title={locationInfo.title[lang]}
                location={locationInfo.location[lang]}
                description={locationInfo.description[lang]}
                localAdvantageTitle={locationInfo.localAdvantage.title[lang]}
                localAdvantageDescription={
                  locationInfo.localAdvantage.description[lang]
                }
                emergencySupportTitle={
                  locationInfo.emergencySupport.title[lang]
                }
                emergencySupportDescription={
                  locationInfo.emergencySupport.description[lang]
                }
                language={lang}
              />
              <ContactFAQ
                title={faqsHeader.title[lang]}
                faqs={contactFaqs.map(faq => ({
                  question: faq.question[lang],
                  answer: faq.answer[lang],
                }))}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("contact")

  if (!seoData) return {}

  const { canonical: canonicalUrl, languages } = buildAlternates({
    currentLocale: lang,
    hrefFor: () => "/contact",
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
