import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import React from "react"
import { slugForLocale } from "@/lib/slugs"

/** Recent blog posts with links – gives every post an incoming link from the homepage (fixes orphan pages in Ahrefs). */
const LatestFromBlog = ({
  posts,
  lang,
  title,
  viewAllLabel,
}: {
  posts: Array<{
    title: { en: string; es: string }
    slug: { current: string }
    slugEs?: { current: string }
    description?: { en: string; es: string }
  }>
  lang: "en" | "es"
  title: string
  viewAllLabel: string
}) => {
  if (!posts.length) return null

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
            {title}
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
          >
            {viewAllLabel}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => (
            <li key={post.slug.current}>
              <Link
                href={{
                  pathname: "/blog/[slug]",
                  params: { slug: slugForLocale(post, lang) },
                }}
                className="block group p-4 rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-orange-600 mb-2">
                  {post.title[lang]}
                </h3>
                {post.description?.[lang] && (
                  <p className="text-slate-600 text-sm line-clamp-2">
                    {post.description[lang]}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default LatestFromBlog
