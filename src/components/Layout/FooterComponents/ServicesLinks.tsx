"use client"
import { useLocale } from "@/i18n/useLocale"
import React from "react"

const ServicesLinks = () => {
  const { t, getLocalizedPath } = useLocale()
  const services = [
    {
      href: getLocalizedPath("/our-services"),
      label: t("services.custom_websites"),
    },
    { href: getLocalizedPath("/our-services"), label: t("services.ecommerce") },
    {
      href: getLocalizedPath("/our-services"),
      label: t("services.landing_pages"),
    },
    { href: getLocalizedPath("/our-services"), label: t("services.cms") },
    {
      href: getLocalizedPath("/our-services"),
      label: t("services.maintenance"),
    },
    { href: getLocalizedPath("/our-services"), label: t("services.seo") },
  ]
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
      <ul className="space-y-2">
        {services.map((service, index) => (
          <li key={index}>
            <a
              href={service.href}
              className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
            >
              {service.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ServicesLinks
