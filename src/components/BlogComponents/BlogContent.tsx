"use client"
import React, { useState } from "react"
import BlogHeader from "./BlogHeader"
import BlogFilters from "./BlogFilters"
import FeaturedPost from "./FeaturedPost"
import NewsletterSignup from "./NewsletterSignup"
import BlogCard from "./BlogCard"
import Pagination from "./Pagination"

const blogPosts = [
  {
    id: 1,
    title: "Top 5 Website Features Every Business Needs",
    slug: "top-5-website-features-every-business-needs",
    excerpt:
      "Discover the essential features that make websites successful for businesses in 2024. From responsive design to SEO optimization.",
    content:
      "Every successful business website needs these crucial features to compete effectively online...",
    category: "Business Tips",
    author: "DR Web Studio",
    publishDate: "2024-03-15",
    readTime: "5 min read",
    views: 1250,
    image: "/blog/website-features.jpg",
    tags: ["Web Design", "Business", "UX", "Features"],
  },
  {
    id: 2,
    title: "Why You Should Use Next.js for Your Next Website",
    slug: "why-use-nextjs-for-your-website",
    excerpt:
      "Learn about the benefits of Next.js for modern web development and why it's perfect for business websites.",
    content: "Next.js has revolutionized how we build modern websites...",
    category: "Technology",
    author: "DR Web Studio",
    publishDate: "2024-03-10",
    readTime: "7 min read",
    views: 890,
    image: "/blog/nextjs-benefits.jpg",
    tags: ["Next.js", "React", "Development", "Performance"],
  },
  {
    id: 3,
    title: "How to Prepare Content for a New Website",
    slug: "how-to-prepare-content-for-new-website",
    excerpt:
      "A comprehensive guide to organizing and preparing your content before starting your website project.",
    content:
      "Proper content preparation is crucial for a successful website launch...",
    category: "Planning",
    author: "DR Web Studio",
    publishDate: "2024-03-05",
    readTime: "6 min read",
    views: 734,
    image: "/blog/content-preparation.jpg",
    tags: ["Content", "Planning", "Website Launch", "Strategy"],
  },
  {
    id: 4,
    title: "Building a Website for a Local Business in the DR",
    slug: "building-website-local-business-dominican-republic",
    excerpt:
      "Special considerations and strategies for creating effective websites for Dominican Republic businesses.",
    content: "Local businesses in the Dominican Republic have unique needs...",
    category: "Local Business",
    author: "DR Web Studio",
    publishDate: "2024-02-28",
    readTime: "8 min read",
    views: 1156,
    image: "/blog/dr-local-business.jpg",
    tags: ["Dominican Republic", "Local Business", "Marketing", "SEO"],
  },
]

const categories = [
  "All",
  "Business Tips",
  "Technology",
  "Planning",
  "Local Business",
]

const BlogContent = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage,
  )
  const featuredPost = blogPosts[0]
  return (
    <section
      id="blogSection"
      className="min-h-screen  bg-gradient-to-br from-slate-50 to-orange-50"
    >
      <BlogHeader />
      <BlogFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {searchTerm === "" &&
          selectedCategory === "All" &&
          currentPage === 1 && <FeaturedPost post={featuredPost} />}

        {/* Newsletter Signup */}
        {/* <NewsletterSignup /> */}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map(post => (
            <BlogCard key={post.id} post={post} />
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
              No articles found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogContent
