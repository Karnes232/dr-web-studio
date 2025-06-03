import { ChevronDown } from "lucide-react"
import React from "react"

const ServicesDropdown = ({
  servicesOpen,
  setServicesOpen,
}: {
  servicesOpen: boolean
  setServicesOpen: any
}) => {
  const services = [
    { href: "#custom-websites", label: "Custom Websites" },
    { href: "#ecommerce", label: "E-commerce" },
    { href: "#landing-pages", label: "Landing Pages" },
    { href: "#cms", label: "CMS Solutions" },
    { href: "#maintenance", label: "Maintenance" },
    { href: "#seo", label: "SEO & Performance" },
  ]
  return (
    <div className="relative">
      <button
        onClick={() => setServicesOpen(!servicesOpen)}
        className="flex items-center text-slate-700 hover:text-orange-500 font-medium transition-colors duration-200"
      >
        Services
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
