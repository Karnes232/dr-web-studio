/**
 * Apply meaningful names + metadata to Sanity media library image assets.
 *
 * Reads scripts/media-rename/proposals.json and patches each sanity.imageAsset
 * with { originalFilename, title, altText, description }. Metadata-only:
 * CDN URLs are content-hash based and never change, so nothing on the live
 * site is affected.
 *
 * Dry run (default):  npx tsx --env-file=.env.local scripts/renameMediaAssets.ts
 * Apply:              npx tsx --env-file=.env.local scripts/renameMediaAssets.ts --apply
 * Rollback:           npx tsx --env-file=.env.local scripts/renameMediaAssets.ts --restore
 *
 * Before applying, the current values of every targeted asset are saved to
 * scripts/media-rename/backup.json; --restore writes those values back.
 */
import { createClient } from "@sanity/client"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-06-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

interface AssetMeta {
  _id: string
  originalFilename: string
  title?: string
  altText?: string
  description?: string
}

const DIR = join(__dirname, "media-rename")
const PROPOSALS = join(DIR, "proposals.json")
const BACKUP = join(DIR, "backup.json")
const BATCH_SIZE = 25

const apply = process.argv.includes("--apply")
const restore = process.argv.includes("--restore")

function pickFields(entry: AssetMeta) {
  return {
    originalFilename: entry.originalFilename,
    title: entry.title,
    altText: entry.altText,
    description: entry.description,
  }
}

async function patchAll(entries: AssetMeta[], label: string) {
  let done = 0
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE)
    let txn = client.transaction()
    for (const entry of batch) {
      txn = txn.patch(entry._id, (p) => p.set(pickFields(entry)))
    }
    await txn.commit()
    done += batch.length
    console.log(`${label}: ${done}/${entries.length}`)
  }
}

async function main() {
  if (restore) {
    if (!existsSync(BACKUP)) {
      throw new Error(`No backup found at ${BACKUP} — nothing to restore.`)
    }
    const backup: AssetMeta[] = JSON.parse(readFileSync(BACKUP, "utf8"))
    await patchAll(backup, "Restored")
    console.log(`Rolled back ${backup.length} assets to their backed-up values.`)
    return
  }

  const proposals: AssetMeta[] = JSON.parse(readFileSync(PROPOSALS, "utf8"))

  const bad = proposals.filter(
    (p) => !p._id?.startsWith("image-") || !p.originalFilename
  )
  if (bad.length > 0) {
    throw new Error(
      `Invalid proposal entries (missing _id/originalFilename): ${bad
        .map((b) => b._id ?? "?")
        .join(", ")}`
    )
  }
  const names = proposals.map((p) => p.originalFilename)
  const dupes = names.filter((n, i) => names.indexOf(n) !== i)
  if (dupes.length > 0) {
    throw new Error(`Duplicate filenames in proposals: ${[...new Set(dupes)].join(", ")}`)
  }

  if (!apply) {
    console.log(`Dry run — ${proposals.length} assets would be patched. Sample:`)
    for (const p of proposals.slice(0, 5)) {
      console.log(`  ${p._id}\n    -> ${p.originalFilename} | ${p.title}`)
    }
    console.log(`\nRe-run with --apply to write changes.`)
    return
  }

  const ids = proposals.map((p) => p._id)
  const current: AssetMeta[] = await client.fetch(
    `*[_id in $ids]{_id, originalFilename, title, altText, description}`,
    { ids }
  )
  if (current.length !== proposals.length) {
    const found = new Set(current.map((c) => c._id))
    const missing = ids.filter((id) => !found.has(id))
    throw new Error(`Assets not found in dataset: ${missing.join(", ")}`)
  }
  writeFileSync(BACKUP, JSON.stringify(current, null, 2))
  console.log(`Backed up current metadata of ${current.length} assets to ${BACKUP}`)

  await patchAll(proposals, "Patched")
  console.log(`Done — ${proposals.length} assets updated.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
