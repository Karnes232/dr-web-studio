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
  title,
  price,
  originalPrice,
  period = "project",
  description,
  features,
  badge,
  iconName,
  ctaText,
  ctaHref,
  variant = "default",
  onCTAClick,
}: {
  title: string
  price: string
  originalPrice: string
  period?: string
  description: string
  features: (string | { text: string; included?: boolean })[]
  badge?: any
  iconName: keyof typeof iconMap
  ctaText: string
  ctaHref: string
  variant?: "default" | "popular" | "premium"
  onCTAClick?: () => void
}) => {
  const cardVariants = {
    default: "bg-white border-gray-200 hover:border-orange-200",
    popular:
      "bg-white border-orange-300 hover:border-orange-400 shadow-lg transform scale-105",
    premium:
      "bg-gradient-to-br from-slate-50 to-white border-gray-300 hover:border-purple-300",
  }

  const Icon = iconMap[iconName]

  return (
    <div
      className={`relative border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-xl ${cardVariants[variant]}`}
    >
      {badge && (
        <PricingBadge variant={badge.variant}>{badge.text}</PricingBadge>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg mb-4">
          <Icon className="h-6 w-6 text-orange-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">${price}</span>
            <span className="text-gray-500 ml-1">/{period}</span>
          </div>
          {originalPrice && (
            <div className="text-sm text-gray-400 line-through">
              Was ${originalPrice}
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <FeatureItem
            key={index}
            included={
              typeof feature === "string" ? true : feature.included !== false
            }
          >
            {typeof feature === "string" ? feature : feature.text}
          </FeatureItem>
        ))}
      </div>

      {/* CTA Button */}
      <PricingCTA
        href={ctaHref}
        variant={variant === "popular" ? "primary" : "outline"}
        onClick={onCTAClick || (() => {})}
      >
        {ctaText}
      </PricingCTA>
    </div>
  )
}

export default PricingCard
