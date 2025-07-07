import BlockContent from "@/components/BlogComponents/BlogPost/BlockContent/BlockContent"
import { getLegal } from "@/sanity/queries/legal/legal"
import { getSEO } from "@/sanity/queries/seo"
import { Metadata } from "next"
import { headers } from "next/headers"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function PrivacyPolicy({ params }: PageProps) {
  const { lang } = await params
  const legalData = await getLegal("privacy-policy")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="prose prose-lg prose-slate max-w-none">
          <BlockContent
            content={legalData?.content as any}
            language={lang as "en" | "es"}
          />
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("privacy-policy")

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const canonicalUrl = seoData?.canonicalUrl
    ? `${baseUrl}/${lang}/${seoData.canonicalUrl}`
    : `${baseUrl}/${lang}/privacy-policy`

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
    ...(canonicalUrl && { canonical: canonicalUrl }),
    alternates: {
      canonical: canonicalUrl,
    },
  }
}
