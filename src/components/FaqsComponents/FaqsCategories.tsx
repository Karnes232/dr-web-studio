import { ChevronDown, ChevronUp, Search } from "lucide-react"
import React from "react"

interface FAQ {
  id: string
  question: string
  answer: string
}

interface Category {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  questions: FAQ[]
}

const FaqsCategories = ({
  filteredFAQs,
  activeAccordion,
  toggleAccordion,
}: {
  filteredFAQs: Category[]
  activeAccordion: string | null
  toggleAccordion: (categoryId: string) => void
}) => {
  return (
    <>
      <div className="space-y-4">
        {filteredFAQs.map(category => {
          const Icon = category.icon
          const isActive = activeAccordion === category.id

          return (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleAccordion(category.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${category.color} mr-3`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {category.title}
                  </h2>
                  <span className="ml-2 text-sm text-gray-500">
                    ({category.questions.length} questions)
                  </span>
                </div>
                {isActive ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {/* Questions */}
              {isActive && (
                <div className="px-6 pb-4">
                  <div className="space-y-4">
                    {category.questions.map(faq => (
                      <div
                        key={faq.id}
                        className="border-l-4 border-orange-200 pl-4"
                      >
                        <h3 className="font-medium text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {filteredFAQs.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or browse all categories above.
          </p>
        </div>
      )}
    </>
  )
}

export default FaqsCategories
