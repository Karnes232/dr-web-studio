"use client"
import { useLocale } from "@/i18n/useLocale"
import React from "react"

const BottomBar = () => {
  const { currentLocale, t, getLocalizedPath } = useLocale()
  return (
    <div className="border-t border-slate-700 pt-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-400 text-sm mb-4 md:mb-0">
          © {new Date().getFullYear()} DR Web Studio. {t("footer.allRightsReserved")}
        </div>
        <div className="flex space-x-6 text-sm">
          <a
            href="#privacy"
            className="text-gray-400 hover:text-orange-400 transition-colors"
          >
            {t("resources.privacy_policy")}
          </a>
          <a
            href="#terms"
            className="text-gray-400 hover:text-orange-400 transition-colors"
          >
            {t("resources.terms_of_service")}
          </a>
          <a
            href="#sitemap"
            className="text-gray-400 hover:text-orange-400 transition-colors"
          >
            {t("resources.sitemap")}
          </a>
        </div>
      </div>
    </div>
  )
}

export default BottomBar
