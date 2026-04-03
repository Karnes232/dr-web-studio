"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Zap,
  Clock,
  Star,
  Quote,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
} from "lucide-react"
import type { CaseStudy } from "./types"
import Image from "next/image"

interface CaseStudyCardsProps {
  data: CaseStudy[]
  language?: "en" | "es"
}

export function CaseStudyCards({ data, language = "es" }: CaseStudyCardsProps) {
  const [activeCase, setActiveCase] = useState<number | null>(null)

  const labels = {
    es: {
      title: "Casos de Éxito Reales",
      subtitle: "Resultados comprobados de empresas que confiaron en nosotros",
      client: "Cliente",
      industry: "Industria",
      challenge: "Desafío",
      solution: "Solución",
      results: "Resultados",
      metrics: "Métricas Clave",
      testimonial: "Testimonio",
      viewProject: "Ver Proyecto",
      readMore: "Leer Más",
      readLess: "Leer Menos",
      before: "Antes",
      after: "Después",
      improvement: "Mejora",
      technologies: "Tecnologías",
      timeline: "Tiempo de Desarrollo",
    },
    en: {
      title: "Real Success Stories",
      subtitle: "Proven results from companies that trusted us",
      client: "Client",
      industry: "Industry",
      challenge: "Challenge",
      solution: "Solution",
      results: "Results",
      metrics: "Key Metrics",
      testimonial: "Testimonial",
      viewProject: "View Project",
      readMore: "Read More",
      readLess: "Read Less",
      before: "Before",
      after: "After",
      improvement: "Improvement",
      technologies: "Technologies",
      timeline: "Development Time",
    },
  }

  const t = labels[language]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-6"
          >
            <CheckCircle2 className="w-4 h-4" />
            {language === "es" ? "Resultados Verificados" : "Verified Results"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
          >
            {t.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Case Study Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {data.map((caseStudy, index) => (
            <CaseStudyCard
              key={index}
              caseStudy={caseStudy}
              index={index}
              isActive={activeCase === index}
              onToggle={() =>
                setActiveCase(activeCase === index ? null : index)
              }
              labels={t}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Case Study Card Component
function CaseStudyCard({
  caseStudy,
  index,
  isActive,
  onToggle,
  labels,
}: {
  caseStudy: CaseStudy
  index: number
  isActive: boolean
  onToggle: () => void
  labels: any
}) {
  console.log(caseStudy)
  // Icon mapping for metrics based on metric name
  const getMetricIcon = (metric: string) => {
    const lower = metric.toLowerCase()
    if (lower.includes("revenue") || lower.includes("ingreso"))
      return TrendingUp
    if (lower.includes("conversion") || lower.includes("conversión"))
      return ShoppingCart
    if (
      lower.includes("traffic") ||
      lower.includes("tráfico") ||
      lower.includes("visitor")
    )
      return Users
    if (
      lower.includes("speed") ||
      lower.includes("load") ||
      lower.includes("carga")
    )
      return Zap
    if (lower.includes("time") || lower.includes("tiempo")) return Clock
    return TrendingUp // Default
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative h-full bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Header with Client Info */}
        <div className="relative p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-b border-slate-200 dark:border-slate-800">
          {/* Client Logo/Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300">
                <Image
                  src={caseStudy.logo}
                  alt={caseStudy.client}
                  width={48}
                  height={48}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
                  {caseStudy.client}
                </h3>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                  {caseStudy.industry}
                </p>
              </div>
            </div>

            {/* Star Rating */}
            {/* <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div> */}
          </div>

          {/* Challenge (Brief) */}
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {caseStudy.challenge}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            {labels.metrics}
          </h4>

          <div className="grid grid-cols-2 gap-4">
            {caseStudy.results.slice(0, 4).map((result, idx) => {
              const IconComponent = getMetricIcon(result.metric)

              return (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                  className="relative"
                >
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
                    <IconComponent className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                      {result.improvement}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {result.metric}
                    </div>
                    {/* Before/After tooltip on hover */}
                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {result.before} → {result.after}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6 border-b border-slate-100 dark:border-slate-800">
                {/* Solution */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    {labels.solution}
                  </h4>
                  <ul className="space-y-2">
                    {caseStudy.solution.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies Used */}
                {caseStudy.technologies &&
                  caseStudy.technologies.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                        {labels.technologies}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {caseStudy.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-xs font-medium text-indigo-700 dark:text-indigo-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Timeline */}
                {caseStudy.timeline && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      {labels.timeline}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-slate-500" />
                      {caseStudy.timeline}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonial */}
        {caseStudy.testimonial && (
          <div className="p-6 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-start gap-3">
              <Quote className="w-6 h-6 text-indigo-400 dark:text-indigo-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed mb-3">
                  "{caseStudy.testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                    {caseStudy.testimonial.author.charAt(0)}
                  </div> */}
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {caseStudy.testimonial.author}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {caseStudy.testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onToggle}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
          >
            {isActive ? labels.readLess : labels.readMore}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default CaseStudyCards
