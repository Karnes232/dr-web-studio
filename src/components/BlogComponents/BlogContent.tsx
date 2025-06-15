"use client"
import React, { useState } from "react"
import BlogHeader from "./BlogHeader"
import BlogFilters from "./BlogFilters"
import FeaturedPost from "./FeaturedPost"
import NewsletterSignup from "./NewsletterSignup"
import BlogCard from "./BlogCard"
import Pagination from "./Pagination"
import { BlogHeader as BlogHeaderType } from "@/sanity/queries/blog/blogHeader"
import { useLocale } from "@/i18n/useLocale"

const BlogContent = ({
  categories,
  lang,
  blogPosts,
  header,
}: {
  categories: any
  lang: "en" | "es"
  blogPosts: any
  header: BlogHeaderType
}) => {
  const { t } = useLocale()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6
  // Filter posts
  const filteredPosts = blogPosts.filter((post: any) => {
    const matchesSearch =
      post.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description[lang].toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" ||
      post.categories.some((cat: any) => cat.title[lang] === selectedCategory)
    return matchesSearch && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage,
  )

  // Get featured post (first post that has featured = true)
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
        {/* Featured Post */}
        {searchTerm === "" &&
          selectedCategory === "All" &&
          currentPage === 1 &&
          featuredPost && <FeaturedPost post={featuredPost} lang={lang} />}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map((post: any) => (
            <BlogCard key={post.slug.current} post={post} lang={lang} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* No Results */}
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
