import React from "react"
import { ArrowRight, Star } from "lucide-react"

import Image from "next/image"
import VisualElement from "./VisualElementLazy"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { urlFor } from "@/sanity/lib/image"
import type { Project } from "@/sanity/queries/portfolio/project"

const HeroSection = async ({
  heading,
  subheading,
  backgroundImage,
  projects,
  lang,
}: {
  heading: any
  subheading: string
  backgroundImage: any
  projects: Project[]
  lang: string
}) => {
  const t = await getTranslations()
  const lqip = backgroundImage?.asset?.metadata?.lqip
  const heroSrc = urlFor(backgroundImage)
    .width(1920)
    .quality(80)
    .auto("format")
    .url()

  return (
    <section className="relative text-white overflow-hidden min-h-screen flex items-center">
      {/* Background Image with Fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-teal-900/60">
        <Image
          src={heroSrc}
          alt="Custom website development services in the Dominican Republic"
          fill
          priority
          fetchPriority="high"
          unoptimized
          className="object-cover"
          sizes="100vw"
          {...(lqip ? { placeholder: "blur" as const, blurDataURL: lqip } : {})}
        />
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-slate-900/75"></div>

      {/* Gradient overlay for visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-transparent to-teal-900/50"></div>

      {/* Decorative blur elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {heading.beforeHighlight}
              <span className="text-orange-400">
                {" "}
                {heading.highlightedWord}{" "}
              </span>{" "}
              {heading.afterHighlight}
            </h1>

            <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed">
              {subheading}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/contact"
                className="group bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
              >
                {t("resources.get_free_quote")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="/portfolio"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
              >
                {t("resources.see_our_work")}
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-8 text-gray-300 pt-4">
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full border-2 border-white shadow-lg"></div>
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full border-2 border-white shadow-lg"></div>
                </div>
                <div>
                  <div className="font-semibold text-white">
                    50+ {t("hero.happyClients")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("hero.acrossDominicanRepublic")}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <div>
                  <div className="font-semibold text-white">
                    5.0 {t("hero.rating")}
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("hero.customerReviews")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Element — real project screenshots */}
          <VisualElement projects={projects} currentLocale={lang} />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
