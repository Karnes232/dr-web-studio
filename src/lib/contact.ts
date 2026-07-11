/**
 * Shared builders for click-to-chat / click-to-call links so every surface
 * (header, footer, contact page, landing CTAs) formats them identically.
 * The phone number itself is CMS data (`generalLayout.telephone`).
 */

/** wa.me deep link; strips everything but digits, optional prefilled text. */
export function waHref(phone: string, text?: string): string {
  const digits = phone.replace(/\D/g, "")
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`
}

/** tel: link; keeps a leading + and digits only. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, "")}`
}
