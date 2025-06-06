import React from "react"

const OutcomeMetric = ({
  metric,
  value,
  improvement,
}: {
  metric: string
  value: string
  improvement: string
}) => {
  return (
    <div className="bg-slate-50 rounded-lg p-4 text-center">
      <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
      <div className="text-sm text-slate-600 mb-2">{metric}</div>
      <div className="text-xs text-green-600 font-medium">{improvement}</div>
    </div>
  )
}

export default OutcomeMetric
