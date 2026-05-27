// Minimal, dependency-free Portable Text → Markdown serializer.
// Used by the /llms-full.txt routes to inline blog post bodies and service
// descriptions as plain Markdown. Handles the block/list/mark/image shapes
// actually used in this project's content (see BlockContent.tsx); unknown
// types are ignored rather than throwing.

type Span = {
  _type: "span"
  _key?: string
  text?: string
  marks?: string[]
}

type MarkDef = {
  _key: string
  _type: string
  href?: string
}

type Block = {
  _type: string
  style?: string
  listItem?: "bullet" | "number"
  level?: number
  children?: Span[]
  markDefs?: MarkDef[]
  // image fields
  alt?: string
  caption?: string
}

const HEADING_PREFIX: Record<string, string> = {
  h1: "#",
  h2: "##",
  h3: "###",
  h4: "####",
  h5: "#####",
  h6: "######",
}

/** Render one block's spans to an inline Markdown string, applying marks. */
function renderSpans(block: Block): string {
  const children = block.children ?? []
  const markDefs = block.markDefs ?? []

  return children
    .map(span => {
      let text = span.text ?? ""
      if (!text) return ""

      for (const mark of span.marks ?? []) {
        if (mark === "strong") {
          text = `**${text}**`
        } else if (mark === "em") {
          text = `*${text}*`
        } else if (mark === "code") {
          text = `\`${text}\``
        } else if (mark === "underline" || mark === "strike-through") {
          // No Markdown equivalent — leave the text as-is.
        } else {
          // Otherwise it's a markDef key (e.g. a link).
          const def = markDefs.find(d => d._key === mark)
          if (def?._type === "link" && def.href) {
            text = `[${text}](${def.href})`
          }
        }
      }

      return text
    })
    .join("")
}

export function portableTextToMarkdown(blocks: unknown): string {
  if (!Array.isArray(blocks)) return ""

  const lines: string[] = []

  for (const raw of blocks as Block[]) {
    if (!raw || typeof raw !== "object") continue

    if (raw._type === "image") {
      const caption = raw.caption?.trim()
      const alt = raw.alt?.trim()
      if (caption) lines.push(`*${caption}*`)
      else if (alt) lines.push(`*${alt}*`)
      continue
    }

    if (raw._type !== "block") continue

    const text = renderSpans(raw).trim()
    if (!text) continue

    if (raw.listItem === "bullet" || raw.listItem === "number") {
      const indent = "  ".repeat(Math.max(0, (raw.level ?? 1) - 1))
      const bullet = raw.listItem === "number" ? "1." : "-"
      lines.push(`${indent}${bullet} ${text}`)
      continue
    }

    const style = raw.style ?? "normal"
    if (style in HEADING_PREFIX) {
      lines.push(`${HEADING_PREFIX[style]} ${text}`)
    } else if (style === "blockquote") {
      lines.push(`> ${text}`)
    } else {
      lines.push(text)
    }
  }

  // Blank line between block-level elements; collapse list runs is unnecessary
  // for LLM ingestion, so a simple double-newline join is fine.
  return lines.join("\n\n")
}
