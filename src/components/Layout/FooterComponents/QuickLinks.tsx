import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import React from "react"
import type { Locale } from "@/lib/slugs"

const QuickLinks = async ({ lang }: { lang: Locale }) => {
  const t = await getTranslations({ locale: lang })
  const links = [
    { href: "/", label: t("navigation.home") },
    { href: "/about-me", label: t("navigation.about") },
    { href: "/portfolio", label: t("navigation.portfolio") },
    { href: "/pricing", label: t("navigation.pricing") },
    { href: "/blog", label: t("navigation.blog") },
    { href: "/contact", label: t("navigation.contact") },
    {
      href: "/guia-completa-desarrollo-web-moderno-negocios",
      label: t("navigation.guiaCompleta"),
    },
  ] as const

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">
        {t("navigation.quickLinks")}
      </h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default QuickLinks
