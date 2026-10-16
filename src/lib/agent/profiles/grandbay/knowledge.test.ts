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
    // ~116K chars on 2026-10-16 with the course write-ups, dive site
    // descriptions, marine life and About page. Past 125K the cache write per
    // cold start gets expensive: trim the course write-ups or FAQs first.
    expect(rendered.length).toBeLessThan(125_000)
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

describe("renderGrandBayKnowledge — long-form content", () => {
  it("includes each course's write-up under the course", () => {
    const ow = kb.courses.find(c => c.slug === "openwater")!
    expect(ow.about).toBeTruthy()
    const section = rendered.slice(
      rendered.indexOf("### Open Water Diver ("),
      rendered.indexOf("### Peak Performance Buoyancy"),
    )
    expect(section).toContain("About this course:")
    expect(section).toContain(ow.about!.split("\n")[0].trim())
  })

  it("describes every dive site and names its neighbours", () => {
    for (const s of kb.diveSites.filter(s => s.description)) {
      expect(rendered).toContain(s.description!.trim().slice(0, 60))
    }
    expect(rendered).toMatch(/Nearby sites: /)
  })

  it("lists the marine life", () => {
    expect(kb.species.length).toBeGreaterThan(0)
    expect(rendered).toContain("## Marine life seen on their dives")
    for (const s of kb.species) expect(rendered).toContain(`- ${s.name}`)
  })

  it("introduces the team, but never the site's web developer", () => {
    // He is on their About page; named here, the agent would route
    // customers to DR Web Studio.
    expect(kb.about!.team!.some(m => /james karnes/i.test(m.name ?? ""))).toBe(
      true,
    )
    expect(rendered).toContain("Franklin Santos")
    expect(rendered).not.toMatch(/james/i)
  })

  it("adds the Punta Cana guide page and its FAQs", () => {
    expect(rendered).toContain("## Scuba diving in Punta Cana (general guide)")
    expect(rendered).toContain(kb.puntaCana!.faqs![0].q!.trim())
  })

  it("collapses runs of blank lines in CMS prose", () => {
    expect(rendered).not.toMatch(/\n{3,}/)
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
