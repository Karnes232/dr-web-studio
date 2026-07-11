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

/** tel: link; digits only, normalized to E.164 (+…) so the number dials
 *  correctly from abroad even when the CMS value omits the plus. */
export function telHref(phone: string): string {
  const cleaned = phone.replace(/[^+\d]/g, "")
  return `tel:${cleaned.startsWith("+") ? cleaned : `+${cleaned}`}`
}
