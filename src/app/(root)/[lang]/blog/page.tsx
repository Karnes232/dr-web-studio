import BlogContent from "@/components/BlogComponents/BlogContent"
import { getAllBlogPosts } from "@/sanity/queries/blog/blog"
import { getAllCategories } from "@/sanity/queries/blog/categories"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { getBlogHeader } from "@/sanity/queries/blog/blogHeader"
import { Metadata } from "next"
import React from "react"
import { headers } from "next/headers"
interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
}

export default async function Blog({ params }: PageProps) {
  const { lang } = await params
  const seoData = await getSeoSchema("blog")
  const headerData = await getBlogHeader()
  const blogPosts = await getAllBlogPosts()
  const categories = await getAllCategories()

  if (!headerData) {
    throw new Error("Blog header data not found")
  }
  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <BlogContent
        categories={categories}
        lang={lang}
        blogPosts={blogPosts}
        header={headerData}
      />
    </>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("blog")

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const canonicalUrl = seoData?.canonicalUrl
    ? `${baseUrl}/${lang}/${seoData.canonicalUrl}`
    : `${baseUrl}/${lang}/blog`

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
