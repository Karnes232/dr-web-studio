import { CheckCircle } from "lucide-react"
import { Star } from "lucide-react"
import React from "react"

const WhyChooseUs = ({
  reasons,
  title,
}: {
  reasons: { title: string; description: string }[]
  title: string
}) => {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
        <Star className="h-6 w-6 text-teal-600 mr-2" />
        {title}
      </h2>
      <ul className="space-y-3">
        {reasons.map((reason, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-teal-600 mr-3 mt-0.5" />
            <span className="text-slate-700 dark:text-slate-200">
              <strong>{reason.title}</strong> {reason.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WhyChooseUs
