import { useLocale } from "@/i18n/useLocale"
import React from "react"

const PortfolioFilter = ({
  categories,
  activeFilter,
  onFilterChange,
}: {
  categories: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
}) => {
  const { currentLocale } = useLocale()
  let allCategories = []
  if (currentLocale === "en") {
    allCategories = ["All", ...categories]
  } else {
    allCategories = ["Todos", ...categories]
  }
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {allCategories.map(category => (
        <button
          key={category}
          onClick={() => onFilterChange(category)}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
            activeFilter === category
              ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 shadow-lg"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default PortfolioFilter
