import { describe, expect, it } from "vitest"
import { catalogue, renderGrandBayKnowledge, SITE, usd } from "./knowledge"
import fixture from "./__fixtures__/knowledge.json"
import type { GrandBayKnowledge } from "@/sanity/queries/agent/grandbayKnowledge"

// Captured from Grand Bay's live public dataset (33b6wn5r/production) on
// 2026-10-16 with `grandBayKnowledgeQuery`. Public marketing content only.
const kb = fixture as unknown as GrandBayKnowledge
const rendered = renderGrandBayKnowledge(kb)

describe("renderGrandBayKnowledge", () => {
  it("is deterministic — it is the cache key", () => {
    expect(renderGrandBayKnowledge(kb)).toBe(rendered)
    expect(rendered).not.toMatch(/\d{4}-\d{2}-\d{2}T/)
  })

  it("stays inside its token budget", () => {
    // English runs ~4 chars/token. 60K chars ≈ 15K tokens: past that the
    // cache write per conversation gets expensive; trim course FAQs first.
    expect(rendered.length).toBeLessThan(60_000)
  })

  it("renders every published price as a labelled $N USD line", () => {
    for (const c of kb.courses) {
      expect(rendered).toContain(`Price: ${usd(c.price!)} per person`)
    }
    for (const t of kb.trips) {
      expect(rendered).toContain(`Price: ${usd(t.price!)} per diver`)
      expect(rendered).toContain(`${usd(t.deposit!)} per booking`)
    }
    expect(rendered).toContain(`Two-tank dive: ${usd(kb.localDives!.twoTank!)}`)
    expect(rendered).toContain(`Price: ${usd(kb.sharkDive!.price!)} per diver`)
    expect(rendered).toContain(
      `Private charter (whole boat): ${usd(kb.fishing!.privateCharter!)}`,
    )
  })

  it("gives courses a 50% deposit, as their booking code does", () => {
    const ow = kb.courses.find(c => c.slug === "openwater")!
    expect(rendered).toContain(
      `Online deposit to reserve: ${usd(ow.price! / 2)}`,
    )
  })

  it("links every bookable item to its page", () => {
    for (const c of kb.courses)
      expect(rendered).toContain(`${SITE}/courses/${c.slug}`)
    for (const t of kb.trips)
      expect(rendered).toContain(`${SITE}/trips/${t.slug}`)
    for (const path of [
      "/sites",
      "/shark-dive-punta-cana",
      "/fishing-punta-cana",
      "/liveaboard-dominican-republic",
      "/terms-and-conditions",
      "/contact",
    ])
      expect(rendered).toContain(`${SITE}${path}`)
  })

  it("marks Saona as a private charter", () => {
    const saona = rendered.slice(rendered.indexOf("### Saona"))
    expect(saona.slice(0, 300)).toContain("PRIVATE CHARTER ONLY")
  })

  it("forbids liveaboard prices outright", () => {
    expect(rendered).toContain(
      "NO PRICES OR DATES ARE PUBLISHED for liveaboards",
    )
  })

  it("lists every catalogue key in the block itself", () => {
    for (const c of catalogue(kb)) expect(rendered).toContain(`- ${c.key} — `)
  })

  it("carries the departure days that exist only in their code", () => {
    expect(rendered).toContain("Catalina Island — Monday, Wednesday, Friday")
    expect(rendered).toContain("no German-speaking instructors")
  })

  it("omits a section the CMS stops returning instead of printing nulls", () => {
    const partial = renderGrandBayKnowledge({
      ...kb,
      fishing: null,
      liveaboards: null,
    })
    expect(partial).not.toContain("Fishing (service_key fishing)")
    expect(partial).not.toMatch(/null|undefined/)
  })

  it("never mentions DR Web Studio", () => {
    expect(rendered).not.toMatch(/DR Web Studio|dr-webstudio|James/i)
  })
})

describe("catalogue", () => {
  it("keys every course and trip by slug, plus the singletons", () => {
    const keys = catalogue(kb).map(c => c.key)
    expect(keys).toContain("course:openwater")
    expect(keys).toContain("trip:saona")
    expect(keys).toEqual(
      expect.arrayContaining([
        "local-dives",
        "shark-dive",
        "fishing",
        "liveaboard",
      ]),
    )
    expect(new Set(keys).size).toBe(keys.length)
  })
})

describe("usd", () => {
  it("formats without locale data", () => {
    expect(usd(1000)).toBe("$1,000 USD")
    expect(usd(249.5)).toBe("$249.50 USD")
    expect(usd(100)).toBe("$100 USD")
  })
})
