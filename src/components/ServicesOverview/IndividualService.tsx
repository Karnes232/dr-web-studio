"use client"
import { Icon } from "lucide-react"
import React from "react"
import SanitySvg from "../SanitySvg/SanitySvg"

const IndividualService = ({
  service,
  lang,
}: {
  service: any
  lang: string
}) => {
  console.log(service)
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      <div
        className={`w-14 h-14 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <SanitySvg
          url={service.icon.asset.url}
          className="w-7 h-7 text-white"
        />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-3">
        {service.title[lang]}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {service.description[lang]}
      </p>
    </div>
  )
}

export default IndividualService
