import { useLocale } from "@/i18n/useLocale"
import React from "react"

const CTAButtons = ({ className = "" }) => {
  const { currentLocale, t, getLocalizedPath } = useLocale()
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <a
        href="#questionnaire"
        className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        {t("resources.start_project")}
      </a>

      <a
        href="#quote"
        className="bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        {t("resources.get_quote")}
      </a>
    </div>
  )
}

export default CTAButtons
