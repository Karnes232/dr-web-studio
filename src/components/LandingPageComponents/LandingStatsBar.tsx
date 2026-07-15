"use client"

import { useEffect, useRef, useState } from "react"
import type { StatItem } from "./types"

interface LandingStatsBarProps {
  stats: StatItem[]
}

/** Final, formatted display string for a stat value. Seeds SSR/hydration with
 *  the real number so it lands in the indexed HTML (not a literal "0"). */
function formatStat(value: string): string {
  const num = parseFloat(value.replace(/[^0-9.]/g, ""))
  const suffix = value.replace(/[0-9.]/g, "")
  if (isNaN(num)) return value
  return `${num % 1 === 0 ? Math.round(num) : num.toFixed(1)}${suffix}`
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
  const [isInView, setIsInView] = useState(false)
  // Seed with the real value so the server-rendered HTML shows the true number;
  // the count-up (reset to 0 below) only runs client-side once in view.
  const [displayed, setDisplayed] = useState(() => formatStat(value))

  // Native IntersectionObserver replaces framer-motion's useInView so the whole
  // section no longer pulls in the motion runtime.
  useEffect(() => {
    if (isInView) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsInView(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-50px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isInView])

  useEffect(() => {
    if (!isInView) return
    const num = parseFloat(value.replace(/[^0-9.]/g, ""))
    const suffix = value.replace(/[0-9.]/g, "")
    if (isNaN(num)) {
      setDisplayed(value)
      return
    }

    setDisplayed("0")
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
    <div
      ref={ref}
      className={`reveal ${isInView ? "is-visible" : ""} flex flex-col items-center text-center px-6 py-6`}
      style={{ ["--reveal-delay" as string]: `${delay}s` }}
    >
      <span
        className="text-4xl font-bold text-slate-900 dark:text-white mb-1"
        style={{ fontFamily: "var(--font-crimson-pro)" }}
      >
        {displayed}
      </span>
      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
        {label}
      </span>
    </div>
  )
}

export function LandingStatsBar({ stats }: LandingStatsBarProps) {
  if (!stats.length) return null

  return (
    <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-700">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100 dark:divide-slate-700">
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
