"use client"
import React from "react"
import { Clock, Star, Globe, Award } from "lucide-react"
import { useLocale } from "@/i18n/useLocale"
const StatsGrid = ({
  stats,
}: {
  stats: { websitesDelivered: number; yearsExperience: number }
}) => {
  const { t } = useLocale()
  const statsArray = [
    {
      number: `${stats.websitesDelivered}+`,
      label: t("stats.websitesDelivered"),
      icon: Globe,
    },
    {
      number: `${stats.yearsExperience}+`,
      label: t("stats.yearsExperience"),
      icon: Award,
    },
    { number: "24/7", label: t("stats.supportAvailable"), icon: Clock },
    { number: "100%", label: t("stats.clientSatisfaction"), icon: Star },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsArray.map((stat, index) => {
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
