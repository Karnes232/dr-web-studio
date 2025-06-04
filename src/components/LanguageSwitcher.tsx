"use client"

import { useRouter, usePathname } from "next/navigation"
import { languages, fallbackLng } from "@/i18n/settings"
import { useState, useRef, useEffect } from "react"

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languageOptions = [
    { code: "en", display: "English", flag: "🇺🇸" },
    { code: "es", display: "Español", flag: "🇪🇸" },
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
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white dark:bg-black  px-3 py-0 rounded-md shadow-sm border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-lg">{currentLangOption.flag}</span>
        <span className="font-medium text-gray-700 dark:text-white">
          {currentLangOption.display}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-gray-500 dark:text-white transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="mt-2 w-48 bg-white dark:bg-black dark:border dark:border-gray-300 dark:rounded-md rounded-md shadow-2xl">
          {languageOptions.map(lng => {
            const isActive = getCurrentLocale() === lng.code
            return (
              <button
                key={lng.code}
                onClick={() => handleLanguageChange(lng.code)}
                className={`flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700  dark:border dark:border-gray-300 dark:text-white  hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive ? "bg-gray-100 dark:bg-black" : ""
                }`}
              >
                <span className="text-lg">{lng.flag}</span>
                <span className="font-medium">{lng.display}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
