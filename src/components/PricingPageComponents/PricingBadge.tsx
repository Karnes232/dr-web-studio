import { Star } from "lucide-react"
import React from "react"

const PricingBadge = ({
  children,
  variant = "popular",
}: {
  children: React.ReactNode
  variant: "popular" | "recommended" | "premium"
}) => {
  const variants = {
    popular: "bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950",
    recommended: "bg-teal-700 text-white",
    premium: "bg-slate-900 text-amber-300",
  }
  return (
    <div
      className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold ${variants[variant]} shadow-lg`}
    >
      <div className="flex items-center">
        <Star className="h-3 w-3 mr-1" />
        {children}
      </div>
    </div>
  )
}

export default PricingBadge
