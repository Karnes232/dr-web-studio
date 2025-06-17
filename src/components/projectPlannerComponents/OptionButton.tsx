import { Check } from "lucide-react"
import React from "react"

const OptionButton = ({
  selected,
  onClick,
  children,
  description,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  description: string
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
        selected
          ? "border-orange-500 bg-orange-50 text-orange-700"
          : "border-gray-200 hover:border-orange-300 hover:bg-orange-25"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{children}</div>
          {description && (
            <div className="text-sm text-gray-500 mt-1">{description}</div>
          )}
        </div>
        {selected && <Check className="h-5 w-5 text-orange-500" />}
      </div>
    </button>
  )
}

export default OptionButton
