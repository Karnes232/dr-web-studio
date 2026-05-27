import { buildLlmsFull } from "@/lib/llmsFull"

// Generated /llms-full.txt — full English content (blog post bodies, service
// descriptions, FAQs) for LLMs/AI agents. Spanish lives at /llms-full-es.txt.
export const revalidate = 3600

export async function GET() {
  const body = await buildLlmsFull("en")

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
