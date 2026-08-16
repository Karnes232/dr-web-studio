"use client"

import { ChevronDown } from "lucide-react"
import React, { useRef, useEffect, useState } from "react"
import { useLocale } from "@/i18n/useLocale"
import { Link } from "@/i18n/navigation"
import type { LocalizedServiceLink } from "@/components/Layout/chrome"

// Client island: owns its own open/close state (previously drilled down from
// Navbar) and the outside-click handler. Service titles/slugs arrive already
// locale-resolved from the server.
const ServicesDropdown = ({
  services,
}: {
  services: LocalizedServiceLink[]
}) => {
  const { t } = useLocale()
  const [servicesOpen, setServicesOpen] = useState(false)
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
  }, [servicesOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setServicesOpen(!servicesOpen)}
        className="flex items-center text-slate-700 dark:text-slate-200 hover:text-orange-500 font-medium transition-colors duration-200"
      >
        {t("services.services")}
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>

      {servicesOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
          <Link
            onClick={() => setServicesOpen(false)}
            href="/our-services"
            className="block px-4 py-2 text-slate-700 dark:text-slate-200 xl:text-lg hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            {t("services.all_services")}
          </Link>
          {services.map(service => (
            <Link
              onClick={() => setServicesOpen(false)}
              key={service._id}
              href={{
                pathname: "/our-services/[slug]",
                params: { slug: service.slug },
              }}
              className="block px-4 py-2 text-slate-700 dark:text-slate-200 xl:text-lg hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors truncate"
            >
              {service.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ServicesDropdown
