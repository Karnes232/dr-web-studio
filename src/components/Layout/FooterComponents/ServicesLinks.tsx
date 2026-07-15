"use client"
import { useLocale } from "@/i18n/useLocale"
import type { ServiceItemsLinks } from "@/sanity/queries/services/serviceItem"
import { Link } from "@/i18n/navigation"
import React from "react"

const ServicesLinks = ({
  serviceLinks,
}: {
  serviceLinks: ServiceItemsLinks[]
}) => {
  const { currentLocale, t, getServiceHref } = useLocale()
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">
        {t("services.services")}
      </h3>
      <ul className="space-y-2">
        {serviceLinks.map((service, index) => (
          <li key={service._id}>
            <Link
              href={getServiceHref(service)}
              className="text-gray-300 hover:text-orange-400 transition-colors duration-200 line-clamp-2"
            >
              {service.title[currentLocale as keyof typeof service.title]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ServicesLinks
