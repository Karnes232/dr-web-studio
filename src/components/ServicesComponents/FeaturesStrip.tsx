import { Search, Smartphone, Zap } from "lucide-react"
import React from "react"
import FeatureHighlight from "./FeatureHighlight"

const FeaturesStrip = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "All our websites are optimized for mobile devices first",
      gradient: "bg-gradient-to-r from-orange-500 to-yellow-500",
    },
    {
      icon: Search,
      title: "SEO Optimized",
      description: "Built with search engine optimization in mind",
      gradient: "bg-gradient-to-r from-teal-500 to-blue-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed and performance",
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
  ]
  return (
    <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {features.map((feature, index) => (
          <FeatureHighlight
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            gradient={feature.gradient}
          />
        ))}
      </div>
    </div>
  )
}

export default FeaturesStrip
