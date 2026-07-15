"use client"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import BlogCard from "./BlogCard"
import { useLocale } from "@/i18n/useLocale"
import type { BlogPost } from "@/sanity/queries/blog/blog"

// Swiper is heavy and this section sits below the fold, so its JS+CSS load only
// after the browser is idle (or never, on a quick bounce). Until then — and in
// the SSR HTML / with JS disabled — a plain responsive grid renders the same
// posts, keeping the internal links crawlable.
const RelatedPostsCarousel = dynamic(() => import("./RelatedPostsCarousel"), {
  ssr: false,
})

interface RelatedPostsProps {
  posts: BlogPost[]
  lang: "en" | "es"
}

const RelatedPosts = ({ posts, lang }: RelatedPostsProps) => {
  const { t } = useLocale()
  const [enhance, setEnhance] = useState(false)

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    let id: number
    let usedIdle = false
    if (typeof w.requestIdleCallback === "function") {
      usedIdle = true
      id = w.requestIdleCallback(() => setEnhance(true), { timeout: 2500 })
    } else {
      id = window.setTimeout(() => setEnhance(true), 1500)
    }
    return () => {
      if (usedIdle) w.cancelIdleCallback?.(id)
      else window.clearTimeout(id)
    }
  }, [])

  if (!posts.length) return null

  if (enhance) {
    return <RelatedPostsCarousel posts={posts} lang={lang} />
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">
        {t("blog.relatedPosts")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <BlogCard
            key={post.slug.current}
            post={post}
            lang={lang}
            shadow={false}
          />
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
