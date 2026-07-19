"use client"

import { useState } from "react"
import { Reveal } from "@/components/animation/Reveal"
import {
  Code,
  Server,
  Database,
  Cloud,
  Wrench,
  Check,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import type { TechStackItem } from "./types"

interface TechStackGridProps {
  data: TechStackItem[]
  language?: "en" | "es"
}

type Category = "all" | "frontend" | "backend" | "database" | "devops" | "tools"

// Category icons
const categoryIcons: Record<Category, any> = {
  all: Sparkles,
  frontend: Code,
  backend: Server,
  database: Database,
  devops: Cloud,
  tools: Wrench,
}

export function TechStackGrid({ data, language = "es" }: TechStackGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("all")
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const labels = {
    es: {
      title: "Stack Tecnológico Moderno",
      subtitle:
        "Las tecnologías que impulsan aplicaciones web de clase mundial",
      all: "Todas",
      frontend: "Frontend",
      backend: "Backend",
      database: "Base de Datos",
      devops: "DevOps",
      tools: "Herramientas",
      benefits: "Beneficios Clave",
      useCases: "Casos de Uso",
      popularity: "Adopción",
    },
    en: {
      title: "Modern Technology Stack",
      subtitle: "The technologies powering world-class web applications",
      all: "All",
      frontend: "Frontend",
      backend: "Backend",
      database: "Database",
      devops: "DevOps",
      tools: "Tools",
      benefits: "Key Benefits",
      useCases: "Use Cases",
      popularity: "Adoption",
    },
  }

  const t = labels[language]

  // Filter data based on active category
  const filteredData =
    activeCategory === "all"
      ? data
      : data.filter(item => item.category === activeCategory)

  // Category counts
  const categoryCounts = {
    all: data.length,
    frontend: data.filter(item => item.category === "frontend").length,
    backend: data.filter(item => item.category === "backend").length,
    database: data.filter(item => item.category === "database").length,
    devops: data.filter(item => item.category === "devops").length,
    tools: data.filter(item => item.category === "tools").length,
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-6">
        {/* Header */}
        <Reveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-slate-900 dark:text-white">
            {t.title}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </Reveal>

        {/* Category Filter */}
        <Reveal
          delay={0.2}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {(Object.keys(categoryIcons) as Category[]).map(category => {
            const Icon = categoryIcons[category]
            const isActive = activeCategory === category
            const count = categoryCounts[category]

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  group relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95
                  ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 shadow-lg shadow-orange-500/30"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{t[category]}</span>
                <span
                  className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${
                    isActive
                      ? "bg-white/20"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  }
                `}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </Reveal>

        {/* Tech Stack Grid */}
        <div
          key={activeCategory}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        >
          {filteredData.map((tech, index) => (
            <TechCard
              key={tech.name}
              tech={tech}
              index={index}
              isHovered={hoveredCard === tech.name}
              onHover={() => setHoveredCard(tech.name)}
              onLeave={() => setHoveredCard(null)}
              labels={t}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No technologies found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

// Tech Card Component
function TechCard({
  tech,
  index,
  isHovered,
  onHover,
  onLeave,
  labels,
}: {
  tech: TechStackItem
  index: number
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  labels: any
}) {
  const [showDetails, setShowDetails] = useState(false)

  // Category colors
  const categoryColors = {
    frontend: {
      bg: "from-teal-500/10 to-teal-500/10",
      border: "border-teal-500/20",
      text: "text-teal-700 dark:text-teal-400",
      badge: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300",
    },
    backend: {
      bg: "from-green-500/10 to-emerald-500/10",
      border: "border-green-500/20",
      text: "text-green-600 dark:text-green-400",
      badge:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    },
    database: {
      bg: "from-yellow-500/10 to-yellow-500/10",
      border: "border-yellow-500/20",
      text: "text-yellow-700 dark:text-yellow-400",
      badge:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    },
    devops: {
      bg: "from-orange-500/10 to-red-500/10",
      border: "border-orange-500/20",
      text: "text-orange-700 dark:text-orange-400",
      badge:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    },
    tools: {
      bg: "from-orange-500/10 to-amber-500/10",
      border: "border-orange-500/20",
      text: "text-orange-700 dark:text-orange-400",
      badge:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    },
  }

  const colors = categoryColors[tech.category]

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative h-full"
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.bg} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative h-full bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 group-hover:border-opacity-50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start justify-between mb-4">
            {/* Icon & Name */}
            <div className="flex items-center gap-3">
              <div
                className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl ${colors.badge} text-2xl font-bold group-hover:scale-110 transition-transform duration-300`}
              >
                {tech.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {tech.name}
                </h3>
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}
                >
                  {tech.category}
                </span>
              </div>
            </div>

            {/* Popularity Badge */}
            {tech.popularity && (
              <div className="flex flex-col items-end">
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colors.badge} text-xs font-bold`}
                >
                  <TrendingUp className="w-3 h-3" />
                  {tech.popularity}%
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {labels.popularity}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {tech.description}
          </p>
        </div>

        {/* Benefits Section */}
        <div className="p-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-left mb-4 group/btn"
          >
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${colors.text}`} />
              {labels.benefits}
            </h4>
            <div
              className={`transition-transform duration-300 ${
                showDetails ? "rotate-180" : "rotate-0"
              }`}
            >
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {/* Benefits List (always show first 3) */}
          <ul className="space-y-2 mb-4">
            {tech.benefits.slice(0, 3).map((benefit, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
              >
                <Check
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text}`}
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Expandable Details */}
          {showDetails && (
            <div className="overflow-hidden">
              {/* Remaining Benefits */}
              {tech.benefits.length > 3 && (
                <ul className="space-y-2 mb-4">
                  {tech.benefits.slice(3).map((benefit, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text}`}
                      />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Use Cases */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Code className={`w-4 h-4 ${colors.text}`} />
                  {labels.useCases}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tech.useCases.map((useCase, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Expand Button Hint */}
          {!showDetails && (
            <button
              onClick={() => setShowDetails(true)}
              className={`text-xs font-medium ${colors.text} hover:underline`}
            >
              Ver más detalles →
            </button>
          )}
        </div>

        {/* Popularity Progress Bar (if available) */}
        {tech.popularity && (
          <div className="px-6 pb-6">
            <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${tech.popularity}%` }}
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors.bg.replace("/10", "/50")} rounded-full transition-all duration-1000`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TechStackGrid
