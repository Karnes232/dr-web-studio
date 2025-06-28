"use client"

import { useLocale } from "@/i18n/useLocale"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import React from "react"

const PricingCTA = ({
  children,
  href,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode
  href: string
  variant: "primary" | "outline"
  className?: string
}) => {
  const { getLocalizedPath } = useLocale()
  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white",
    secondary: "bg-teal-500 hover:bg-teal-600 text-white",
    outline:
      "border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white",
  }
  return (
    <Link
      href={getLocalizedPath(href)}
      className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${variants[variant]} ${className}`}
    >
      {children}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  )
}

export default PricingCTA
