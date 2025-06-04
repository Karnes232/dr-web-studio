import { CheckCircle } from "lucide-react"
import { Star } from "lucide-react"
import React from "react"

const WhyChooseUs = () => {
  const reasons = [
    {
      title: "Local Understanding:",
      description:
        "I know the Dominican market and can help you connect with local customers",
    },
    {
      title: "Modern Technology:",
      description: "Using the latest web technologies for optimal performance",
    },
    {
      title: "Personal Service:",
      description: "Direct communication with me throughout your project",
    },
    {
      title: "Ongoing Support:",
      description:
        "Maintenance and updates to keep your website running smoothly",
    },
  ]
  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
        <Star className="h-6 w-6 text-teal-600 mr-2" />
        Why Choose DR Web Studio?
      </h3>
      <ul className="space-y-3">
        {reasons.map((reason, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-teal-600 mr-3 mt-0.5" />
            <span className="text-slate-700">
              <strong>{reason.title}</strong> {reason.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WhyChooseUs
