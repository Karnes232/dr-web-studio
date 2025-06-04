import { useState, useEffect } from "react"
import { getTranslation } from "@/i18n"

function useTranslations(locale: string) {
  const [t, setT] = useState<(key: string) => string>(
    () => (key: string) => key,
  )

  useEffect(() => {
    let mounted = true

    async function loadTranslations() {
      const { t } = await getTranslation(locale)
      if (mounted) {
        setT(() => t)
      }
    }

    loadTranslations()
    return () => {
      mounted = false
    }
  }, [locale])

  return t
}

export default useTranslations
