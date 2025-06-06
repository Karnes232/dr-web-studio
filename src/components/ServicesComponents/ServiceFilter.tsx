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
              ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default ServiceFilter
