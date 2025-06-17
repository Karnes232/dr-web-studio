import { useLocale } from "@/i18n/useLocale"
import Link from "next/link"
import React from "react"

const CTAButtons = ({ className = "" }) => {
  const { t, getLocalizedPath } = useLocale()
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <Link
        href={getLocalizedPath("/project-planner")}
        className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        {t("resources.start_project")}
      </Link>

      <Link
        href={getLocalizedPath("/contact")}
        className="bg-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        {t("resources.get_quote")}
      </Link>
    </div>
  )
}

export default CTAButtons
