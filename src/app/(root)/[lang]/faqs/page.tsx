import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import { headers } from "next/headers"
import FaqsContent from "@/components/FaqsComponents/FaqsContent"
import { getFaqs } from "@/sanity/queries/faqs/faqs"
import { getFaqsHeader } from "@/sanity/queries/faqs/faqsHeader"
interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function Portfolio({ params }: PageProps) {
  const { lang } = await params
  const seoData = await getSeoSchema("faqs")
  const faqData = await getFaqs()
  const faqsHeaderData = await getFaqsHeader()

  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <FaqsContent
        lang={lang}
        faqData={faqData}
        faqsHeaderData={faqsHeaderData}
      />
    </>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("faqs")

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const canonicalUrl = seoData?.canonicalUrl
    ? `${baseUrl}/${lang}/${seoData.canonicalUrl}`
    : `${baseUrl}/${lang}/faqs`

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
      images: seoData.openGraph.image ? [{
        url: seoData.openGraph.image.url,
        width: seoData.openGraph.image.width,
        height: seoData.openGraph.image.height,
      }] : [],
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
