"use client"
import { useLocale } from "@/i18n/useLocale"
import Link from "next/link"
import React from "react"

const CTASection = () => {
  const { t, getLocalizedPath } = useLocale()
  return (
    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg p-6 mb-8">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          {t("footer.readyToStart")}
        </h3>
        <p className="text-orange-100 mb-4">
          {t("footer.getFreeConsultation")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={getLocalizedPath("/project-planner")}
            className="bg-white text-orange-700 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {t("footer.startQuestionnaire")}
          </Link>
          <Link
            href={getLocalizedPath("/contact")}
            className="bg-teal-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {t("footer.contactUs")}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CTASection
