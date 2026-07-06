/**
 * Migration — Landing Page rich-text fields
 *
 * Converts four landing-page fields from plain localized strings to Portable
 * Text block arrays, so existing content stays editable after the schema
 * switched them to rich text:
 *   - servicesGrid.items[].description
 *   - whyUs.items[].description
 *   - process.steps[].description
 *   - faq.items[].answer
 *
 * Each { en, es } string becomes a single normal block. Values that are already
 * arrays (Portable Text) are left untouched, so this is idempotent.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/migrateLandingRichText.ts
 *
 * Requires SANITY_API_TOKEN (write) in .env.local.
 */

import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-06-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

let _keyCounter = 0
const key = () => `mig${++_keyCounter}`

type Localized = { en?: unknown; es?: unknown } | undefined

/** A plain string → one normal Portable Text block; arrays/empty pass through. */
function toBlocks(value: unknown): unknown {
  if (Array.isArray(value)) return value // already Portable Text
  if (typeof value === "string" && value.trim()) {
    return [
      {
        _type: "block",
        _key: key(),
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: key(), text: value, marks: [] }],
      },
    ]
  }
  return value // undefined/null/empty — leave as-is
}

/** Convert both locales of a localized field; returns undefined if absent. */
function convertLocalized(obj: Localized): Localized {
  if (!obj || typeof obj !== "object") return obj
  return { ...obj, en: toBlocks(obj.en), es: toBlocks(obj.es) }
}

function migrateDoc(doc: Record<string, any>): {
  changed: boolean
  doc: Record<string, any>
} {
  const before = JSON.stringify(doc)

  doc.servicesGrid?.items?.forEach((i: any) => {
    if (i) i.description = convertLocalized(i.description)
  })
  doc.whyUs?.items?.forEach((i: any) => {
    if (i) i.description = convertLocalized(i.description)
  })
  doc.process?.steps?.forEach((s: any) => {
    if (s) s.description = convertLocalized(s.description)
  })
  doc.faq?.items?.forEach((f: any) => {
    if (f) f.answer = convertLocalized(f.answer)
  })

  // Section subtitles (object fields on each section, not array items).
  if (doc.servicesGrid)
    doc.servicesGrid.sectionSubtitle = convertLocalized(
      doc.servicesGrid.sectionSubtitle,
    )
  if (doc.whyUs)
    doc.whyUs.sectionSubtitle = convertLocalized(doc.whyUs.sectionSubtitle)
  if (doc.process)
    doc.process.sectionSubtitle = convertLocalized(doc.process.sectionSubtitle)
  if (doc.portfolioHighlight)
    doc.portfolioHighlight.sectionSubtitle = convertLocalized(
      doc.portfolioHighlight.sectionSubtitle,
    )
  if (doc.faq)
    doc.faq.sectionSubtitle = convertLocalized(doc.faq.sectionSubtitle)

  return { changed: JSON.stringify(doc) !== before, doc }
}

async function migrate() {
  // Raw perspective so both published and draft landing docs are included.
  const docs: Record<string, any>[] = await client.fetch(
    `*[_type == "landingPage"]`,
  )
  console.log(`Found ${docs.length} landingPage document(s).`)

  let migrated = 0
  for (const raw of docs) {
    const { changed, doc } = migrateDoc(raw)
    if (!changed) {
      console.log(`• ${doc._id} — already rich text, skipped`)
      continue
    }
    await client.createOrReplace(
      doc as Parameters<typeof client.createOrReplace>[0],
    )
    migrated++
    console.log(`✓ ${doc._id} — converted to Portable Text`)
  }

  console.log(
    `\nDone. ${migrated} document(s) updated, ${docs.length - migrated} unchanged.`,
  )
}

migrate().catch(console.error)
