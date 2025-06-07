import ContactFAQ from "@/components/ContactPageComponents/ContactFAQ"
import ContactForm from "@/components/ContactPageComponents/ContactForm"
import ContactHero from "@/components/ContactPageComponents/ContactHero"
import LocationInfo from "@/components/ContactPageComponents/LocationInfo"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import React from "react"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function Contact({ params }: PageProps) {
  const { lang } = await params
  const seoData = await getSeoSchema("contact")

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
          <ContactHero />
          {/* <ContactMethods /> */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <ContactForm />
            <div className="space-y-8">
              <LocationInfo />
              <ContactFAQ />
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
