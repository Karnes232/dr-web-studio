"use client"

import React from "react"
import { useLocale } from "@/i18n/useLocale"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import type { LocalizedServiceLink } from "@/components/Layout/chrome"
import { Link } from "@/i18n/navigation"
import { FaWhatsapp } from "react-icons/fa"
import { waHref } from "@/lib/contact"

const MobileMenu = ({
  isOpen,
  setIsOpen,
  services,
  phone,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  services: LocalizedServiceLink[]
  phone?: string
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

  // The closed menu is hidden with opacity/visibility, but IntersectionObserver
  // only checks geometry — so every <Link> below counts as "in viewport" and
  // auto-prefetches on page load (~600 KB of RSC payloads competing with the
  // hero LCP image on mobile). Disable prefetch until the menu is opened.
  const prefetch = isOpen ? undefined : false

  return (
    <div
      className={`
                lg:hidden fixed top-28 md:top-36 left-0 right-0 z-50
                transform transition-all duration-300 ease-in-out
                ${isOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-10 opacity-0 invisible"}
            `}
    >
      <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 max-h-[calc(100vh-7rem)] md:max-h-[calc(100vh-9rem)] overflow-y-auto">
        {navItems.map((item, index) => (
          <Link
            onClick={() => setIsOpen(!isOpen)}
            key={index}
            href={item.href}
            prefetch={prefetch}
            className="block px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400 rounded-md font-medium transition-colors"
          >
            {item.label}
          </Link>
        ))}
        {/* Mobile Services */}
        <div className="px-3 py-2">
          <Link
            href="/our-services"
            prefetch={prefetch}
            className="text-slate-700 dark:text-slate-200 font-medium mb-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {t("services.services")}
          </Link>
          <div className="pl-4 mt-2 space-y-1">
            {services.map(service => (
              <Link
                onClick={() => setIsOpen(!isOpen)}
                key={service._id}
                href={{
                  pathname: "/our-services/[slug]",
                  params: { slug: service.slug },
                }}
                prefetch={prefetch}
                className="block py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                {service.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-700 mt-2 pt-4">
          <div className="text-slate-700 dark:text-slate-200 font-medium mb-3">
            {t("resources.language")}
          </div>
          <div className="pl-1">
            <LanguageSwitcher color="slate-700" />
          </div>
        </div>

        {/* Mobile CTA Buttons */}
        <div className="px-3 pt-4 space-y-2">
          <Link
            href="/project-planner"
            prefetch={prefetch}
            onClick={() => setIsOpen(!isOpen)}
            className="block w-full text-center bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 px-4 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md"
          >
            {t("resources.start_project")}
          </Link>
          <Link
            href="/contact"
            prefetch={prefetch}
            onClick={() => setIsOpen(!isOpen)}
            className="block w-full text-center bg-teal-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-teal-800 transition-all duration-200 shadow-md"
          >
            {t("resources.get_quote")}
          </Link>
          {phone && (
            <a
              href={waHref(phone, t("landingPage.whatsappMessage"))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(!isOpen)}
              className="flex w-full items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 shadow-md"
            >
              <FaWhatsapp className="h-5 w-5" />
              {t("landingPage.whatsapp")}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
