"use client"
import React, { useEffect, useState, useRef } from "react"
import { Star, Quote } from "lucide-react"
import { useLocale } from "@/i18n/useLocale"
import ClientLogosMarquee from "./ClientLogosMarquee"
import type { TrustStats } from "@/sanity/queries/home/trustSignals"

const TrustSignals = ({
  title,
  subtitle,
  previousClients,
  testimonials,
  stats,
}: {
  title: string
  subtitle: string
  previousClients: any
  testimonials: any
  stats?: TrustStats
}) => {
  const { t, currentLocale } = useLocale()
  // Single source of truth: numbers come from the trustSignals Sanity doc
  // (shared with the hero indicator). Fallbacks keep SSR safe if unset.
  const targetHappyClients = stats?.happyClients ?? 20
  const targetProjectsCompleted = stats?.projectsCompleted ?? 50
  const targetAverageRating = stats?.averageRating ?? 5.0
  const supportAvailable = stats?.supportAvailable ?? "24/7"

  const [happyClients, setHappyClients] = useState(targetHappyClients)
  const [projectsCompleted, setProjectsCompleted] = useState(
    targetProjectsCompleted,
  )
  const [averageRating, setAverageRating] = useState(targetAverageRating)
  const statsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setHappyClients(0)
          setProjectsCompleted(0)
          setAverageRating(0)

          const animationDuration = 2000 // 2 seconds
          const framesPerSecond = 60
          const totalFrames = (animationDuration / 1000) * framesPerSecond

          let frame = 0
          const timer = setInterval(() => {
            frame++
            const progress = frame / totalFrames

            if (frame <= totalFrames) {
              setHappyClients(Math.ceil(progress * targetHappyClients))
              setProjectsCompleted(
                Math.ceil(progress * targetProjectsCompleted),
              )
              setAverageRating(Math.ceil(progress * targetAverageRating))
            } else {
              clearInterval(timer)
            }
          }, 1000 / framesPerSecond)

          // Disconnect observer after animation starts
          observer.disconnect()
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
      },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
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
            {previousClients.title[currentLocale]}
          </h3>
          <ClientLogosMarquee clients={previousClients.clients} />
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial: any, index: number) => (
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
                &ldquo;{testimonial.quote[currentLocale]}&rdquo;
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
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {happyClients}+
            </div>
            <div className="text-gray-600 dark:text-slate-400">
              {t("hero.happyClients")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-700 dark:text-teal-400 mb-2">
              {projectsCompleted}+
            </div>
            <div className="text-gray-600 dark:text-slate-400">
              {t("home.projectsCompleted")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">
              {averageRating.toFixed(1)}
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
