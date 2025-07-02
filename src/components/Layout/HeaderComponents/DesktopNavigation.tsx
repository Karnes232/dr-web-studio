import React from "react"
import ServicesDropdown from "./ServicesDropdown"
import { useLocale } from "@/i18n/useLocale"
import Link from "next/link"
import { ServiceItemsLinks } from "@/sanity/queries/services/serviceItem"

const DesktopNavigation = ({
  servicesOpen,
  setServicesOpen,
  serviceLinks,
}: {
  servicesOpen: boolean
  setServicesOpen: any
  serviceLinks: ServiceItemsLinks[]
}) => {
  const { t, getLocalizedPath } = useLocale()

  const navItems = [
    { href: getLocalizedPath("/"), label: t("navigation.home") },
    { href: getLocalizedPath("/about-me"), label: t("navigation.about") },
    { href: getLocalizedPath("/portfolio"), label: t("navigation.portfolio") },
    { href: getLocalizedPath("/pricing"), label: t("navigation.pricing") },
    { href: getLocalizedPath("/blog"), label: t("navigation.blog") },
    { href: getLocalizedPath("/contact"), label: t("navigation.contact") },
  ]
  return (
    <div className="hidden lg:flex items-center space-x-6 xl:space-x-4 ">
      {navItems.slice(0, 2).map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="text-slate-700 hover:text-orange-500 font-medium transition-colors duration-200"
        >
          {item.label}
        </Link>
      ))}

      <ServicesDropdown
        servicesOpen={servicesOpen}
        setServicesOpen={setServicesOpen}
        serviceLinks={serviceLinks}
      />

      {navItems.slice(2).map((item, index) => (
        <Link
          key={index + 2}
          href={item.href}
          className="text-slate-700 hover:text-orange-500 font-medium transition-colors duration-200"
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export default DesktopNavigation
