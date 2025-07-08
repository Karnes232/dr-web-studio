import React from "react"
import { useLocale } from "@/i18n/useLocale"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { ServiceItemsLinks } from "@/sanity/queries/services/serviceItem"
import Link from "next/link"

const MobileMenu = ({
  isOpen,
  setIsOpen,
  serviceLinks,
}: {
  isOpen: boolean
  setIsOpen: any
  serviceLinks: ServiceItemsLinks[]
}) => {
  const { currentLocale, t, getLocalizedPath } = useLocale()

  const navItems = [
    { href: getLocalizedPath("/"), label: t("navigation.home") },
    { href: getLocalizedPath("/about-me"), label: t("navigation.about") },
    { href: getLocalizedPath("/portfolio"), label: t("navigation.portfolio") },
    { href: getLocalizedPath("/pricing"), label: t("navigation.pricing") },
    { href: getLocalizedPath("/blog"), label: t("navigation.blog") },
    { href: getLocalizedPath("/contact"), label: t("navigation.contact") },
  ]

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
    <div
      className={`
                lg:hidden fixed top-28 md:top-36 left-0 right-0 z-50
                transform transition-all duration-300 ease-in-out
                ${isOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-10 opacity-0 invisible"}
            `}
    >
      <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-slate-200 max-h-[calc(100vh-7rem)] md:max-h-[calc(100vh-9rem)] overflow-y-auto">
        {navItems.map((item, index) => (
          <Link
            onClick={() => setIsOpen(!isOpen)}
            key={index}
            href={item.href}
            className="block px-3 py-2 text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-md font-medium transition-colors"
          >
            {item.label}
          </Link>
        ))}
        {/* Mobile Services */}
        <div className="px-3 py-2">
          <Link
            href={getLocalizedPath("/our-services")}
            className="text-slate-700 font-medium mb-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {t("services.services")}
          </Link>
          <div className="pl-4 mt-2 space-y-1">
            {serviceLinks.map((service, index) => (
              <Link
                onClick={() => setIsOpen(!isOpen)}
                key={index}
                href={getLocalizedPath(`/our-services/${service.slug.current}`)}
                className="block py-1 text-sm text-slate-600 hover:text-orange-600 transition-colors"
              >
                {service.title[currentLocale as keyof typeof service.title]}
              </Link>
            ))}
          </div>
        </div>

        <div className="px-3 py-2 border-t border-slate-100 mt-2 pt-4">
          <div className="text-slate-700 font-medium mb-3">
            {t("resources.language")}
          </div>
          <div className="pl-1">
            <LanguageSwitcher color="slate-700" />
          </div>
        </div>

        {/* Mobile CTA Buttons */}
        <div className="px-3 pt-4 space-y-2">
          <Link
            href={getLocalizedPath("/project-planner")}
            onClick={() => setIsOpen(!isOpen)}
            className="block w-full text-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md"
          >
            {t("resources.start_project")}
          </Link>
          <Link
            href={getLocalizedPath("/contact")}
            onClick={() => setIsOpen(!isOpen)}
            className="block w-full text-center bg-teal-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-teal-600 transition-all duration-200 shadow-md"
          >
            {t("resources.get_quote")}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
