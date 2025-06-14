"use client"
import { useLocale } from "@/i18n/useLocale"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

interface BlogCardProps {
  post: {
    title: {
      en: string
      es: string
    }
    slug: {
      current: string
    }
    description: {
      en: string
      es: string
    }
    categories: Array<{
      title: {
        en: string
        es: string
      }
      slug: {
        current: string
      }
    }>
    publishedAt: string
    readTime: number
    imageUrl: string
    tags: {
      en: string[]
      es: string[]
    }
  }
  lang: "en" | "es"
}

const BlogCard = ({ post, lang }: BlogCardProps) => {
  const { t } = useLocale()
  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <Image
          src={post.imageUrl}
          alt={post.title[lang]}
          width={500}
          height={500}
          className="w-full h-48 object-cover"
        />
        {post.categories[0] && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium px-3 py-1 rounded-full">
              {post.categories[0].title[lang]}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
          {post.title[lang]}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(post.publishedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <Clock className="h-4 w-4 mr-2" />
            {post.readTime} min read
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags &&
              post.tags[lang]?.slice(0, 2).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
          </div>

              <Link href={`/${lang}/blog/${post.slug.current}`} className="text-orange-500 hover:text-orange-600 font-medium flex items-center transition-colors">
            {t("blog.readMore")}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default BlogCard
