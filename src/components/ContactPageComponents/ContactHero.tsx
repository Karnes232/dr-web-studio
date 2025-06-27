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
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
        {title}
        <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
          {" "}
          {highlightedText}
        </span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">{description}</p>
    </div>
  )
}

export default ContactHero
