/**
 * Merge vision-agent batch outputs into proposals.json + review.html.
 *
 * Run: npx tsx scripts/media-rename/buildProposals.ts <batch-output-dir>
 *
 * - Validates every asset in inventory.json has exactly one proposal
 * - Forces extension to match the asset's real extension
 * - Normalizes to kebab-case, dedupes filename collisions with -2, -3, ...
 * - Writes proposals.json (input for renameMediaAssets.ts) and review.html
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

interface InventoryAsset {
  _id: string
  url: string
  originalFilename?: string
  extension: string
  dims?: { width: number; height: number }
  refs: { _type: string; _id: string; title?: string }[]
}

interface Proposal {
  _id: string
  originalFilename: string
  title: string
  altText: string
  description: string
  unreferenced?: boolean
}

const DIR = __dirname
const batchDir = process.argv[2]
if (!batchDir) {
  console.error("Usage: npx tsx scripts/media-rename/buildProposals.ts <batch-output-dir>")
  process.exit(1)
}

const inventory: InventoryAsset[] = JSON.parse(
  readFileSync(join(DIR, "inventory.json"), "utf8")
)
const byId = new Map(inventory.map((a) => [a._id, a]))

const proposals: Proposal[] = readdirSync(batchDir)
  .filter((f) => /^batch-\d+-output\.json$/.test(f))
  .sort()
  .flatMap((f) => JSON.parse(readFileSync(join(batchDir, f), "utf8")))

// --- validate coverage ---
const seen = new Set<string>()
for (const p of proposals) {
  if (!byId.has(p._id)) throw new Error(`Proposal for unknown asset: ${p._id}`)
  if (seen.has(p._id)) throw new Error(`Duplicate proposal for: ${p._id}`)
  seen.add(p._id)
}
const missing = inventory.filter((a) => !seen.has(a._id))
if (missing.length > 0) {
  throw new Error(
    `Missing proposals for ${missing.length} assets:\n` +
      missing.map((a) => `  ${a._id} (${a.originalFilename})`).join("\n")
  )
}

// --- normalize filenames + fix extensions ---
const kebab = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

for (const p of proposals) {
  const asset = byId.get(p._id)!
  const base = p.originalFilename.replace(/\.[a-z0-9]+$/i, "")
  p.originalFilename = `${kebab(base)}.${asset.extension}`
}

// --- dedupe collisions ---
const used = new Map<string, number>()
for (const p of proposals) {
  const n = used.get(p.originalFilename) ?? 0
  used.set(p.originalFilename, n + 1)
  if (n > 0) {
    const asset = byId.get(p._id)!
    p.originalFilename = p.originalFilename.replace(
      new RegExp(`\\.${asset.extension}$`),
      `-${n + 1}.${asset.extension}`
    )
  }
}

writeFileSync(join(DIR, "proposals.json"), JSON.stringify(proposals, null, 2))

// --- review.html ---
const esc = (s: string | undefined) =>
  (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const rows = proposals
  .map((p) => {
    const a = byId.get(p._id)!
    const refs =
      a.refs.length > 0
        ? a.refs.map((r) => `${esc(r._type)}: ${esc(r.title ?? r._id)}`).join("<br>")
        : `<span class="unref">unreferenced</span>`
    return `<tr>
      <td><a href="${a.url}" target="_blank"><img loading="lazy" src="${a.url}?w=160&auto=format&q=60" alt=""></a></td>
      <td class="old">${esc(a.originalFilename)}</td>
      <td class="new"><strong>${esc(p.originalFilename)}</strong><br><em>${esc(p.title)}</em></td>
      <td>${esc(p.altText)}</td>
      <td class="refs">${refs}<br><span class="desc">${esc(p.description)}</span></td>
    </tr>`
  })
  .join("\n")

const unrefCount = proposals.filter((p) => p.unreferenced).length
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Media rename review — ${proposals.length} assets</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 2rem; background: #f8fafc; color: #0f172a; }
  h1 { font-size: 1.3rem; }
  table { border-collapse: collapse; width: 100%; background: #fff; font-size: 0.85rem; }
  th, td { border: 1px solid #e2e8f0; padding: 0.5rem; vertical-align: top; text-align: left; }
  th { background: #f1f5f9; position: sticky; top: 0; }
  img { width: 120px; height: auto; border-radius: 4px; display: block; }
  .old { color: #94a3b8; word-break: break-all; max-width: 14rem; }
  .new { word-break: break-all; max-width: 16rem; }
  .refs { max-width: 18rem; color: #475569; }
  .desc { color: #94a3b8; font-size: 0.78rem; }
  .unref { color: #b91c1c; font-weight: 600; }
</style>
</head>
<body>
<h1>Media rename review — ${proposals.length} assets (${unrefCount} unreferenced)</h1>
<p>Edit <code>scripts/media-rename/proposals.json</code> for any name you want to change, then run
<code>npx tsx --env-file=.env.local scripts/renameMediaAssets.ts --apply</code>.</p>
<table>
<thead><tr><th>Image</th><th>Current name</th><th>Proposed name / title</th><th>Alt text</th><th>Used by</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
</body>
</html>`

writeFileSync(join(DIR, "review.html"), html)
console.log(
  `Wrote ${proposals.length} proposals (${unrefCount} unreferenced) to proposals.json and review.html`
)
