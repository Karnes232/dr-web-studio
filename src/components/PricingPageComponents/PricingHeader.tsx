import React from "react"

const PricingHeader = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">{description}</p>

      {/* Price Toggle could go here for monthly/yearly if needed */}
    </div>
  )
}

export default PricingHeader
