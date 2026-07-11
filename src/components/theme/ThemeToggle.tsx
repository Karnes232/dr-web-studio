"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

// Mirrors the LanguageSwitcher pattern: a brand-styled button with separate
// desktop/mobile sizing. Toggles between light and dark, resolving the current
// appearance from `resolvedTheme` so the first click from "system" does the
// expected thing. A `mounted` guard avoids a hydration mismatch (the server has
// no way to know the resolved theme).
export default function ThemeToggle({ color }: { color: string }) {
  const t = useTranslations("theme")
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"
  const label = isDark ? t("toLight") : t("toDark")

  const toggle = () => setTheme(isDark ? "light" : "dark")

  // Keep layout stable before mount: render a same-sized, inert placeholder.
  if (!mounted) {
    return (
      <div aria-hidden="true" className="h-9 w-9 lg:h-10 lg:w-10 rounded-lg" />
    )
  }

  const Icon = isDark ? Sun : Moon

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`flex items-center justify-center text-${color} dark:text-slate-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-800 border border-transparent hover:border-orange-200 dark:hover:border-slate-700 lg:hidden xl:block`}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}
