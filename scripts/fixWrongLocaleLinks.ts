/**
 * Rewrite wrong-locale internal links inside blogPost bodies.
 *
 * An Ahrefs audit surfaced internal links that 308-redirect because a CMS author
 * pasted an absolute URL carrying the other locale's slug — e.g.
 * `/es/contact` (should be `/es/contacto`) or `/en/blog/<spanish-slug>`.
 * They resolve, but every one burns a redirect hop and dilutes internal linking.
 *
 * Scope is deliberately narrow: `blogPost.body.{en,es}[].markDefs[].href` only.
 * `seo.structuredData` also contains wrong-locale URLs but is never rendered
 * (JsonLd.tsx emits the code-generated @graph, not the CMS string), so those are
 * not links and are left alone.
 *
 * Dry run (default):  npx tsx --env-file=.env.local scripts/fixWrongLocaleLinks.ts
 * Apply:              npx tsx --env-file=.env.local scripts/fixWrongLocaleLinks.ts --apply
 * Rollback:           npx tsx --env-file=.env.local scripts/fixWrongLocaleLinks.ts --restore
 *
 * Before applying, each touched doc's original `body` is saved to
 * scripts/fix-links-backup.json; --restore writes those bodies back verbatim.
 *
 * Idempotent: a second run reports zero rewrites.
 */
import { createClient } from "@sanity/client"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { routing } from "../src/i18n/routing"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-06-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

const BACKUP = join(__dirname, "fix-links-backup.json")
const HOST = "www.dr-webstudio.com"
const BATCH_SIZE = 25

const apply = process.argv.includes("--apply")
const restore = process.argv.includes("--restore")

type Locale = "en" | "es"
type Block = { markDefs?: { href?: string }[] }
type BlogDoc = {
  _id: string
  slug?: { current?: string }
  slugEs?: { current?: string }
  body?: Partial<Record<Locale, Block[]>>
}
type BackupEntry = { _id: string; body: BlogDoc["body"] }

/**
 * Top-level segment maps from routing.pathnames — the single source of truth for
 * localized URLs. Keys with a `[slug]` token are handled separately (their slug
 * VALUE localizes per document, which next-intl doesn't know about).
 */
function buildSegmentMaps() {
  const enToEs = new Map<string, string>()
  const esToEn = new Map<string, string>()
  for (const value of Object.values(routing.pathnames)) {
    if (typeof value === "string") continue
    const en = value.en?.replace(/^\//, "")
    const es = value.es?.replace(/^\//, "")
    if (!en || !es || en.includes("[") || es.includes("[")) continue
    enToEs.set(en, es)
    esToEn.set(es, en)
  }
  return { enToEs, esToEn }
}

const { enToEs, esToEn } = buildSegmentMaps()
// The localized base for nested service URLs, derived rather than hardcoded.
const SERVICES_ES = enToEs.get("our-services") ?? "nuestros-servicios"

const stats = new Map<string, number>()
const unmappable: string[] = []
const bump = (k: string) => stats.set(k, (stats.get(k) ?? 0) + 1)

/**
 * Returns a corrected href, or null when it's already correct.
 * Only absolute URLs on our own host are considered — every offending link
 * found in the audit was absolute, and rewriting relative hrefs would risk
 * touching links the renderer already localizes.
 */
function fixHref(
  href: string,
  serviceEnToEs: Map<string, string>,
  blogEsToEn: Map<string, string>,
  blogEnToEs: Map<string, string>,
): string | null {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return null // relative or malformed — out of scope
  }
  if (url.hostname !== HOST) return null

  const parts = url.pathname.replace(/^\/|\/$/g, "").split("/")
  const [locale, head, ...rest] = parts
  if (locale !== "en" && locale !== "es") return null
  if (!head) return null

  const rebuild = (segs: string[]) => {
    url.pathname = "/" + [locale, ...segs].join("/")
    return url.toString()
  }

  // Collection routes: the [slug] VALUE localizes per document.
  if (head === "blog" && rest.length === 1) {
    const slug = rest[0]
    if (locale === "en" && blogEsToEn.has(slug)) {
      bump("/en/blog/<es-slug>")
      return rebuild(["blog", blogEsToEn.get(slug)!])
    }
    if (locale === "es" && blogEnToEs.has(slug)) {
      bump("/es/blog/<en-slug>")
      return rebuild(["blog", blogEnToEs.get(slug)!])
    }
    return null
  }

  // Nested service pages: base segment AND slug value both localize.
  if (locale === "es" && head === "our-services" && rest.length === 1) {
    const esSlug = serviceEnToEs.get(rest[0])
    if (!esSlug) {
      unmappable.push(href)
      return null
    }
    bump("/es/our-services/<en-slug>")
    return rebuild([SERVICES_ES, esSlug])
  }

  // Top-level static routes.
  if (locale === "es" && enToEs.has(head)) {
    bump(`/es/${head}`)
    return rebuild([enToEs.get(head)!, ...rest])
  }
  if (locale === "en" && esToEn.has(head)) {
    bump(`/en/${head}`)
    return rebuild([esToEn.get(head)!, ...rest])
  }
  return null
}

/** Rewrites a doc's body in place. Returns the number of hrefs changed. */
function fixDoc(
  doc: BlogDoc,
  serviceEnToEs: Map<string, string>,
  blogEsToEn: Map<string, string>,
  blogEnToEs: Map<string, string>,
): number {
  let changed = 0
  for (const locale of ["en", "es"] as Locale[]) {
    for (const block of doc.body?.[locale] ?? []) {
      for (const md of block.markDefs ?? []) {
        if (!md.href) continue
        const fixed = fixHref(md.href, serviceEnToEs, blogEsToEn, blogEnToEs)
        if (fixed && fixed !== md.href) {
          md.href = fixed
          changed++
        }
      }
    }
  }
  return changed
}

async function patchBodies(entries: BackupEntry[], label: string) {
  let done = 0
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    let txn = client.transaction()
    for (const entry of entries.slice(i, i + BATCH_SIZE)) {
      txn = txn.patch(entry._id, p => p.set({ body: entry.body }))
    }
    await txn.commit()
    done += Math.min(BATCH_SIZE, entries.length - i)
    console.log(`  ${label} ${done}/${entries.length}`)
  }
}

