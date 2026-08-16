import { getTranslations } from "next-intl/server"
import type { LocalizedServiceLink } from "@/components/Layout/chrome"
import { Link } from "@/i18n/navigation"
import React from "react"
import type { Locale } from "@/lib/slugs"

const ServicesLinks = async ({
  services,
  lang,
}: {
  services: LocalizedServiceLink[]
  lang: Locale
}) => {
  const t = await getTranslations({ locale: lang })
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">
        {t("services.services")}
      </h3>
      <ul className="space-y-2">
        {services.map(service => (
          <li key={service._id}>
            <Link
              href={{
                pathname: "/our-services/[slug]",
                params: { slug: service.slug },
              }}
              className="text-gray-300 hover:text-orange-400 transition-colors duration-200 line-clamp-2"
            >
              {service.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ServicesLinks
