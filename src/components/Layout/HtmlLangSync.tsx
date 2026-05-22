"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function HtmlLangSync() {
  const pathname = usePathname()

  useEffect(() => {
    const segment = pathname?.split("/")[1]
    const lang = segment === "es" || segment === "en" ? segment : "en"
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang
    }
  }, [pathname])

  return null
}