async function main() {
  if (restore) {
    if (!existsSync(BACKUP)) {
      throw new Error(`No backup found at ${BACKUP} — nothing to restore.`)
    }
    const backup: BackupEntry[] = JSON.parse(readFileSync(BACKUP, "utf8"))
    await patchBodies(backup, "Restored")
    console.log(
      `Rolled back ${backup.length} doc(s) to their backed-up bodies.`,
    )
    return
  }

  const [docs, services] = await Promise.all([
    client.fetch<BlogDoc[]>(`*[_type == "blogPost"]{_id, slug, slugEs, body}`),
    client.fetch<{ en?: string; es?: string }[]>(
      `*[_type == "serviceItem"]{"en": slug.current, "es": slugEs.current}`,
    ),
  ])

  const serviceEnToEs = new Map<string, string>()
  for (const s of services) if (s.en && s.es) serviceEnToEs.set(s.en, s.es)

  const blogEsToEn = new Map<string, string>()
  const blogEnToEs = new Map<string, string>()
  for (const d of docs) {
    const en = d.slug?.current
    const es = d.slugEs?.current
    if (en && es) {
      blogEsToEn.set(es, en)
      blogEnToEs.set(en, es)
    }
  }

  const drafts = docs.filter(d => d._id.startsWith("drafts.")).length
  console.log(
    `Scanning ${docs.length} blogPost doc(s) (${drafts} draft(s)), ` +
      `${serviceEnToEs.size} service slug pair(s), ${blogEsToEn.size} blog slug pair(s).\n`,
  )

  const backup: BackupEntry[] = []
  const patched: BackupEntry[] = []
  let totalLinks = 0

  for (const doc of docs) {
    const original = JSON.parse(JSON.stringify(doc.body ?? {}))
    const changed = fixDoc(doc, serviceEnToEs, blogEsToEn, blogEnToEs)
    if (changed > 0) {
      totalLinks += changed
      backup.push({ _id: doc._id, body: original })
      patched.push({ _id: doc._id, body: doc.body })
      console.log(
        `  ${String(changed).padStart(3)} link(s)  ${doc.slug?.current ?? doc._id}`,
      )
    }
  }

  console.log(`\nRewrites by pattern:`)
  for (const [k, v] of [...stats.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(v).padStart(4)}x  ${k}`)
  }
  if (unmappable.length) {
    console.log(
      `\n!! ${unmappable.length} URL(s) had no slug counterpart — SKIPPED, not guessed:`,
    )
    for (const u of [...new Set(unmappable)]) console.log(`     ${u}`)
  }
  console.log(
    `\n${totalLinks} link(s) across ${patched.length} doc(s) would be rewritten.`,
  )

  if (!apply) {
    console.log(`\nDry run — nothing written. Re-run with --apply to commit.`)
    return
  }
  if (patched.length === 0) {
    console.log(`\nNothing to do.`)
    return
  }

  writeFileSync(BACKUP, JSON.stringify(backup, null, 2))
  console.log(`\nBacked up ${backup.length} original body/bodies to ${BACKUP}`)
  await patchBodies(patched, "Patched")
  console.log(
    `\nDone. Re-run without --apply to confirm 0 remaining (idempotency check).`,
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
