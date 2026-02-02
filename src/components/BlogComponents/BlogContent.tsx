"use client"
import React, { useState, useMemo } from "react"
import BlogHeader from "./BlogHeader"
import BlogFilters from "./BlogFilters"
import FeaturedPost from "./FeaturedPost"
import BlogCard from "./BlogCard"
import Pagination from "./Pagination"
import { BlogHeader as BlogHeaderType } from "@/sanity/queries/blog/blogHeader"
import { useLocale } from "@/i18n/useLocale"

const BlogContent = ({
  categories,
  lang,
  blogPosts,
  header,
  initialPage = 1,
  initialPaginatedPosts = [],
  totalPages: serverTotalPages = 1,
  postsPerPage = 6,
}: {
  categories: any
  lang: "en" | "es"
  blogPosts: any
  header: BlogHeaderType
  initialPage?: number
  initialPaginatedPosts?: any[]
  totalPages?: number
  postsPerPage?: number
}) => {
  const { t, getLocalizedPath } = useLocale()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [clientPage, setClientPage] = useState(1)

  const isDefaultView = searchTerm === "" && selectedCategory === "All"
  const currentPage = isDefaultView ? initialPage : clientPage
  const displayPosts = useMemo(() => {
    if (isDefaultView) return initialPaginatedPosts
    const filtered = blogPosts.filter((post: any) => {
      const matchesSearch =
        post.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description[lang].toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === "All" ||
        post.categories.some((cat: any) => cat.title[lang] === selectedCategory)
      return matchesSearch && matchesCategory
    })
    const start = (clientPage - 1) * postsPerPage
    return filtered.slice(start, start + postsPerPage)
  }, [
    isDefaultView,
    initialPaginatedPosts,
    blogPosts,
    lang,
    searchTerm,
    selectedCategory,
    clientPage,
    postsPerPage,
  ])

  const filteredPosts = useMemo(
    () =>
      blogPosts.filter((post: any) => {
        const matchesSearch =
          post.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description[lang].toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory =
          selectedCategory === "All" ||
          post.categories.some((cat: any) => cat.title[lang] === selectedCategory)
        return matchesSearch && matchesCategory
      }),
    [blogPosts, lang, searchTerm, selectedCategory],
  )
  const clientTotalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const totalPages = isDefaultView ? serverTotalPages : clientTotalPages

  const featuredPost =
    blogPosts.find((post: any) => post.featured === true) || blogPosts[0]

  return (
    <section
      id="blogSection"
      className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50"
    >
      <BlogHeader header={header} lang={lang} />
      <BlogFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        lang={lang}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isDefaultView &&
          initialPage === 1 &&
          featuredPost && <FeaturedPost post={featuredPost} lang={lang} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPosts.map((post: any) => (
            <BlogCard key={post.slug.current} post={post} lang={lang} />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setClientPage}
            useLinks={isDefaultView}
            basePath={getLocalizedPath("/blog")}
          />
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">
              {t("blog.noArticlesFound")}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogContent
