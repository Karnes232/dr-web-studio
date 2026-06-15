import React from "react"
import { ArrowRight } from "lucide-react"
import IndividualService from "./IndividualService"
import { Link } from "@/i18n/navigation"

const QuickServicesOverview = ({
  title,
  subtitle,
  ctaText,
  services,
  lang,
}: {
  title: string
  subtitle: string
  ctaText: string
  services: any
  lang: string
}) => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: any, index: number) => (
            <IndividualService key={index} service={service} lang={lang} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/our-services"
            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {ctaText}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default QuickServicesOverview
