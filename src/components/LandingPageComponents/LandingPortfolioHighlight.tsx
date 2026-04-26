"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, ArrowRight } from "lucide-react"
import type { PortfolioProject } from "./types"

interface LandingPortfolioHighlightProps {
  sectionTitle: string
  sectionSubtitle: string
  projects: PortfolioProject[]
  ctaText: string
  ctaHref: string
  lang: "en" | "es"
}

export function LandingPortfolioHighlight({
  sectionTitle,
  sectionSubtitle,
  projects,
  ctaText,
  ctaHref,
  lang,
}: LandingPortfolioHighlightProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  if (!projects.length) return null

  return (
    <section className="bg-slate-50 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4"
            style={{ fontFamily: "var(--font-crimson-pro)" }}
          >
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">{sectionSubtitle}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/${lang}/portfolio`}
                className="group block bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-amber-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Project image */}
                <div className="relative h-48 bg-slate-200 overflow-hidden">
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                      <ExternalLink size={32} className="text-slate-500" />
                    </div>
                  )}
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-semibold rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">
                    {project.client}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                    {project.title}
                  </h3>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag, j) => (
                        <span key={j} className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-900 text-slate-900 font-semibold rounded-xl hover:bg-slate-900 hover:text-white transition-all duration-200"
          >
            {ctaText || (lang === "es" ? "Ver Portafolio Completo" : "View Full Portfolio")}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
