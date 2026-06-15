"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import {
  Search,
  Palette,
  Code,
  Rocket,
  MessageCircle,
  CheckCircle,
  Settings,
  Send,
} from "lucide-react"
import type { ProcessStep } from "./types"

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Search,
  Palette,
  Code,
  Rocket,
  MessageCircle,
  CheckCircle,
  Settings,
  Send,
}

interface LandingProcessProps {
  sectionTitle: string
  sectionSubtitle: string
  steps: ProcessStep[]
}

export function LandingProcess({
  sectionTitle,
  sectionSubtitle,
  steps,
}: LandingProcessProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="bg-white dark:bg-slate-900 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            style={{ fontFamily: "var(--font-crimson-pro)" }}
          >
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {sectionSubtitle}
            </p>
          )}
        </motion.div>

        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-px bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, i) => {
              const Icon = ICON_MAP[step.icon] ?? Rocket
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 32 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step circle */}
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full border-2 border-amber-200 bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                      <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                        <Icon size={32} className="text-amber-600" />
                      </div>
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 text-white text-sm font-bold flex items-center justify-center shadow-md">
                      {step.number}
                    </div>
                  </div>

                  <div className="min-h-14 flex justify-center mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-center">
                      {step.stepTitle}
                    </h3>
                  </div>
                  <p className="flex-1 text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">
                    {step.description}
                  </p>
                  {step.duration && (
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-medium">
                      {step.duration}
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
