import BlogContent from "@/components/BlogComponents/BlogContent"
import { getAllBlogPosts } from "@/sanity/queries/blog/blog"
import { getAllCategories } from "@/sanity/queries/blog/categories"
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { getBlogHeader } from "@/sanity/queries/blog/blogHeader"
import { Metadata } from "next"
import React from "react"
import { headers } from "next/headers"
const POSTS_PER_PAGE = 6

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
  searchParams: Promise<{ page?: string }>
}

export default async function Blog({ params, searchParams }: PageProps) {
  const { lang } = await params
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)

  const seoData = await getSeoSchema("blog")
  const headerData = await getBlogHeader()
  const blogPosts = await getAllBlogPosts()
  const categories = await getAllCategories()

  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE)
  const validPage = Math.min(currentPage, Math.max(1, totalPages))
  const startIndex = (validPage - 1) * POSTS_PER_PAGE
  const initialPaginatedPosts = blogPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE,
  )

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
        initialPage={validPage}
        initialPaginatedPosts={initialPaginatedPosts}
        totalPages={totalPages}
        postsPerPage={POSTS_PER_PAGE}
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
        en: `${baseUrl}/en/blog`,
        es: `${baseUrl}/es/blog`,
        "x-default": `${baseUrl}/en/blog`,
      },
    },
  }
}
