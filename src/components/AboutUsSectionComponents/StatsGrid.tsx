import React from "react"
import { Clock, Star, Globe, Award } from "lucide-react"
const StatsGrid = () => {
  const stats = [
    { number: "50+", label: "Websites Delivered", icon: Globe },
    { number: "3+", label: "Years Experience", icon: Award },
    { number: "24/7", label: "Support Available", icon: Clock },
    { number: "100%", label: "Client Satisfaction", icon: Star },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="text-center">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {stat.number}
            </div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsGrid
