import ContactFAQ from "@/components/ContactPageComponents/ContactFAQ"
import ContactForm from "@/components/ContactPageComponents/ContactForm"
import ContactHero from "@/components/ContactPageComponents/ContactHero"
import LocationInfo from "@/components/ContactPageComponents/LocationInfo"
import { getContactFaqs } from "@/sanity/queries/contact/contactFaq"
import { getContactHero } from "@/sanity/queries/contact/contactHero"
import { getLocationInfo } from "@/sanity/queries/contact/locationInfo"
import { getFAQsHeader } from "@/sanity/queries/pricing/faqsHeader"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import React from "react"
import { headers } from "next/headers"
interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function Contact({ params }: PageProps) {
  const { lang } = await params
  const seoData = await getSeoSchema("contact")
  const contactHero = await getContactHero()
  const locationInfo = await getLocationInfo()
  const faqsHeader = await getFAQsHeader()
  const contactFaqs = await getContactFaqs()

  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-slate-50 to-orange-50"
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

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const canonicalUrl = seoData?.canonicalUrl
    ? `${baseUrl}/${lang}/${seoData.canonicalUrl}`
    : `${baseUrl}/${lang}/contact`

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
    ...(canonicalUrl && { canonical: canonicalUrl }),
    alternates: {
      canonical: canonicalUrl,
    },
  }
}
