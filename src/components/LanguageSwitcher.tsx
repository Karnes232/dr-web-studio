"use client"

import { useRouter, usePathname } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import { useParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Globe, ChevronDown } from "lucide-react"
import { useLocalizedHrefs } from "@/i18n/localizedSlugs"

export default function LanguageSwitcher({ color }: { color: string }) {
  const router = useRouter()
  // pathname is the de-localized internal path. For static routes it's a
  // pathnames key (e.g. "/about-me") that router.replace re-localizes correctly.
  // For dynamic [slug] routes it's the resolved path (the slug value doesn't
  // localize itself), which is why detail pages publish per-locale hrefs below.
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = useLocale()
  // On /blog/[slug] & /our-services/[slug] the slug value localizes per locale,
  // which next-intl can't derive on its own — the detail page publishes the
  // correct per-locale hrefs here. Null elsewhere (falls back to prefix swap).
  const localizedHrefs = useLocalizedHrefs()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languageOptions = [
    { code: "en", display: "English", flag: "🇺🇸" },
    { code: "es", display: "Español", flag: "🇩🇴" }, // Changed to Dominican Republic flag to match your business
  ]

  const handleLanguageChange = (newLocale: string) => {
    setIsOpen(false)
    // Prefer the detail page's per-locale href (correct localized slug); fall
    // back to the current pathname+params for static / non-[slug] routes.
    const target = localizedHrefs?.[newLocale as "en" | "es"] ?? {
      pathname,
      params,
    }
    router.replace(
      // @ts-expect-error -- pathname+params always match a valid localized route.
      target,
      { locale: newLocale },
    )
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const currentLangOption =
    languageOptions.find(lang => lang.code === currentLocale) ||
    languageOptions[0]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 text-${color} dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-800 border border-transparent hover:border-orange-200 dark:hover:border-slate-700`}
        >
          <Globe className="h-4 w-4 " />
          <span className="text-lg">{currentLangOption.flag}</span>
          <span className="text-sm font-medium">
            {currentLangOption.code.toUpperCase()}
          </span>
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Version - Compact */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-1 text-${color} dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-800`}
        >
          <Globe className="h-5 w-5" />
          <span className="text-lg">{currentLangOption.flag}</span>
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
          {languageOptions.map(lng => {
            const isActive = currentLocale === lng.code
            return (
              <button
                key={lng.code}
                onClick={() => handleLanguageChange(lng.code)}
                className={`w-full text-left px-4 py-2 flex items-center space-x-3 hover:bg-orange-50 dark:hover:bg-slate-800 hover:text-orange-600 transition-colors ${
                  isActive
                    ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                <span className="text-lg">{lng.flag}</span>
                <span className="font-medium">{lng.display}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
