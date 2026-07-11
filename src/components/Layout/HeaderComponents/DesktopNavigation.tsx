import React from "react"
import ServicesDropdown from "./ServicesDropdown"
import { useLocale } from "@/i18n/useLocale"
import { Link } from "@/i18n/navigation"
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
  const { t } = useLocale()

  const navItems = [
    { href: "/", label: t("navigation.home") },
    { href: "/about-me", label: t("navigation.about") },
    { href: "/portfolio", label: t("navigation.portfolio") },
    { href: "/pricing", label: t("navigation.pricing") },
    { href: "/blog", label: t("navigation.blog") },
    { href: "/contact", label: t("navigation.contact") },
  ] as const
  return (
    <div className="hidden lg:flex items-center space-x-6 xl:space-x-4 ">
      {navItems.slice(0, 2).map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="text-slate-700 dark:text-slate-200 hover:text-orange-500 font-medium transition-colors duration-200 truncate"
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
          className="text-slate-700 dark:text-slate-200 hover:text-orange-500 font-medium transition-colors duration-200"
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export default DesktopNavigation
