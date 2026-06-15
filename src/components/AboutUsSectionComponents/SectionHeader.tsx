import React from "react"

const SectionHeader = ({
  title,
  subtitle,
  description,
}: {
  title: string
  subtitle?: string
  description: string
}) => {
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
        {title}
      </h1>
      <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto mb-6"></div>
      <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  )
}

export default SectionHeader
