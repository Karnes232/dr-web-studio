import React from "react"

const RangeSlider = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  formatValue: (value: number) => string
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="font-medium text-gray-700">{label}</label>
        <span className="text-orange-600 font-semibold">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  )
}

export default RangeSlider
