import React from "react"

const FeatureHighlight = ({
  icon: Icon,
  title,
  description,
  gradient,
}: {
  icon: any
  title: string
  description: string
  gradient: string
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`${gradient} p-3 rounded-full mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h4 className="font-semibold text-slate-800 mb-2">{title}</h4>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  )
}

export default FeatureHighlight
