import { CheckCircle } from "lucide-react"
import React from "react"

const ServiceBenefits = ({ benefits }: { benefits: string[] }) => {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">
        Key Benefits
      </h4>
      <ul className="space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-slate-600">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ServiceBenefits
