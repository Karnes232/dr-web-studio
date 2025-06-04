import { ChevronDown } from "lucide-react"
import React from "react"

import { usePathname } from "next/navigation"
import { languages, fallbackLng } from "@/i18n/settings"
import useTranslations from "@/i18n/useTranslations"

const ServicesDropdown = ({
  servicesOpen,
  setServicesOpen,
}: {
  servicesOpen: boolean
  setServicesOpen: any
}) => {
  const pathname = usePathname()

  const getCurrentLocale = () => {
    const segments = pathname.split("/")
    return languages.includes(segments[1]) ? segments[1] : fallbackLng
  }

  const currentLocale = getCurrentLocale()
  const t = useTranslations(currentLocale)

  const getLocalizedPath = (path: string) => {
    return currentLocale === fallbackLng ? path : `/${currentLocale}${path}`
  }
  const services = [
    { href: "#custom-websites", label: t("services.custom_websites") },
    { href: "#ecommerce", label: t("services.ecommerce") },
    { href: "#landing-pages", label: t("services.landing_pages") },
    { href: "#cms", label: t("services.cms") },
    { href: "#maintenance", label: t("services.maintenance") },
    { href: "#seo", label: t("services.seo") },
  ]
  return (
    <div className="relative">
      <button
        onClick={() => setServicesOpen(!servicesOpen)}
        className="flex items-center text-slate-700 hover:text-orange-500 font-medium transition-colors duration-200"
      >
        {t("services.services")}
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>

      {servicesOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
          {services.map((service, index) => (
            <a
              key={index}
              href={service.href}
              className="block px-4 py-2 text-slate-700 xl:text-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              {service.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default ServicesDropdown
