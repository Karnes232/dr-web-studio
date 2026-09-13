import { describe, expect, it } from "vitest"
import { renderKnowledge } from "./knowledge"
import fixture from "./__fixtures__/knowledge.json"
import type { AgentKnowledge } from "@/sanity/queries/agent/agentKnowledge"

// A real snapshot of the live `production` dataset. Public marketing content
// only — no PII.
const kb = fixture as unknown as AgentKnowledge
const rendered = renderKnowledge(kb, "both")

describe("renderKnowledge", () => {
  it("is deterministic — the prompt cache depends on it", () => {
    expect(renderKnowledge(kb, "both")).toBe(rendered)
    // Anything date-like would vary per request and destroy the cache.
    expect(rendered).not.toMatch(/\d{4}-\d{2}-\d{2}T/)
  })

  it("carries both locales", () => {
    expect(rendered).toContain("Starter Website")
    expect(rendered).toContain("Sitio Web Inicial")
    expect(rendered).toContain("EN:")
    expect(rendered).toContain("ES:")
  })

  it("labels excluded package features as NOT included", () => {
    // `included: false` means the package does NOT have the feature. If this
    // regresses, the agent promises a Starter customer e-commerce.
    const excluded = kb.packages.flatMap(p =>
      (p.features ?? []).filter(f => !f.included).map(f => f.text.en),
    )
    expect(excluded.length).toBeGreaterThan(0)
    expect(rendered).toContain("NOT included:")
    for (const text of excluded) expect(rendered).toContain(text)
  })

  it("adds the currency symbol the CMS omits", () => {
    // Sanity stores bare numbers: "400", not "$400".
    expect(kb.packages[0].price).not.toContain("$")
    expect(rendered).toContain("$400")
    expect(rendered).toContain("$95")
  })

  it("adds the unit to bare timeline ranges without mangling words", () => {
    expect(rendered).toMatch(/\d+-\d+ weeks/)
    // "Ongoing" must not become "Ongoing weeks".
    expect(rendered).not.toContain("Ongoing weeks")
  })

  it("flattens all three FAQ types into one section", () => {
    const total =
      kb.faqs.length +
      kb.contactFaqs.length +
      kb.faqCategories.flatMap(c => c.questions ?? []).length
    expect(total).toBeGreaterThan(15)
    expect((rendered.match(/^Q\(en\) /gm) ?? []).length).toBe(total)
    // The agent should never learn they were three separate Sanity types.
    expect(rendered).not.toContain("contactFaq")
    expect(rendered).not.toContain("faqCategory")
  })

  it("includes the service catalogue keys the list_services tool returns", () => {
    for (const s of kb.plannerServices)
      expect(rendered).toContain(`key=${s.key}`)
  })

  // Measured against a real turn: 54,209 chars billed as 22,474 tokens.
  // chars/4 — the usual English rule of thumb — undercounts this content by
  // ~66%, because accented, short-word Spanish tokenizes far denser.
  const CHARS_PER_TOKEN = 2.4
  const tokens = (s: string) => Math.round(s.length / CHARS_PER_TOKEN)

  it("renders one language at a time to keep the cache write cheap", () => {
    const es = renderKnowledge(kb, "es")
    const en = renderKnowledge(kb, "en")
    const both = renderKnowledge(kb, "both")

    expect(es).toContain("Sitio Web Inicial")
    expect(es).not.toContain("Starter Website")
    expect(en).toContain("Starter Website")
    expect(en).not.toContain("Sitio Web Inicial")

    // A single-language block must be materially smaller — the cache WRITE is
    // 12.5x the read, so prefix size dominates at sparse traffic.
    expect(es.length).toBeLessThan(both.length * 0.65)

    console.log(
      `knowledge block — es: ${es.length.toLocaleString()} chars (~${tokens(es).toLocaleString()} tok), ` +
        `en: ${en.length.toLocaleString()} chars (~${tokens(en).toLocaleString()} tok), ` +
        `both: ${both.length.toLocaleString()} chars (~${tokens(both).toLocaleString()} tok)`,
    )
  })

  it("stays small enough to cache economically", () => {
    // llms-full.txt is ~295K tokens, which is why it is not used here.
    expect(tokens(renderKnowledge(kb, "es"))).toBeLessThan(15_000)
  })
})
