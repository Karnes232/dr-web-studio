import { client } from "@/sanity/lib/client"
import HeroSection from "@/components/HeroComponent/HeroSection"
import QuickServicesOverview from "@/components/ServicesOverview/QuickServicesOverview"
import TrustSignals from "@/components/TrustSignalsComponents/TrustSignals"
import { getTranslation } from "@/i18n"
import { Metadata } from "next"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"

async function getContent() {
  const query = `*[_type == "heroSection"][0] {
heading,
subheading,
visualElements[]-> {
  _id,
  title,
  icon {
    asset-> {
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
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

export default async function Home({ params }: PageProps) {
  const { lang } = await params
  const seoData = await getSeoSchema("home")

  const [pageData, { t }] = await Promise.all([
    getContent(),
    getTranslation(lang),
  ])

  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <main className="">
        <HeroSection
          heading={pageData.heading ? pageData.heading[lang] : pageData.heading}
          subheading={
            pageData.subheading
              ? pageData.subheading[lang]
              : pageData.subheading
          }
          backgroundImage={pageData.backgroundImage}
          visualElements={pageData.visualElements}
        />
        <QuickServicesOverview />
        <TrustSignals />
      </main>
    </>
  )
}