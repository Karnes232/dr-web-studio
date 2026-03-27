"use client"

import { createContext, useContext } from "react"

interface I18nContextValue {
  currentLocale: string
  t: (key: string) => string
  getLocalizedPath: (path: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function resolveKey(translations: Record<string, unknown>, key: string): string {
  const parts = key.split(".")
  let val: unknown = translations
  for (const part of parts) {
    if (val === null || typeof val !== "object") return key
    val = (val as Record<string, unknown>)[part]
  }
  return typeof val === "string" ? val : key
}

export function I18nProvider({
  locale,
  translations,
  children,
}: {
  locale: string
  translations: Record<string, unknown>
  children: React.ReactNode
}) {
  const t = (key: string) => resolveKey(translations, key)
  const getLocalizedPath = (path: string) => `/${locale}${path}`

  return (
    <I18nContext.Provider value={{ currentLocale: locale, t, getLocalizedPath }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18nContext(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18nContext must be used within I18nProvider")
  return ctx
}
