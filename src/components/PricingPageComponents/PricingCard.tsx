"use client"

import React from "react"
import PricingBadge from "./PricingBadge"
import FeatureItem from "./FeatureItem"
import PricingCTA from "./PricingCTA"
import { Zap, ShoppingCart, Globe } from "lucide-react"

const iconMap = {
  Zap,
  ShoppingCart,
  Globe,
}

const PricingCard = ({
  pricingData,
  lang,
}: {
  pricingData: any
  lang: string
}) => {
  const cardVariants = {
    default: "bg-white border-gray-200 hover:border-orange-200",
    popular:
      "bg-white border-orange-300 hover:border-orange-400 shadow-lg transform scale-105",
    premium:
      "bg-gradient-to-br from-slate-50 to-white border-gray-300 hover:border-purple-300",
  }

  const Icon = iconMap[pricingData.iconName as keyof typeof iconMap]
  return (
    <div
      className={`relative border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-xl ${cardVariants[pricingData.variant as keyof typeof cardVariants]}`}
    >
      {pricingData.badge.text && (
        <PricingBadge variant={pricingData.badge.variant}>
          {pricingData.badge.text[lang as keyof typeof pricingData.badge.text]}
        </PricingBadge>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg mb-4">
          <Icon className="h-6 w-6 text-orange-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {pricingData.title[lang as keyof typeof pricingData.title]}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {
            pricingData.description[
              lang as keyof typeof pricingData.description
            ]
          }
        </p>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">
              ${pricingData.price}
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8">
        {pricingData.features.map((feature: any, index: number) => (
          <FeatureItem
            key={index}
            included={
              typeof feature === "string" ? true : feature.included !== false
            }
          >
            {typeof feature === "string"
              ? feature
              : feature.text[lang as keyof typeof feature.text]}
          </FeatureItem>
        ))}
      </div>

      {/* CTA Button */}
      <PricingCTA
        href={pricingData.ctaHref}
        variant={pricingData.variant === "popular" ? "primary" : "outline"}
        data-source={`pricing-${pricingData.title[lang]}`}
      >
        {pricingData.ctaText[lang as keyof typeof pricingData.ctaText]}
      </PricingCTA>
    </div>
  )
}

export default PricingCard
