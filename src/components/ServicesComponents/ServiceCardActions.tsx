import { ArrowRight } from "lucide-react"
import React from "react"

const ServiceCardActions = ({
  onGetStarted,
  onLearnMore,
}: {
  onGetStarted: () => void
  onLearnMore: () => void
}) => {
  return (
    <div className="flex gap-3">
      <button
        onClick={onGetStarted}
        className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center"
      >
        Get Started
        <ArrowRight className="h-4 w-4 ml-1" />
      </button>
      <button
        onClick={onLearnMore}
        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
      >
        Learn More
      </button>
    </div>
  )
}

export default ServiceCardActions
