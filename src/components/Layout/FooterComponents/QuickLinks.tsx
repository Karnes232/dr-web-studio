"use client"
import { useLocale } from "@/i18n/useLocale"
import React from "react"

const QuickLinks = () => {
  const { currentLocale, t, getLocalizedPath } = useLocale()
  const links = [
    { href: "#home", label: t("navigation.home") },
    { href: "#about", label: t("navigation.about") },
    { href: "#portfolio", label: t("navigation.portfolio") },
    { href: "#pricing", label: t("navigation.pricing") },
    { href: "#blog", label: t("navigation.blog") },
    { href: "#contact", label: t("navigation.contact") },
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
