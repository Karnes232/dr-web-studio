import { Clock, Star } from "lucide-react"
import React from "react"

const ServiceStats = ({
  timeline,
  features,
}: {
  timeline: string
  features: string
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-slate-50 p-3 rounded-lg">
        <div className="flex items-center mb-1">
          <Clock className="h-4 w-4 text-orange-500 mr-2" />
          <span className="text-xs font-medium text-slate-700">Timeline</span>
        </div>
        <div className="text-sm font-semibold text-slate-800">{timeline}</div>
      </div>

      <div className="bg-slate-50 p-3 rounded-lg">
        <div className="flex items-center mb-1">
          <Star className="h-4 w-4 text-teal-500 mr-2" />
          <span className="text-xs font-medium text-slate-700">Features</span>
        </div>
        <div className="text-sm font-semibold text-slate-800">
          {features} included
        </div>
      </div>
    </div>
  )
}

export default ServiceStats
