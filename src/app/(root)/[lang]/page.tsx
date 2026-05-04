import { Suspense } from "react"
import { client } from "@/sanity/lib/client"
import HeroSection from "@/components/HeroComponent/HeroSection"
import QuickServicesOverview from "@/components/ServicesOverview/QuickServicesOverview"
import TrustSignals from "@/components/TrustSignalsComponents/TrustSignals"
import { Metadata } from "next"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { getHomePageService } from "@/sanity/queries/home/homePageService"
import { getServices } from "@/sanity/queries/services/services"
import { getTrustSignals } from "@/sanity/queries/home/trustSignals"
import { getPreviousClients } from "@/sanity/queries/home/previousClients"
import { getAllTestimonials } from "@/sanity/queries/home/testimonials"
import { headers } from "next/headers"

async function getContent() {
  const query = `*[_type == "heroSection"][0] {
heading,
subheading,
visualElements[]-> {
  _id,
  title,
  icon,
  gradientFrom,
  gradientTo,
  heading,
  description,
  badges,
  order
},
backgroundImage {
  asset->{
    url,
    metadata {
      dimensions,
      lqip,
      palette
    }
  }
}
}
`
  return await client.fetch(query)
}

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("home")

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  if (!seoData) return {}

  const canonicalUrl = seoData.canonicalUrl
    ? `${baseUrl}/${lang}/${seoData.canonicalUrl}`
    : `${baseUrl}/${lang}`

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
    ...(canonicalUrl && { canonical: canonicalUrl }),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        "x-default": `${baseUrl}/en`,
      },
    },
  }
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params
  const [
    seoData,
    pageData,
    serviceData,
    services,
    trustSignals,
    previousClients,
    testimonials,
  ] = await Promise.all([
    getSeoSchema("home"),
    getContent(),
    getHomePageService(),
    getServices(),
    getTrustSignals(),
    getPreviousClients(),
    getAllTestimonials(),
  ])

  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <main className="bg-gradient-to-br from-slate-50 to-orange-50">
        <HeroSection
          heading={pageData.heading ? pageData.heading[lang] : pageData.heading}
          subheading={
            pageData.subheading
              ? pageData.subheading[lang]
              : pageData.subheading
          }
          backgroundImage={pageData.backgroundImage}
          visualElements={pageData.visualElements}
          lang={lang}
        />
        <QuickServicesOverview
          title={serviceData.title[lang]}
          subtitle={serviceData.subtitle[lang]}
          ctaText={serviceData.ctaButton.text[lang]}
          services={services}
          lang={lang}
        />
        <Suspense fallback={null}>
          <TrustSignals
            title={trustSignals.title[lang]}
            subtitle={trustSignals.subtitle[lang]}
            previousClients={previousClients}
            testimonials={testimonials}
          />
        </Suspense>
      </main>
    </>
  )
}
