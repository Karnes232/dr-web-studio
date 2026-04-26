"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import {
  Globe, ShoppingCart, Layout, Database, Wrench, TrendingUp,
  Code, Layers, Monitor, Smartphone, Zap, Search,
} from "lucide-react"
import Link from "next/link"
import type { ServiceItem } from "./types"

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe, ShoppingCart, Layout, Database, Wrench, TrendingUp,
  Code, Layers, Monitor, Smartphone, Zap, Search,
}

interface LandingServicesGridProps {
  sectionTitle: string
  sectionSubtitle: string
  items: ServiceItem[]
  lang: "en" | "es"
}

export function LandingServicesGrid({ sectionTitle, sectionSubtitle, items, lang }: LandingServicesGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] ?? Globe
            const card = (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group flex flex-col h-full bg-white rounded-2xl p-8 border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center mb-6 transition-colors duration-200">
                  <Icon size={24} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="flex-1 text-slate-500 text-sm leading-relaxed">{item.description}</p>
                {item.linkSlug && (
                  <div className="mt-6 text-amber-600 text-sm font-medium group-hover:text-amber-700 transition-colors">
                    {lang === "es" ? "Ver más →" : "Learn more →"}
                  </div>
                )}
              </motion.div>
            )

            return item.linkSlug ? (
              <Link key={i} href={`/${lang}/our-services/${item.linkSlug}`} className="flex">
                {card}
              </Link>
            ) : (
              <div key={i} className="flex">
                {card}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
