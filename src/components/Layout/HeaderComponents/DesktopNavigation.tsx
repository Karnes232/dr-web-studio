import React from "react"
import ServicesDropdown from "./ServicesDropdown"
import { useLocale } from "@/i18n/useLocale"

const DesktopNavigation = ({
  servicesOpen,
  setServicesOpen,
}: {
  servicesOpen: boolean
  setServicesOpen: any
}) => {
  const { currentLocale, t, getLocalizedPath } = useLocale()

  const navItems = [
    { href: "#home", label: t("navigation.home") },
    { href: "#about", label: t("navigation.about") },
    { href: "#portfolio", label: t("navigation.portfolio") },
    { href: "#pricing", label: t("navigation.pricing") },
    { href: "#blog", label: t("navigation.blog") },
    { href: "#contact", label: t("navigation.contact") },
  ]
  return (
    <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 ">
      {navItems.slice(0, 2).map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="text-slate-700 hover:text-orange-500 font-medium xl:text-lg transition-colors duration-200"
        >
          {item.label}
        </a>
      ))}

      <ServicesDropdown
        servicesOpen={servicesOpen}
        setServicesOpen={setServicesOpen}
      />

      {navItems.slice(2).map((item, index) => (
        <a
          key={index + 2}
          href={item.href}
          className="text-slate-700 hover:text-orange-500 font-medium transition-colors duration-200"
        >
          {item.label}
        </a>
      ))}
    </div>
  )
}

export default DesktopNavigation
