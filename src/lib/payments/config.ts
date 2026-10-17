/**
 * Fixed rules for the custom-payment checkout. The server decides all of
 * these; nothing here is ever read from a request body.
 */

/** Smallest charge, in cents ($1.00). */
export const MIN_CENTS = 100
/** Largest charge, in cents ($10,000.00). */
export const MAX_CENTS = 1_000_000
/** The only currency this checkout charges in. */
export const CURRENCY = "usd"
/** Stamped on every PaymentIntent we create so the webhook can tell ours apart. */
export const PAYMENT_SOURCE = "custom-payment"

export const LOCALES = ["es", "en"] as const
export type PaymentLocale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: PaymentLocale = "es"

/** BotPoison public key (public by design; same one the contact form uses). */
export const BOTPOISON_PUBLIC_KEY = "pk_de02a196-39ef-4d2b-8691-40646ab2d702"

/** Used when the CMS has no WhatsApp number to show. */
export const FALLBACK_WHATSAPP = "+1 204-809-3662"
/** Where owner notifications go, and the fallback support address. */
export const OWNER_EMAIL = "james@dr-webstudio.com"
