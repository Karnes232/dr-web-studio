import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import React from "react"
import type { Locale } from "@/lib/slugs"

const BottomBar = async ({ lang }: { lang: Locale }) => {
  const t = await getTranslations({ locale: lang })
  return (
    <div className="border-t border-slate-700 pt-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-400 text-sm mb-4 md:mb-0">
          © {new Date().getFullYear()} DR Web Studio.{" "}
          {t("footer.allRightsReserved")}
        </div>
        <div className="flex space-x-6 text-sm">
          <Link
            href="/privacy-policy"
            className="text-gray-400 hover:text-orange-400 transition-colors"
          >
            {t("resources.privacy_policy")}
          </Link>
          <Link
            href="/terms-of-service"
            className="text-gray-400 hover:text-orange-400 transition-colors"
          >
            {t("resources.terms_of_service")}
          </Link>
          <Link
            href="/sitemap"
            className="text-gray-400 hover:text-orange-400 transition-colors"
          >
            {t("resources.sitemap")}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BottomBar
