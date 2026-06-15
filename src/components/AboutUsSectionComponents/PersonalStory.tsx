import React from "react"

const PersonalStory = ({
  title,
  story1,
  story2,
}: {
  title: string
  story1: string
  story2: string
}) => {
  return (
    <div className="prose prose-slate max-w-none">
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-4">{story1}</p>
      <p className="text-slate-600 dark:text-slate-400 mb-6">{story2}</p>
    </div>
  )
}

export default PersonalStory
