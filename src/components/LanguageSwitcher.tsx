"use client"

import { useRouter, usePathname } from "next/navigation"
import { languages, fallbackLng } from "@/i18n/settings"
import { useState, useRef, useEffect } from "react"
import { Globe, ChevronDown } from "lucide-react"

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languageOptions = [
    { code: "en", display: "English", flag: "🇺🇸" },
    { code: "es", display: "Español", flag: "🇩🇴" }, // Changed to Dominican Republic flag to match your business
  ]

  const handleLanguageChange = (newLocale: string) => {
    const segments = pathname.split("/")

    // If current path starts with a language code, remove it
    if (languages.includes(segments[1])) {
      segments.splice(1, 1)
    }

    // For non-default language, add the language code
    if (newLocale !== fallbackLng) {
      segments.splice(1, 0, newLocale)
    }

    const newPath = segments.join("/") || "/"
    setIsOpen(false)
    router.push(newPath)
  }

  const getCurrentLocale = () => {
    const segments = pathname.split("/")
    if (languages.includes(segments[1])) {
      return segments[1]
    }
    return fallbackLng
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
    languageOptions.find(lang => lang.code === getCurrentLocale()) ||
    languageOptions[0]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-slate-700 hover:text-orange-500 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-orange-50 border border-transparent hover:border-orange-200"
        >
          <Globe className="h-4 w-4" />
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
          className="flex items-center space-x-1 text-slate-700 hover:text-orange-500 transition-colors duration-200 p-2 rounded-lg hover:bg-orange-50"
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
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
          {languageOptions.map(lng => {
            const isActive = getCurrentLocale() === lng.code
            return (
              <button
                key={lng.code}
                onClick={() => handleLanguageChange(lng.code)}
                className={`w-full text-left px-4 py-2 flex items-center space-x-3 hover:bg-orange-50 hover:text-orange-600 transition-colors ${
                  isActive ? "bg-orange-50 text-orange-600" : "text-slate-700"
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
