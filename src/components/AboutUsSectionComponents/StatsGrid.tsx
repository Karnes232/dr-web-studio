"use client"
import React, { useEffect, useRef, useState } from "react"
import { Clock, Star, Globe, Award } from "lucide-react"
import { useLocale } from "@/i18n/useLocale"
const StatsGrid = ({
  stats,
}: {
  stats: { websitesDelivered: number; yearsExperience: number }
}) => {
  const { t } = useLocale()
  const [websitesDelivered, setWebsitesDelivered] = useState(0)
  const [yearsExperience, setYearsExperience] = useState(0)
  const [clientSatisfaction, setClientSatisfaction] = useState(0)
  const statsRef = useRef<HTMLDivElement>(null)

  const targetClientSatisfaction = 100

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries
        if (entry.isIntersecting) {
          const animationDuration = 2000 // 2 seconds
          const framesPerSecond = 60
          const totalFrames = (animationDuration / 1000) * framesPerSecond

          let frame = 0
          const timer = setInterval(() => {
            frame++
            const progress = frame / totalFrames

            if (frame <= totalFrames) {
              setWebsitesDelivered(
                Math.ceil(progress * stats.websitesDelivered),
              )
              setYearsExperience(Math.ceil(progress * stats.yearsExperience))
              setClientSatisfaction(
                Math.ceil(progress * targetClientSatisfaction),
              )
            } else {
              clearInterval(timer)
            }
          }, 1000 / framesPerSecond)
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [stats.websitesDelivered, stats.yearsExperience, targetClientSatisfaction])

  const statsArray = [
    {
      number: `${websitesDelivered}+`,
      label: t("stats.websitesDelivered"),
      icon: Globe,
    },
    {
      number: `${yearsExperience}+`,
      label: t("stats.yearsExperience"),
      icon: Award,
    },
    { number: "24/7", label: t("stats.supportAvailable"), icon: Clock },
    {
      number: `${clientSatisfaction}%`,
      label: t("stats.clientSatisfaction"),
      icon: Star,
    },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8" ref={statsRef}>
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
