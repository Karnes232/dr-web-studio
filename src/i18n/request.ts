import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`./locales/${locale}/translation.json`)).default,
    // Match the previous custom resolver: missing keys render the key itself,
    // silently (no thrown error, no console noise).
    getMessageFallback: ({ key }) => key,
    onError: () => {},
  }
})
