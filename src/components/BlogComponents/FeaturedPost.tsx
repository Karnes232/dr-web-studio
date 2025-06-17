import { useLocale } from "@/i18n/useLocale"
import { ArrowRight, Calendar, Clock, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

interface FeaturedPostProps {
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

const FeaturedPost = ({ post, lang }: FeaturedPostProps) => {
  const { t, getLocalizedPath } = useLocale()

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mb-12">
      <div className="md:flex">
        <div className="md:w-1/2">
          <Image
            src={post.imageUrl}
            alt={post.title[lang]}
            width={500}
            height={500}
            className="h-64 md:h-full w-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-8">
          <div className="flex items-center mb-4">
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full">
              Featured
            </span>
            {post.categories[0] && (
              <span className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-full ml-2">
                {post.categories[0].title[lang]}
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
            {post.title[lang]}
          </h2>

          <p className="text-slate-600 mb-6 leading-relaxed">
            {post.description[lang]}
          </p>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-sm text-slate-500">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(post.publishedAt).toLocaleDateString()}
              <Clock className="h-4 w-4 mr-2 ml-4" />
              {post.readTime} min read
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags &&
              post.tags[lang]?.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
          </div>
          <Link
            href={getLocalizedPath(`/blog/${post.slug.current}`)}
            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {t("blog.readFullArticle")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FeaturedPost
