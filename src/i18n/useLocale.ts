import { usePathname } from "next/navigation"
import { languages, fallbackLng } from "./settings"
import useTranslations from "./useTranslations"

export function useLocale() {
  const pathname = usePathname()

  const getCurrentLocale = () => {
    const segments = pathname.split("/")
    return languages.includes(segments[1]) ? segments[1] : fallbackLng
  }

  const currentLocale = getCurrentLocale()
  const t = useTranslations(currentLocale)

  const getLocalizedPath = (path: string) => {
    return currentLocale === fallbackLng ? path : `/${currentLocale}${path}`
  }

  return {
    currentLocale,
    t,
    getLocalizedPath,
  }
}
