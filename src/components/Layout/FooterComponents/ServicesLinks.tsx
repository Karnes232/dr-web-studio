"use client"
import { useLocale } from "@/i18n/useLocale"
import React from "react"

const ServicesLinks = () => {
  const { currentLocale, t, getLocalizedPath } = useLocale()
  const services = [
    { href: "#custom-websites", label: t("services.custom_websites") },
    { href: "#ecommerce", label: t("services.ecommerce") },
    { href: "#landing-pages", label: t("services.landing_pages") },
    { href: "#cms", label: t("services.cms") },
    { href: "#maintenance", label: t("services.maintenance") },
    { href: "#seo", label: t("services.seo") },
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
