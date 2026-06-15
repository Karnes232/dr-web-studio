"use client"
import BlogCard from "./BlogCard"
import { useLocale } from "@/i18n/useLocale"
import type { BlogPost } from "@/sanity/queries/blog/blog"
import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface RelatedPostsProps {
  posts: BlogPost[]
  lang: "en" | "es"
}

const RelatedPosts = ({ posts, lang }: RelatedPostsProps) => {
  const { t } = useLocale()
  if (!posts.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {t("blog.relatedPosts")}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous posts"
            className="related-posts-prev flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-orange-400 hover:text-orange-600 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next posts"
            className="related-posts-next flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-orange-400 hover:text-orange-600 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          prevEl: ".related-posts-prev",
          nextEl: ".related-posts-next",
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        className="related-posts-swiper pb-12"
      >
        {posts.map(post => (
          <SwiperSlide key={post.slug.current}>
            <BlogCard post={post} lang={lang} shadow={false} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default RelatedPosts
