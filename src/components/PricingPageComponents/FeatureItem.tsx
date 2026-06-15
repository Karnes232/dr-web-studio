import { Check } from "lucide-react"
import React from "react"

const FeatureItem = ({
  children,
  included = true,
  className = "",
}: {
  children: React.ReactNode
  included?: boolean
  className?: string
}) => {
  return (
    <div className="flex items-start space-x-3">
      <div
        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
          included
            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300"
            : "bg-gray-100 dark:bg-slate-800 text-gray-400"
        }`}
      >
        <Check className="h-3 w-3" />
      </div>
      <span
        className={`text-sm ${included ? "text-gray-700 dark:text-slate-200 " : "text-gray-400"} ${className}`}
      >
        {children}
      </span>
    </div>
  )
}

export default FeatureItem
