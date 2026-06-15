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
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h1>
      <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
        {description}
      </p>

      {/* Price Toggle could go here for monthly/yearly if needed */}
    </div>
  )
}

export default PricingHeader
