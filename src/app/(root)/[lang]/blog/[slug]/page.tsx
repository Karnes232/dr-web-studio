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
import { getAllBlogPostsSitemap } from "@/sanity/queries/blog/blog"
import { buildAlternates } from "@/lib/urls"
import { slugPair } from "@/lib/slugs"
import SetLocalizedHrefs from "@/i18n/SetLocalizedHrefs"

export const revalidate = 86400

export async function generateStaticParams() {
  const posts = await getAllBlogPostsSitemap()
  return posts.flatMap(post => {
    const pair = slugPair(post)
    return [
      { lang: "en", slug: pair.en },
      { lang: "es", slug: pair.es },
    ]
  })
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
  const relatedPosts = await getRelatedBlogPosts(
    post.slug.current,
    categorySlugs,
    10,
  )

  const slugs = slugPair(post)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-950 dark:to-slate-950">
      <SetLocalizedHrefs
        pathname="/blog/[slug]"
        enSlug={slugs.en}
        esSlug={slugs.es}
      />
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
  const pair = slugPair(seoData)
  const { canonical: canonicalUrl, languages } = buildAlternates({
    currentLocale: lang,
    hrefFor: l => ({ pathname: "/blog/[slug]", params: { slug: pair[l] } }),
  })

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
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  }
}
