"use client"
import { useLocale } from "@/i18n/useLocale"
import React from "react"

const QuickLinks = () => {
  const { t, getLocalizedPath } = useLocale()
  const links = [
    { href: getLocalizedPath("/"), label: t("navigation.home") },
    { href: getLocalizedPath("/about-us"), label: t("navigation.about") },
    { href: getLocalizedPath("/portfolio"), label: t("navigation.portfolio") },
    { href: getLocalizedPath("/pricing"), label: t("navigation.pricing") },
    { href: getLocalizedPath("/blog"), label: t("navigation.blog") },
    { href: getLocalizedPath("/contact"), label: t("navigation.contact") },
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default QuickLinks
