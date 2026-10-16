import { timingSafeEqual } from "crypto"

/**
 * The secret path segment on Kapso webhook URLs (`/api/webhooks/…/[token]`).
 *
 * A second factor: Kapso signs the body but includes no timestamp, so a
 * captured request is replayable indefinitely and no IP allowlist is
 * published. An unguessable path keeps casual scanners off the endpoints
 * entirely; the HMAC is still the real check.
 */
export function tokenMatches(token: string): boolean {
  // Trimmed: pasting into a hosting provider's env-var box readily picks up a
  // trailing newline, which would fail the compare with no visible cause.
  const expected = process.env.WHATSAPP_WEBHOOK_TOKEN?.trim()
  if (!expected) {
    console.error("whatsapp webhook: WHATSAPP_WEBHOOK_TOKEN is not set")
    return false
  }
  const a = Buffer.from(token.trim())
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}
