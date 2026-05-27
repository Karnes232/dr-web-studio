import { buildLlmsFull } from "@/lib/llmsFull"

// Generated /llms-full-es.txt — full Spanish content (blog post bodies, service
// descriptions, FAQs) for LLMs/AI agents. English lives at /llms-full.txt.
export const revalidate = 3600

export async function GET() {
  const body = await buildLlmsFull("es")

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
