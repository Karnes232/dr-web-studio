"use client"
import React from "react"
import { Star, Quote } from "lucide-react"
import { useLocale } from "@/i18n/useLocale"
import Image from "next/image"

const TrustSignals = ({title, subtitle, previousClients, testimonials}: {title: string, subtitle: string, previousClients: any, testimonials: any}) => {
  const { t, currentLocale } = useLocale()

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600">
            {subtitle}
          </p>
        </div>

        {/* Client Logos */}
        <div className="mb-16">
          <h3 className="text-center text-lg font-semibold text-gray-500 mb-8">
            {previousClients.title[currentLocale]}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:justify-around gap-8 items-center">
            {previousClients.clients.map((client: any, index: number) => (
              <div key={index} className="flex flex-col items-center justify-center group">
                <a href={client.link} target="_blank"> 
                <div className="w-32 h-32 p-4 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300">
                  {client.logo ? (
                    <Image
                      src={client.logo.asset.url}
                      alt={`${client.companyName} logo`}
                      width={96}
                      height={96}
                      className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <span className="text-2xl font-bold">{client.companyName.charAt(0)}</span>
                    </div>
                  )}
                </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial: any, index: number) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
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

              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.quote[currentLocale]}"
              </p>

              <div className="border-t pt-4">
                <p className="font-semibold text-slate-800">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-600">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">50+</div>
            <div className="text-gray-600">{t("hero.happyClients")}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-500 mb-2">100+</div>
            <div className="text-gray-600">{t("home.projectsCompleted")}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-2">5.0</div>
            <div className="text-gray-600">{t("home.averageRating")}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
            <div className="text-gray-600">{t("home.supportAvailable")}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustSignals
