import { Globe, Shield, Smartphone, Zap } from "lucide-react"
import React from "react"

const DevelopmentApproach = ({ approaches, title }: { approaches: { iconName: string, title: string, description: string }[], title: string }  ) => {
  const icons = {
    Zap,
    Smartphone,
    Shield,
    Globe,
  }
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-slate-800 mb-6">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {approaches.map((approach, index) => {
          const Icon = icons[approach.iconName as keyof typeof icons]
          return (
            <div key={index} className="flex items-start space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Icon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  {approach.title}
                </h4>
                <p className="text-slate-600 text-sm">{approach.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DevelopmentApproach
