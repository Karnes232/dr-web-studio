import { createHmac, timingSafeEqual } from "crypto"

/**
 * Verify a Kapso webhook signature.
 *
 * Header `X-Webhook-Signature`, HMAC-SHA256, hex-encoded, computed over the
 * **raw request body only** — no timestamp and no `t=`/`v1=` scheme, so this is
 * simpler than the Stripe and Sanity formats used elsewhere in this app.
 *
 * The body must be the exact string from `await request.text()`. Re-serialising
 * the parsed object changes key order, whitespace and Unicode escaping, and the
 * signature will not match. (Kapso's own docs show a `JSON.stringify` example
 * that is wrong for this reason.)
 *
 * Note there is no replay protection: without a signed timestamp a captured
 * request stays valid forever. The webhook path carries a secret segment as a
 * second factor, and `webhook_deliveries` makes a replay a no-op.
 */
export function isValidKapsoSignature(
  rawBody: string,
  header: string | null,
  secret: string,
): boolean {
  if (!header || !secret) return false

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex")

  const provided = Buffer.from(header.trim(), "utf8")
  const expectedBuf = Buffer.from(expected, "utf8")

  // timingSafeEqual throws on length mismatch, so check length first.
  return (
    provided.length === expectedBuf.length &&
    timingSafeEqual(provided, expectedBuf)
  )
}
