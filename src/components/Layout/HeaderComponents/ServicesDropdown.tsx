import { ChevronDown } from "lucide-react"
import React, { useRef, useEffect } from "react"
import { useLocale } from "@/i18n/useLocale"
import { Link } from "@/i18n/navigation"
import { ServiceItemsLinks } from "@/sanity/queries/services/serviceItem"

const ServicesDropdown = ({
  servicesOpen,
  setServicesOpen,
  serviceLinks,
}: {
  servicesOpen: boolean
  setServicesOpen: any
  serviceLinks: ServiceItemsLinks[]
}) => {
  const { currentLocale, t, getServiceHref } = useLocale()
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
          {serviceLinks.map((service, index) => (
            <Link
              onClick={() => setServicesOpen(false)}
              key={service._id}
              href={getServiceHref(service)}
              className="block px-4 py-2 text-slate-700 dark:text-slate-200 xl:text-lg hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors truncate"
            >
              {service.title[currentLocale as keyof typeof service.title]}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ServicesDropdown
