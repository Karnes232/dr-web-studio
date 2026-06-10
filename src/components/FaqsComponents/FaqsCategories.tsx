import { ChevronDown, ChevronUp, Search } from "lucide-react"
import React, { useState } from "react"

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
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null)

  const toggleQuestion = (questionId: string) => {
    setActiveQuestion(activeQuestion === questionId ? null : questionId)
  }

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
                className="w-full px-4 sm:px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <div
                    className={`p-1.5 sm:p-2 rounded-full ${category.color} mr-2 sm:mr-3 flex-shrink-0`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {category.title}
                    </h2>
                    <span className="text-xs sm:text-sm text-gray-500 block sm:inline sm:ml-2">
                      ({category.questions.length} questions)
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2">
                  {isActive ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  )}
                </div>
              </button>

              {/* Questions */}
              {isActive && (
                <div className="px-2 sm:px-6 pb-4">
                  <div className="space-y-2">
                    {category.questions.map(faq => {
                      const isQuestionActive = activeQuestion === faq.id

                      return (
                        <div
                          key={faq.id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleQuestion(faq.id)}
                            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <h3 className="font-medium text-gray-900 pr-4">
                              {faq.question}
                            </h3>
                            {isQuestionActive ? (
                              <ChevronUp className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            )}
                          </button>

                          {isQuestionActive && (
                            <div className="px-2 sm:px-4 py-3">
                              <div className="rounded-lg bg-slate-50 p-4">
                                <p className="text-slate-700 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
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
