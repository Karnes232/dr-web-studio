/**
 * Fetch all image assets with usage context and save to inventory.json.
 *
 * Run: npx tsx --env-file=.env.local scripts/media-rename/fetchInventory.ts
 */
import { createClient } from "@sanity/client"
import { writeFileSync } from "node:fs"
import { join } from "node:path"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-06-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

const query = `*[_type == "sanity.imageAsset"] | order(_createdAt asc) {
  _id,
  url,
  originalFilename,
  extension,
  "dims": metadata.dimensions{width, height},
  title,
  altText,
  description,
  "refs": *[references(^._id) && !(_id in path("drafts.**"))]{
    _type,
    _id,
    "title": coalesce(title.en, title, name.en, name, seoTitle.en, heroTitle.en, slug.current)
  }
}`

async function main() {
  const assets = await client.fetch(query)
  const out = join(__dirname, "inventory.json")
  writeFileSync(out, JSON.stringify(assets, null, 2))
  const unreferenced = assets.filter((a: { refs: unknown[] }) => a.refs.length === 0).length
  console.log(`Wrote ${assets.length} assets to ${out} (${unreferenced} unreferenced)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
