"use client"
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Eye,
  Heart,
  Tag,
  User,
} from "lucide-react"
import Image from "next/image"
import React, { useState } from "react"
import ShareButtons from "./ShareButtons"
import { Link } from "@/i18n/navigation"
import { useLocale } from "@/i18n/useLocale"
import { type Locale } from "@/lib/slugs"

const BlogPostHeader = ({ post, lang }: { post: any; lang: string }) => {
  const { t } = useLocale()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  return (
    <div className="">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("blog.backToBlog")}
          </Link>
        </div>

        {/* Category and Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
            {post.category}
          </span> */}
          {/* {post.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full"
            >
              <Tag className="h-3 w-3 inline mr-1" />
              {tag}
            </span>
          ))} */}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-6 leading-tight">
          {post.title[lang]}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 mb-8">
          {post.author?.name ? (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>
                {t("blog.by")}{" "}
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {post.author.name}
                </span>
              </span>
            </div>
          ) : null}

          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(post.publishedAt).toLocaleDateString(
              lang === "es" ? "es-ES" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </div>

          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {post.readTime} min read
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          {/* <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                isLiked
                  ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-300"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
              />
              <span>Save</span>
            </button>
          </div> */}

          <ShareButtons post={post} lang={lang as Locale} />
        </div>

        {/* Featured Image */}
        {post.imageUrl ? (
          <div className="mb-8">
            <Image
              src={post.imageUrl}
              alt={post.title[lang]}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
              width={1200}
              height={600}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 960px"
              priority
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default BlogPostHeader
