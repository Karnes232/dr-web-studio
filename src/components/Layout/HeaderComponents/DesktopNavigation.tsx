import React from "react"
import ServicesDropdown from "./ServicesDropdown"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import type { LocalizedServiceLink } from "@/components/Layout/chrome"
import type { Locale } from "@/lib/slugs"

// Server component: the nav links are static markup; only the services
// dropdown (open state + outside-click) is a client island.
const DesktopNavigation = async ({
  services,
  lang,
}: {
  services: LocalizedServiceLink[]
  lang: Locale
}) => {
  const t = await getTranslations({ locale: lang })

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

      <ServicesDropdown services={services} />

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
