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

const useServicesData = () => {
  return [
    {
      id: 1,
      title: "Custom Website Development",
      description:
        "Tailored static and dynamic websites built with modern technologies like React and Next.js.",
      icon: Globe,
      categories: ["Development", "Optimization"],
      priceRange: "500",
      timeline: "2-4 weeks",
      features: "8-12",
      benefits: [
        "Mobile-first responsive design",
        "Lightning-fast loading speeds",
        "SEO-optimized structure",
        "Custom functionality",
        "Modern UI/UX design",
        "Cross-browser compatibility",
      ],
    },
    {
      id: 2,
      title: "E-commerce Solutions",
      description:
        "Complete online stores with Shopify, WooCommerce, or custom React-based solutions.",
      icon: ShoppingCart,
      categories: ["E-commerce", "Development"],
      priceRange: "900",
      timeline: "3-6 weeks",
      features: "15-20",
      benefits: [
        "Secure payment processing",
        "Inventory management",
        "Order tracking system",
        "Multi-currency support",
        "Mobile shopping experience",
        "Analytics integration",
      ],
    },
    {
      id: 3,
      title: "Landing Pages",
      description:
        "High-conversion landing pages designed for marketing campaigns and lead generation.",
      icon: Target,
      categories: ["Marketing", "Development"],
      priceRange: "300",
      timeline: "1-2 weeks",
      features: "6-8",
      benefits: [
        "Conversion-optimized design",
        "A/B testing ready",
        "Fast load times",
        "Lead capture forms",
        "Analytics tracking",
        "Social media integration",
      ],
    },
    {
      id: 4,
      title: "Content Management Systems",
      description:
        "Easy-to-manage websites with CMS solutions like Sanity, Contentful, or WordPress.",
      icon: FileText,
      categories: ["CMS", "Development"],
      priceRange: "600",
      timeline: "2-4 weeks",
      features: "10-15",
      benefits: [
        "User-friendly admin panel",
        "Content scheduling",
        "Multi-user access",
        "Media management",
        "SEO tools integration",
        "Backup & security",
      ],
    },
    {
      id: 5,
      title: "Maintenance & Support",
      description:
        "Ongoing website maintenance, updates, bug fixes, and performance monitoring.",
      icon: Wrench,
      categories: ["Support", "Optimization"],
      priceRange: "100",
      timeline: "Ongoing",
      features: "5-8",
      benefits: [
        "Regular security updates",
        "Performance monitoring",
        "Bug fixes & troubleshooting",
        "Content updates",
        "Backup management",
        "24/7 support available",
      ],
    },
    {
      id: 6,
      title: "Performance & SEO Optimization",
      description:
        "Boost your website's speed, search rankings, and overall performance.",
      icon: Zap,
      categories: ["Optimization", "Marketing"],
      priceRange: "400",
      timeline: "1-3 weeks",
      features: "8-12",
      benefits: [
        "Page speed optimization",
        "SEO audit & implementation",
        "Core Web Vitals improvement",
        "Technical SEO fixes",
        "Analytics setup",
        "Performance monitoring",
      ],
    },
  ]
}

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
  const services = useServicesData()

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
