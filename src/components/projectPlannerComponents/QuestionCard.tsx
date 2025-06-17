import React from "react"

const QuestionCard = ({
  icon: Icon,
  title,
  description,
  children,
  isActive,
  onClick,
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
  isActive: boolean
  onClick: () => void
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-300 ${
        isActive ? "ring-2 ring-orange-500 shadow-xl" : ""
      }`}
    >
      <div className="flex items-center mb-4">
        <Icon className="h-6 w-6 text-orange-500 mr-3" />
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  )
}

export default QuestionCard
