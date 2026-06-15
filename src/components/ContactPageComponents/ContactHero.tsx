import React from "react"

const ContactHero = ({
  title,
  highlightedText,
  description,
}: {
  title: string
  highlightedText: string
  description: string
}) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
        {title}
        <span className="text-orange-600 dark:text-orange-400">
          {" "}
          {highlightedText}
        </span>
      </h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  )
}

export default ContactHero
