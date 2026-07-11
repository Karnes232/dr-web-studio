import { Globe, Shield, Smartphone, Zap } from "lucide-react"
import React from "react"

const DevelopmentApproach = ({
  approaches,
  title,
}: {
  approaches: { iconName: string; title: string; description: string }[]
  title: string
}) => {
  const icons = {
    Zap,
    Smartphone,
    Shield,
    Globe,
  }
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {approaches.map((approach, index) => {
          const Icon = icons[approach.iconName as keyof typeof icons]
          return (
            <div key={index} className="flex items-start space-x-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                <Icon className="h-6 w-6 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  {approach.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {approach.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DevelopmentApproach
