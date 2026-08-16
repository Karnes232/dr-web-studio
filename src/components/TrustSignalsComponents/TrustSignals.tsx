"use client"
import React, { useEffect, useRef } from "react"
import { Star, Quote } from "lucide-react"
import { useLocale } from "@/i18n/useLocale"
import ClientLogosMarquee from "./ClientLogosMarquee"
import type { TrustStats } from "@/sanity/queries/home/trustSignals"

// Locale-resolved on the server (page.tsx) so the flight payload doesn't carry
// both languages' strings.
export interface LocalizedTestimonial {
  quote: string
  author: string
  company: string
  rating: number
}

const TrustSignals = ({
  title,
  subtitle,
  clientsTitle,
  clients,
  testimonials,
  stats,
}: {
  title: string
  subtitle: string
  clientsTitle: string
  clients: React.ComponentProps<typeof ClientLogosMarquee>["clients"]
  testimonials: LocalizedTestimonial[]
  stats?: TrustStats
}) => {
  const { t } = useLocale()
  // Single source of truth: numbers come from the trustSignals Sanity doc
  // (shared with the hero indicator). Fallbacks keep SSR safe if unset.
  const targetHappyClients = stats?.happyClients ?? 20
  const targetProjectsCompleted = stats?.projectsCompleted ?? 50
  const targetAverageRating = stats?.averageRating ?? 5.0
  const supportAvailable = stats?.supportAvailable ?? "24/7"

  const statsRef = useRef<HTMLDivElement>(null)
  const happyRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const ratingRef = useRef<HTMLDivElement>(null)

  // Count-up via rAF writing textContent directly: the SSR HTML carries the
  // final values, and React never re-renders during the animation (the old
  // 60fps setInterval + 3×setState version cost ~120 re-renders / 2s and
  // showed up in Lighthouse as long tasks + forced reflow).
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const duration = 2000
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          if (happyRef.current)
            happyRef.current.textContent = `${Math.round(ease * targetHappyClients)}+`
          if (projectsRef.current)
            projectsRef.current.textContent = `${Math.round(ease * targetProjectsCompleted)}+`
          if (ratingRef.current)
            ratingRef.current.textContent = (
              ease * targetAverageRating
            ).toFixed(1)
          if (progress < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [targetHappyClients, targetProjectsCompleted, targetAverageRating])

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-slate-400">
            {subtitle}
          </p>
        </div>

        {/* Client Logos */}
        <div className="mb-16">
          <h3 className="text-center text-lg font-semibold text-gray-500 dark:text-slate-400 mb-8">
            {clientsTitle}
          </h3>
          <ClientLogosMarquee clients={clients} />
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-orange-400" />
                <div className="flex ml-auto">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 dark:text-slate-200 mb-6 leading-relaxed italic line-clamp-3">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="border-t dark:border-slate-700 pt-4">
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div
              ref={happyRef}
              className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2"
            >
              {targetHappyClients}+
            </div>
            <div className="text-gray-600 dark:text-slate-400">
              {t("hero.happyClients")}
            </div>
          </div>
          <div className="text-center">
            <div
              ref={projectsRef}
              className="text-3xl font-bold text-teal-700 dark:text-teal-400 mb-2"
            >
              {targetProjectsCompleted}+
            </div>
            <div className="text-gray-600 dark:text-slate-400">
              {t("home.projectsCompleted")}
            </div>
          </div>
          <div className="text-center">
            <div
              ref={ratingRef}
              className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2"
            >
              {targetAverageRating.toFixed(1)}
            </div>
            <div className="text-gray-600 dark:text-slate-400">
              {t("home.averageRating")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {supportAvailable}
            </div>
            <div className="text-gray-600 dark:text-slate-400">
              {t("home.supportAvailable")}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustSignals
