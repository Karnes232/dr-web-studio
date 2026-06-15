"use client"

import { useState } from "react"
import {
  Check,
  X,
  TrendingUp,
  TrendingDown,
  Zap,
  Turtle,
  Clock,
  Rocket,
  Smartphone,
  Heart,
  Search,
  AlertTriangle,
  Layers,
  DollarSign,
  PiggyBank,
  Calendar,
  RefreshCw,
  Shield,
  ShieldCheck,
} from "lucide-react"
import type { ComparisonItem } from "./types"

interface ComparisonTableProps {
  data: ComparisonItem[]
  language?: "en" | "es"
}

// Icon mapping
const iconMap: Record<string, any> = {
  Turtle,
  Rocket,
  Clock,
  Zap,
  Smartphone,
  Heart,
  Search,
  TrendingUp,
  AlertTriangle,
  Layers,
  DollarSign,
  PiggyBank,
  Calendar,
  RefreshCw,
  Shield,
  ShieldCheck,
}

export function ComparisonTable({
  data,
  language = "es",
}: ComparisonTableProps) {
  const [activeRow, setActiveRow] = useState<number | null>(null)
  const [view, setView] = useState<"table" | "cards">("table")

  const labels = {
    es: {
      title: "Desarrollo Web: Tradicional vs Moderno",
      subtitle: "Comparación lado a lado de las diferencias clave",
      feature: "Característica",
      traditional: "Tradicional",
      modern: "Moderno",
      tableView: "Vista de Tabla",
      cardView: "Vista de Tarjetas",
    },
    en: {
      title: "Web Development: Traditional vs Modern",
      subtitle: "Side-by-side comparison of key differences",
      feature: "Feature",
      traditional: "Traditional",
      modern: "Modern",
      tableView: "Table View",
      cardView: "Card View",
    },
  }

  const t = labels[language]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-slate-900 dark:text-white">
            {t.title}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          {/* View Toggle */}
          <div className="mt-8 inline-flex items-center gap-2 p-1 bg-slate-200 dark:bg-slate-800 rounded-full">
            <button
              onClick={() => setView("table")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                view === "table"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-lg"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t.tableView}
            </button>
            <button
              onClick={() => setView("cards")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                view === "cards"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-lg"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t.cardView}
            </button>
          </div>
        </div>

        {/* Table View */}
        {view === "table" && (
          <div className="max-w-6xl mx-auto">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl">
              <table className="w-full">
                {/* Header */}
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-8 py-6 text-left text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider w-1/3">
                      {t.feature}
                    </th>
                    <th className="px-8 py-6 text-center text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wider w-1/3">
                      <div className="flex items-center justify-center gap-2">
                        <X className="w-5 h-5" />
                        {t.traditional}
                      </div>
                    </th>
                    <th className="px-8 py-6 text-center text-sm font-bold text-green-700 dark:text-green-400 uppercase tracking-wider w-1/3">
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        {t.modern}
                      </div>
                    </th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="bg-white dark:bg-slate-950">
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      onMouseEnter={() => setActiveRow(index)}
                      onMouseLeave={() => setActiveRow(null)}
                      className={`border-b border-slate-100 dark:border-slate-800 transition-all duration-300 motion-reduce:transition-none ${
                        activeRow === index
                          ? "bg-slate-50 dark:bg-slate-900/50 scale-[1.01] motion-reduce:scale-100"
                          : "hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                      }`}
                    >
                      {/* Feature Name */}
                      <td className="px-8 py-6 font-semibold text-slate-900 dark:text-white">
                        {item.feature}
                      </td>

                      {/* Traditional */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-center gap-3">
                          {/* Icon */}
                          {item.traditional.icon &&
                            iconMap[item.traditional.icon] && (
                              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30">
                                {(() => {
                                  const Icon = iconMap[item.traditional.icon]
                                  return (
                                    <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                                  )
                                })()}
                              </div>
                            )}

                          {/* Value */}
                          <div className="text-center">
                            <div className="font-bold text-lg text-red-700 dark:text-red-400 mb-1">
                              {item.traditional.value}
                            </div>
                            {item.traditional.description && (
                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                {item.traditional.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Modern */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-center gap-3">
                          {/* Icon */}
                          {item.modern.icon && iconMap[item.modern.icon] && (
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30">
                              {(() => {
                                const Icon = iconMap[item.modern.icon]
                                return (
                                  <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                )
                              })()}
                            </div>
                          )}

                          {/* Value */}
                          <div className="text-center">
                            <div className="font-bold text-lg text-green-700 dark:text-green-400 mb-1">
                              {item.modern.value}
                            </div>
                            {item.modern.description && (
                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                {item.modern.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (stacked) */}
            <div className="md:hidden space-y-6">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden"
                >
                  {/* Feature Name */}
                  <div className="px-6 py-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      {item.feature}
                    </h3>
                  </div>

                  {/* Comparison */}
                  <div className="p-6 space-y-4">
                    {/* Traditional */}
                    <ComparisonCard
                      type="traditional"
                      icon={item.traditional.icon}
                      value={item.traditional.value}
                      description={item.traditional.description}
                      label={t.traditional}
                    />

                    {/* Divider */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                    </div>

                    {/* Modern */}
                    <ComparisonCard
                      type="modern"
                      icon={item.modern.icon}
                      value={item.modern.value}
                      description={item.modern.description}
                      label={t.modern}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card View */}
        {view === "cards" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {data.map((item, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setActiveRow(index)}
                onMouseLeave={() => setActiveRow(null)}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-green-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                  {/* Header */}
                  <div className="px-8 py-6 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                      {item.feature}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Traditional Side */}
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 group-hover:scale-110 transition-transform duration-300">
                          {item.traditional.icon &&
                            iconMap[item.traditional.icon] &&
                            (() => {
                              const Icon = iconMap[item.traditional.icon]
                              return (
                                <Icon className="w-8 h-8 text-red-600 dark:text-red-400" />
                              )
                            })()}
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                            {t.traditional}
                          </div>
                          <div className="font-bold text-xl text-red-700 dark:text-red-400 mb-2">
                            {item.traditional.value}
                          </div>
                          {item.traditional.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                              {item.traditional.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="absolute left-1/2 top-24 bottom-8 w-px bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent" />

                      {/* Modern Side */}
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 group-hover:scale-110 transition-transform duration-300">
                          {item.modern.icon &&
                            iconMap[item.modern.icon] &&
                            (() => {
                              const Icon = iconMap[item.modern.icon]
                              return (
                                <Icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                              )
                            })()}
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
                            {t.modern}
                          </div>
                          <div className="font-bold text-xl text-green-700 dark:text-green-400 mb-2">
                            {item.modern.value}
                          </div>
                          {item.modern.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                              {item.modern.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Mobile Comparison Card Component
function ComparisonCard({
  type,
  icon,
  value,
  description,
  label,
}: {
  type: "traditional" | "modern"
  icon?: string
  value: string
  description?: string
  label: string
}) {
  const isModern = type === "modern"
  const bgColor = isModern
    ? "bg-green-50 dark:bg-green-900/20"
    : "bg-red-50 dark:bg-red-900/20"
  const iconBgColor = isModern
    ? "bg-green-100 dark:bg-green-900/30"
    : "bg-red-100 dark:bg-red-900/30"
  const iconColor = isModern
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400"
  const textColor = isModern
    ? "text-green-700 dark:text-green-400"
    : "text-red-700 dark:text-red-400"
  const labelColor = isModern
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400"

  return (
    <div className={`p-4 rounded-xl ${bgColor}`}>
      <div className="flex items-center gap-4">
        {/* Icon */}
        {icon && iconMap[icon] && (
          <div
            className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl ${iconBgColor}`}
          >
            {(() => {
              const Icon = iconMap[icon]
              return <Icon className={`w-6 h-6 ${iconColor}`} />
            })()}
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <div
            className={`text-xs font-semibold uppercase tracking-wider mb-1 ${labelColor}`}
          >
            {label}
          </div>
          <div className={`font-bold text-lg ${textColor} mb-1`}>{value}</div>
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ComparisonTable
