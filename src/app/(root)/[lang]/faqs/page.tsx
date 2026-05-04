import { getSEO } from "@/sanity/queries/seo"
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
  const [faqData, faqsHeaderData] = await Promise.all([
    getFaqs(),
    getFaqsHeader(),
  ])

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.categories.flatMap(category =>
      category.questions.map(q => ({
        "@type": "Question",
        name: q.question[lang],
        acceptedAnswer: {
          "@type": "Answer",
          text: q.answer[lang],
        },
      })),
    ),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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

  if (!seoData) return {}

  const canonicalUrl = seoData.canonicalUrl
    ? `${baseUrl}/${lang}/${seoData.canonicalUrl}`
    : `${baseUrl}/${lang}/faqs`

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
        en: `${baseUrl}/en/faqs`,
        es: `${baseUrl}/es/faqs`,
        "x-default": `${baseUrl}/en/faqs`,
      },
    },
  }
}
