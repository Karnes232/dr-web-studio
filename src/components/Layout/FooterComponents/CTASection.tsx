import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import React from "react"
import type { Locale } from "@/lib/slugs"

const CTASection = async ({ lang }: { lang: Locale }) => {
  const t = await getTranslations({ locale: lang })
  return (
    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg p-6 mb-8">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-950 mb-2">
          {t("footer.readyToStart")}
        </h3>
        <p className="text-slate-800 mb-4">{t("footer.getFreeConsultation")}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/project-planner"
            className="bg-white text-orange-700 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {t("footer.startQuestionnaire")}
          </Link>
          <Link
            href="/contact"
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
