import React from "react"

const CheckboxOption = ({
  checked,
  onChange,
  children,
  description,
}: {
  checked: boolean
  onChange: () => void
  children: React.ReactNode
  description?: string
}) => {
  return (
    <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
      />
      <div className="flex-1">
        <div className="font-medium text-gray-700">{children}</div>
        {description && (
          <div className="text-sm text-gray-500 mt-1">{description}</div>
        )}
      </div>
    </label>
  )
}

export default CheckboxOption
