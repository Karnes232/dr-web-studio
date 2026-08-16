"use client"
import { useLocale } from "@/i18n/useLocale"
import { Link } from "@/i18n/navigation"
import { CITY_PAGE_ROUTES, CITY_NAMES } from "@/lib/indexableRoutes"
import React from "react"

const CitiesLinks = () => {
  const { t } = useLocale()

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">
        {t("footer.citiesTitle")}
      </h3>
      <ul className="space-y-2">
        {CITY_PAGE_ROUTES.map(route => (
          <li key={route}>
            <Link
              href={route}
              className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
            >
              {CITY_NAMES[route]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CitiesLinks
