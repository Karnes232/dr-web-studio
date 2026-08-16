import BlogContent from "@/components/BlogComponents/BlogContent"
import { getBlogPostsForListing } from "@/sanity/queries/blog/blog"
import { getAllCategories } from "@/sanity/queries/blog/categories"
import { getSEO } from "@/sanity/queries/seo"
import { getStandardGraph } from "@/lib/schema/graph"
import { JsonLd } from "@/components/seo/JsonLd"
import { getBlogHeader } from "@/sanity/queries/blog/blogHeader"
import { Metadata } from "next"
import React from "react"
import { buildAlternates } from "@/lib/urls"

export const revalidate = 86400

const POSTS_PER_PAGE = 6

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
  }>
  searchParams: Promise<{ page?: string; q?: string }>
}

export default async function Blog({ params, searchParams }: PageProps) {
  const { lang } = await params
  const { page: pageParam, q } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)

  const [graph, headerData, blogPosts, categories] = await Promise.all([
    getStandardGraph({
      lang,
      pageName: "blog",
      href: "/blog",
      crumbs: [
        { name: lang === "es" ? "Inicio" : "Home", href: "/" },
        { name: "Blog", href: "/blog" },
      ],
    }),
    getBlogHeader(),
    getBlogPostsForListing(),
    getAllCategories(),
  ])

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
      <JsonLd data={graph} />
      <BlogContent
        categories={categories}
        lang={lang}
        blogPosts={blogPosts}
        header={headerData}
        initialPage={validPage}
        initialPaginatedPosts={initialPaginatedPosts}
        totalPages={totalPages}
        postsPerPage={POSTS_PER_PAGE}
        initialSearchTerm={q}
      />
    </>
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { lang } = await params
  const { page: pageParam } = await searchParams
  const seoData = await getSEO("blog")

  if (!seoData) return {}

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)
  // Paginated listings self-canonicalize (?page=N) — pointing every page at
  // page 1 marks pages 2..N as duplicates. hreflang alternates carry the same
  // suffix so each paginated cluster stays self-consistent.
  const pageSuffix = page > 1 ? `?page=${page}` : ""
  const alternates = buildAlternates({
    currentLocale: lang,
    hrefFor: () => "/blog",
  })
  const canonicalUrl = alternates.canonical + pageSuffix
  const languages = Object.fromEntries(
    Object.entries(alternates.languages).map(([l, url]) => [
      l,
      url + pageSuffix,
    ]),
  )

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
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  }
}
