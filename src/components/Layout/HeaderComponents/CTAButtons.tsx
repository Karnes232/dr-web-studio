import { useLocale } from "@/i18n/useLocale"
import { Link } from "@/i18n/navigation"
import React from "react"
import { FaWhatsapp } from "react-icons/fa"
import { waHref } from "@/lib/contact"

const CTAButtons = ({
  className = "",
  phone,
}: {
  className?: string
  phone?: string
}) => {
  const { t } = useLocale()
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <Link
        href="/project-planner"
        className="bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        {t("resources.start_project")}
      </Link>

      <Link
        href="/contact"
        className="bg-teal-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        {t("resources.get_quote")}
      </Link>

      {phone && (
        <a
          href={waHref(phone, t("landingPage.whatsappMessage"))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("landingPage.whatsapp")}
          title={t("landingPage.whatsapp")}
          className="p-2 rounded-lg text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-slate-800 transition-all duration-200 transform hover:scale-110"
        >
          <FaWhatsapp className="h-6 w-6" />
        </a>
      )}
    </div>
  )
}

export default CTAButtons
