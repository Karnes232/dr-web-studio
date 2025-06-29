"use client"
import { useLocale } from "@/i18n/useLocale"
import { ArrowRight, Award, MessageCircle, Clock, Star } from "lucide-react"
import Link from "next/link"
import React from "react"

const ServiceHero = ({
  title,
  categories,
  description,
  timeline,
}: {
  title: string
  categories: string[]
  description: string
  timeline: string
}) => {
  const { t, getLocalizedPath } = useLocale()
  return (
    <section className="relative">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {categories.map((category: string, index: number) => (
                <div
                  key={index}
                  className="inline-flex items-center bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
                >
                  <Award className="w-4 h-4 mr-2" />
                  {category}
                </div>
              ))}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {title}
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href={getLocalizedPath("/project-planner")}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                {t("individualService.startProject")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href={getLocalizedPath("/contact")}
                className="bg-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                {t("footer.contactUs")}
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-orange-400" />
                {timeline} {t("services.timeline")}
              </div>

              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                5.0 {t("services.rating")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceHero
