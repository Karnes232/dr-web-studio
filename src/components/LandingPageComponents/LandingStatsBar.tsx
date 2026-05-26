"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import type { StatItem } from "./types"

interface LandingStatsBarProps {
  stats: StatItem[]
}

function AnimatedStat({
  value,
  label,
  delay,
}: {
  value: string
  label: string
  delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [displayed, setDisplayed] = useState("0")

  useEffect(() => {
    if (!isInView) return
    const num = parseFloat(value.replace(/[^0-9.]/g, ""))
    const suffix = value.replace(/[0-9.]/g, "")
    if (isNaN(num)) {
      setDisplayed(value)
      return
    }

    let start = 0
    const duration = 1800
    const step = 16
    const increment = num / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= num) {
        setDisplayed(
          `${num % 1 === 0 ? Math.round(num) : num.toFixed(1)}${suffix}`,
        )
        clearInterval(timer)
      } else {
        setDisplayed(
          `${num % 1 === 0 ? Math.round(start) : start.toFixed(1)}${suffix}`,
        )
      }
    }, step)
    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center text-center px-6 py-6"
    >
      <span
        className="text-4xl font-bold text-slate-900 mb-1"
        style={{ fontFamily: "var(--font-crimson-pro)" }}
      >
        {displayed}
      </span>
      <span className="text-sm text-slate-500 font-medium uppercase tracking-wide">
        {label}
      </span>
    </motion.div>
  )
}

export function LandingStatsBar({ stats }: LandingStatsBarProps) {
  if (!stats.length) return null

  return (
    <section className="bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
          {stats.map((stat, i) => (
            <AnimatedStat
              key={i}
              value={stat.value}
              label={stat.label}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
