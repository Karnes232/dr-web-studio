import { createHmac, timingSafeEqual } from "crypto"
import { localizedUrl } from "@/lib/urls"
import { SITE_URL } from "@/lib/site"
import { routing } from "@/i18n/routing"
import type { Locale } from "@/lib/slugs"

// IndexNow lets us ping Bing, Yandex, Seznam, etc. the moment content changes,
// instead of waiting for the next crawl. One POST to api.indexnow.org is shared
// across every participating engine. The key file proves we own the host.

/** Public URL that serves the IndexNow key (see src/app/indexnow-key.txt). */
export const INDEXNOW_KEY_LOCATION = `${SITE_URL}/indexnow-key.txt`

/** A document shape as delivered by a Sanity webhook. `slug`/`slugEs` may be a
 *  raw string (if the webhook projects `slug.current`) or the slug object. */
type PublishedDoc = {
  _type?: string
  slug?: string | { current?: string } | null
  slugEs?: string | { current?: string } | null
}

const slugValue = (v: PublishedDoc["slug"]): string | undefined =>
  typeof v === "string" ? v : (v?.current ?? undefined)

/**
 * Verify a Sanity webhook signature (`sanity-webhook-signature: t=<ts>,v1=<sig>`).
 * `sig` is base64url(HMAC-SHA256(secret, `${ts}.${body}`)). Constant-time compare.
 */
export function isValidSanitySignature(
  body: string,
  header: string | null,
  secret: string,
): boolean {
  if (!header) return false
  const parts: Record<string, string> = {}
  for (const segment of header.split(",")) {
    const idx = segment.indexOf("=")
    if (idx === -1) continue
    parts[segment.slice(0, idx).trim()] = segment.slice(idx + 1).trim()
  }
  const ts = parts.t
  const provided = parts.v1
  if (!ts || !provided) return false

  const expected = createHmac("sha256", secret)
    .update(`${ts}.${body}`)
    .digest("base64url")

  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

/**
 * The localized (en + es) canonical URLs affected by a published document.
 * Only content types with public, slugged pages are mapped; anything else
 * returns [] (no submission).
 */
export function indexNowUrlsForDocument(doc: PublishedDoc): string[] {
  const en = slugValue(doc.slug)
  if (!en) return []
  const es = slugValue(doc.slugEs) ?? en
  const pair: Record<Locale, string> = { en, es }

  if (doc._type === "blogPost") {
    return routing.locales.map(locale =>
      localizedUrl(
        { pathname: "/blog/[slug]", params: { slug: pair[locale] } },
        locale,
      ),
    )
  }
  if (doc._type === "serviceItem") {
    return routing.locales.map(locale =>
      localizedUrl(
        { pathname: "/our-services/[slug]", params: { slug: pair[locale] } },
        locale,
      ),
    )
  }
  return []
}

/**
 * Submit URLs to IndexNow. No-ops (skipped) when the key is unset or there is
 * nothing to send. Resubmitting the same URL is harmless (idempotent).
 */
export async function submitToIndexNow(
  urls: string[],
): Promise<{ ok: boolean; status: number; skipped?: boolean }> {
  const key = process.env.INDEXNOW_KEY
  if (!key || urls.length === 0) return { ok: true, status: 0, skipped: true }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: urls,
    }),
  })
  return { ok: res.ok, status: res.status }
}
