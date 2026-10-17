import type { PaymentLocale } from "./config"

const INTL_LOCALE: Record<PaymentLocale, string> = {
  es: "es-DO",
  en: "en-US",
}

/** Format integer minor units (cents) in the viewer's locale. */
export function formatMoney(
  cents: number,
  currency: string,
  locale: PaymentLocale,
): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

/**
 * Long date for emails and the success page. Pinned to the Dominican time
 * zone so a payment at 9 pm in Punta Cana is not dated tomorrow on a UTC
 * server.
 */
export function formatPaidAt(
  date: Date | string | number,
  locale: PaymentLocale,
): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    dateStyle: "long",
    timeZone: "America/Santo_Domingo",
  }).format(new Date(date))
}
