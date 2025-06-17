import { ChevronDown } from "lucide-react"
import React, { useRef, useEffect } from "react"
import { useLocale } from "@/i18n/useLocale"
import Link from "next/link"

const ServicesDropdown = ({
  servicesOpen,
  setServicesOpen,
}: {
  servicesOpen: boolean
  setServicesOpen: any
}) => {
  const { t, getLocalizedPath } = useLocale()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!servicesOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setServicesOpen(false)
      }
    }

    // Use capture phase to ensure we catch the event before it bubbles
    document.addEventListener("mousedown", handleClickOutside, true)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }
  }, [servicesOpen, setServicesOpen])

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
    <div className="relative" ref={dropdownRef}>
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
            <Link
              onClick={() => setServicesOpen(false)}
              key={index}
              href={service.href}
              className="block px-4 py-2 text-slate-700 xl:text-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              {service.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ServicesDropdown
