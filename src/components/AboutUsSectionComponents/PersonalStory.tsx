import React from "react"

const PersonalStory = ({ title, story1, story2 }: { title: string, story1: string, story2: string }) => {
  return (
    <div className="prose prose-slate max-w-none">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">
        {title}
      </h3>
      <p className="text-slate-600 mb-4">
        {story1}
      </p>
      <p className="text-slate-600 mb-6">
        {story2}
      </p>
    </div>
  )
}

export default PersonalStory
