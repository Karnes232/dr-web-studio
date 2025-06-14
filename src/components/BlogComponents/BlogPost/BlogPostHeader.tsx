"use client"
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Eye,
  Heart,
  Tag,
} from "lucide-react"
import Image from "next/image"
import React, { useState } from "react"
import ShareButtons from "./ShareButtons"
import Link from "next/link"
import { useLocale } from "@/i18n/useLocale"

const BlogPostHeader = ({ post, lang }: { post: any; lang: string }) => {
  const { t, getLocalizedPath } = useLocale()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  return (
    <div className="">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href={getLocalizedPath("/blog")}
            className="inline-flex items-center text-slate-600 hover:text-orange-500 transition-colors"
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
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
          {post.title[lang]}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-8">
          {/* <div className="flex items-center">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <div className="font-medium">{post.author.name}</div>
            </div>
          </div> */}

          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {post.readTime} min read
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                isLiked
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
              />
              <span>Save</span>
            </button>
          </div>

          {/* <ShareButtons post={post} lang={lang} /> */}
        </div>

        {/* Featured Image */}
        <div className="mb-8">
          <Image
            src={post.imageUrl}
            alt={post.title[lang]}
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </div>
  )
}

export default BlogPostHeader
