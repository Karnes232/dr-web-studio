import BlogPostContent from "@/components/BlogComponents/BlogPost/BlogPostContent"
import BlogPostHeader from "@/components/BlogComponents/BlogPost/BlogPostHeader"
import RelatedPosts from "@/components/BlogComponents/RelatedPosts"
import {
  getBlogPostBySlug,
  getBlogPostSEO,
  getRelatedBlogPosts,
} from "@/sanity/queries/blog/blog"
import { Metadata } from "next"
import React from "react"
import { notFound } from "next/navigation"
import { SITE_URL } from "@/lib/site"
import { getAllBlogPostsSitemap } from "@/sanity/queries/blog/blog"

export const revalidate = 3600

export async function generateStaticParams() {
  const posts = await getAllBlogPostsSitemap()
  return posts.flatMap(post => [
    { lang: "en", slug: post.slug.current },
    { lang: "es", slug: post.slug.current },
  ])
}

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
    slug: string
  }>
}

export default async function BlogPost({ params }: PageProps) {
  const { lang, slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) {
    return notFound()
  }
  const categorySlugs =
    post?.categories?.map(
      (c: { slug: { current: string } }) => c.slug.current,
    ) ?? []
  const relatedPosts = await getRelatedBlogPosts(slug, categorySlugs, 10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {post?.seo?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: post.seo.structuredData[lang],
          }}
        />
      )}
      <BlogPostHeader post={post} lang={lang} />
      <BlogPostContent body={post?.body} lang={lang} />
      <RelatedPosts posts={relatedPosts} lang={lang} />
    </div>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params
  const seoData = await getBlogPostSEO(slug)

  if (!seoData) return {}
  const canonicalUrl = seoData?.seo?.canonicalUrl
    ? `${SITE_URL}/${lang}/blog/${seoData.seo.canonicalUrl}`
    : `${SITE_URL}/${lang}/blog/${slug}`

  return {
    title: seoData.seo.meta[lang]?.title,
    description: seoData.seo.meta[lang]?.description,
    keywords: seoData.seo.meta[lang]?.keywords.join(", "),
    openGraph: {
      title:
        seoData.seo.openGraph[lang]?.title || seoData.seo.meta[lang]?.title,
      description:
        seoData.seo.openGraph[lang]?.description ||
        seoData.seo.meta[lang]?.description,
      url: canonicalUrl,
      type: "article",
      locale: lang === "es" ? "es_ES" : "en_US",
      ...(seoData.publishedAt && { publishedTime: seoData.publishedAt }),
      ...(seoData._updatedAt && { modifiedTime: seoData._updatedAt }),
      ...(seoData.author?.name && { authors: [seoData.author.name] }),
      images: seoData.seo.openGraph.image
        ? [
            {
              url: seoData.seo.openGraph.image.url,
              width: seoData.seo.openGraph.image.width,
              height: seoData.seo.openGraph.image.height,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title:
        seoData.seo.openGraph[lang]?.title || seoData.seo.meta[lang]?.title,
      description:
        seoData.seo.openGraph[lang]?.description ||
        seoData.seo.meta[lang]?.description,
      images: seoData.seo.openGraph.image
        ? [seoData.seo.openGraph.image.url]
        : [],
    },
    robots: {
      index: !seoData.seo.noIndex,
      follow: !seoData.seo.noFollow,
    },
    ...(canonicalUrl && { canonical: canonicalUrl }),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/blog/${slug}`,
        es: `${SITE_URL}/es/blog/${slug}`,
        "x-default": `${SITE_URL}/en/blog/${slug}`,
      },
    },
  }
}
