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
              ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg"
              : "bg-white text-slate-600 border border-slate-300 hover:border-orange-400 hover:text-orange-600"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default PortfolioFilter
