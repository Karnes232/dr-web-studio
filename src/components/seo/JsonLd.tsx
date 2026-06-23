/**
 * Renders a schema.org JSON-LD `<script>` from a plain object (typically a
 * `{ "@context", "@graph" }` graph built by `src/lib/schema/graph.ts`).
 * Server-rendered into the initial HTML so AI crawlers and Google read it.
 */
export function JsonLd({ data }: { data: unknown }) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
