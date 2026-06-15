import React from "react"

const ServiceFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
}: {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
            activeCategory === category
              ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 shadow-lg"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default ServiceFilter
