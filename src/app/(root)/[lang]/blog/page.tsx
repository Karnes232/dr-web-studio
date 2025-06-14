import BlogContent from "@/components/BlogComponents/BlogContent"
import { getAllBlogPosts } from "@/sanity/queries/blog"
import { getAllCategories } from "@/sanity/queries/categories"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { getBlogHeader } from "@/sanity/queries/blogHeader"
import { Metadata } from "next"
import React from "react"

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
