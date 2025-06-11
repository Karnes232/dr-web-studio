import React from "react"
import { BlogHeader as BlogHeaderType } from "@/sanity/queries/blogHeader"

interface BlogHeaderProps {
  header: BlogHeaderType
  lang: "en" | "es"
}

const BlogHeader = ({ header, lang }: BlogHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {header.title[lang]}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {header.subtitle[lang]}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BlogHeader
