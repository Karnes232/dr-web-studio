// Minimal, dependency-free Portable Text → plain text serializer.
// Used to feed rich-text fields (e.g. landing FAQ answers) into JSON-LD nodes
// that require a clean string (schema.org Answer.text). Unlike
// portableTextToMarkdown, this emits NO markup — just the concatenated text.
// Unknown/image blocks are ignored rather than throwing.

type Span = {
  _type?: string
  text?: string
}

type Block = {
  _type?: string
  children?: Span[]
}

/** Flatten Portable Text blocks into a single plain string (blocks joined by
 *  a space, spans concatenated). Non-array / empty input returns "". */
export function portableTextToPlainText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return ""

  const lines: string[] = []

  for (const raw of blocks as Block[]) {
    if (!raw || typeof raw !== "object") continue
    if (raw._type !== "block") continue

    const text = (raw.children ?? [])
      .map(span => span?.text ?? "")
      .join("")
      .trim()

    if (text) lines.push(text)
  }

  return lines.join(" ")
}
