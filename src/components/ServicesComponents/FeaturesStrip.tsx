import { Search, Smartphone, Zap } from "lucide-react"
import React from "react"
import FeatureHighlight from "./FeatureHighlight"
import { useLocale } from "@/i18n/useLocale"

const FeaturesStrip = ({
  features,
}: {
  features: {
    iconName: string
    title: { en: string; es: string }
    description: { en: string; es: string }
    gradient: string
  }[]
}) => {
  const { currentLocale } = useLocale()
  const icons = {
    Smartphone,
    Search,
    Zap,
  }
  return (
    <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {features.map((feature, index) => {
          const Icon = icons[feature.iconName as keyof typeof icons]
          return (
            <FeatureHighlight
              key={index}
              icon={Icon}
              title={feature.title[currentLocale as keyof typeof feature.title]}
              description={
                feature.description[
                  currentLocale as keyof typeof feature.description
                ]
              }
              gradient={feature.gradient}
            />
          )
        })}
      </div>
    </div>
  )
}

export default FeaturesStrip
