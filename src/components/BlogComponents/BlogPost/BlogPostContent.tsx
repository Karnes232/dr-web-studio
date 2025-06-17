import React from "react"
import BlockContent from "./BlockContent/BlockContent"

const BlogPostContent = ({ body, lang }: { body: any; lang: string }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="prose prose-lg prose-slate max-w-none">
        <BlockContent content={body} language={lang as "en" | "es"} />
      </div>
    </div>
  )
}

export default BlogPostContent
