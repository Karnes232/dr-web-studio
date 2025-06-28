"use client"
import React, { useState } from "react"
import ServicesHeader from "./ServicesHeader"
import {
  Globe,
  ShoppingCart,
  Target,
  FileText,
  Wrench,
  Zap,
  Briefcase,
} from "lucide-react"
import ServiceFilter from "./ServiceFilter"
import ServicesGrid from "./ServicesGrid"
import CustomSolutionCTA from "./CustomSolutionCTA"
import FeaturesStrip from "./FeaturesStrip"
import { ServicesHeaderData } from "@/sanity/queries/services/servicesHeader"
import { useLocale } from "@/i18n/useLocale"
import { FeaturesStripData } from "@/sanity/queries/services/featuresStrip"
import { CustomSolutionCTAData } from "@/sanity/queries/services/customSolutionCTA"
import { Category } from "@/sanity/queries/services/category"
import { ServiceItem } from "@/sanity/queries/services/serviceItem"

export default function ServicesContent({
  servicesHeader,
  featuresStrip,
  customSolutionCTA,
  categories,
  serviceItems,
}: {
  servicesHeader: ServicesHeaderData
  featuresStrip: FeaturesStripData
  customSolutionCTA: CustomSolutionCTAData
  categories: Category[]
  serviceItems: ServiceItem[]
}) {
  const { currentLocale } = useLocale()
  const [activeCategory, setActiveCategory] = useState(
    currentLocale === "es" ? "Todos los Servicios" : "All Services",
  )

  const categoryArray: string[] = [
    currentLocale === "es" ? "Todos los Servicios" : "All Services",
  ]

  // Sort categories by order field and add them to the array
  const sortedCategories = [...categories].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  )
  sortedCategories.forEach(category => {
    categoryArray.push(
      category.name[currentLocale as keyof typeof category.name],
    )
  })

  const filteredServices =
    activeCategory === "All Services" ||
    activeCategory === "Todos los Servicios"
      ? serviceItems
      : serviceItems.filter(service =>
          service.categories.some(
            cat =>
              cat.name[currentLocale as keyof typeof cat.name] ===
              activeCategory,
          ),
        )

  return (
    <section
      id="services"
      className="py-20 bg-gradient-to-br from-slate-50 to-orange-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServicesHeader
          badge={
            servicesHeader.badge[
              currentLocale as keyof typeof servicesHeader.badge
            ]
          }
          title={
            servicesHeader.title[
              currentLocale as keyof typeof servicesHeader.title
            ]
          }
          highlightedText={
            servicesHeader.highlightedText[
              currentLocale as keyof typeof servicesHeader.highlightedText
            ]
          }
          description={
            servicesHeader.description[
              currentLocale as keyof typeof servicesHeader.description
            ]
          }
        />

        <ServiceFilter
          categories={categoryArray}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <ServicesGrid services={filteredServices} />

        <CustomSolutionCTA customSolutionCTA={customSolutionCTA} />

        <FeaturesStrip features={featuresStrip.features} />
      </div>
    </section>
  )
}
