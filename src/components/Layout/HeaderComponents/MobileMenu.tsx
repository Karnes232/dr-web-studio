import React from "react"
import { usePathname } from "next/navigation"
import { languages, fallbackLng } from "@/i18n/settings"
import useTranslations from "@/i18n/useTranslations"

const MobileMenu = ({ isOpen }: { isOpen: boolean }) => {
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
  const navItems = [
    { href: "#home", label: t("navigation.home") },
    { href: "#about", label: t("navigation.about") },
    { href: "#portfolio", label: t("navigation.portfolio") },
    { href: "#pricing", label: t("navigation.pricing") },
    { href: "#blog", label: t("navigation.blog") },
    { href: "#contact", label: t("navigation.contact") },
  ]

  const services = [
    { href: "#custom-websites", label: t("services.custom_websites") },
    { href: "#ecommerce", label: t("services.ecommerce") },
    { href: "#landing-pages", label: t("services.landing_pages") },
    { href: "#cms", label: t("services.cms") },
    { href: "#maintenance", label: t("services.maintenance") },
    { href: "#seo", label: t("services.seo") },
  ]

  return (
    <div
      className={`
                lg:hidden fixed top-28 md:top-36 left-0 right-0 z-50
                transform transition-all duration-300 ease-in-out
                ${isOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-10 opacity-0 invisible"}
            `}
    >
      <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-slate-200">
        {navItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="block px-3 py-2 text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-md font-medium transition-colors"
          >
            {item.label}
          </a>
        ))}

        {/* Mobile Services */}
        <div className="px-3 py-2">
          <div className="text-slate-700 font-medium mb-2">
            {t("services.services")}
          </div>
          <div className="pl-4 space-y-1">
            {services.map((service, index) => (
              <a
                key={index}
                href={service.href}
                className="block py-1 text-sm text-slate-600 hover:text-orange-600 transition-colors"
              >
                {service.label}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile CTA Buttons */}
        <div className="px-3 pt-4 space-y-2">
          <a
            href="#questionnaire"
            className="block w-full text-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md"
          >
            Start Project
          </a>
          <a
            href="#quote"
            className="block w-full text-center bg-teal-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-teal-600 transition-all duration-200 shadow-md"
          >
            Get Quote
          </a>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
