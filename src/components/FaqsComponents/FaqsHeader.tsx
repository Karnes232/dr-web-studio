import React from "react"

const FaqsHeader = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">{description}</p>
    </div>
  )
}

export default FaqsHeader
