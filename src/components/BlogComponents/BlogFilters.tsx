"use client"
import { useLocale } from "@/i18n/useLocale"
import { Search } from "lucide-react"
import React from "react"

const BlogFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  lang,
}: {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  categories: any
  lang: string
}) => {
  const { t } = useLocale()
  return (
    <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full lg:max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-5 w-5" />
            <input
              type="text"
              placeholder={t("blog.searchPlaceholder")}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap lg:flex-nowrap lg:overflow-x-scroll gap-2 w-full lg:scrollbar-hide lg:pb-4">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors lg:w-full ${
                selectedCategory === "All"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {t("blog.all")}
            </button>
            {categories.map((category: any) => (
              <button
                key={category.title[lang]}
                onClick={() => setSelectedCategory(category.title[lang])}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors lg:w-full lg:text-nowrap ${
                  selectedCategory === category.title[lang]
                    ? "bg-orange-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {category.title[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogFilters
