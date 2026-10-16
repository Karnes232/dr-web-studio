import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/leads/saveLead", () => ({ saveLead: vi.fn() }))
vi.mock("@/sanity/queries/agent/agentKnowledge", () => ({
  getAgentKnowledge: vi.fn(),
}))
// Grand Bay's live Sanity, replaced by the fixture captured from it.
vi.mock("@/sanity/queries/agent/grandbayKnowledge", async () => ({
  getGrandBayKnowledge: async () =>
    (await import("./__fixtures__/knowledge.json")).default,
}))

import { profileFor } from ".."
import { volatileContext } from "../../claude"
import { escalationEmail, newLeadEmail } from "../../notifications"
import { runTool, type ToolContext } from "../../tools"
import type { Tenant } from "@/lib/whatsapp/store"

/**
 * The decisive test for tenant #2: everything Grand Bay's customers and staff
 * can see — the full cached prefix, the tool results, the notices, the
 * per-request system message and both emails — must carry no trace of DR Web
 * Studio. One leak and a dive center's customer is told about web design, or
 * its staff are told to ask James.
 */
const DR_LEAK =
  /DR Web Studio|\bJames\b|dr-webstudio\.com|web studio|web development|planificador|project-planner|inbox\.kapso/i

const tenant = {
  tenant_id: "grandbay",
  business_name: "Grand Bay of the Sea",
  agent_profile: "grandbay",
  locales: ["en", "es", "de", "fr"],
  default_locale: "en",
  system_prompt: null,
  escalation_email: "bookings@grandbay.example",
  // The sender address is DR's verified Resend domain by design; the check
  // below covers the email TEXT, which is what the reader sees.
  email_from:
    "Grand Bay of the Sea WhatsApp Assistant <agent@dr-webstudio.com>",
  display_phone: "+1 829-374-1344",
  inbox_url: null,
} as unknown as Tenant

const profile = profileFor(tenant)!

async function everything(): Promise<Record<string, string>> {
  const knowledge = await profile.loadKnowledge()
  const ctx = {
    tenant,
    conversation: { id: "c1", lead_id: null },
    catalogue: knowledge.catalogue,
    escalatedResult: profile.escalatedResult,
    waId: "4915112345678",
    locale: "de",
  } as unknown as ToolContext

  const lead = {
    name: "Anna",
    email: null,
    company: "Hotel Riu",
    service_key: "course:openwater",
    project_type: "2 divers",
    timeline: "12-15 March",
    message: "Not certified",
  }

  return {
    tools: JSON.stringify(profile.tools),
    persona: profile.persona(tenant),
    ...Object.fromEntries(
      ["en", "es", "de", "fr"].map(l => [`knowledge.${l}`, knowledge.block(l)]),
    ),
    escalatedTool: (
      await runTool("escalate_to_human", { reason: "r", urgency: "low" }, ctx)
    ).result,
    ...Object.fromEntries(
      ["en", "es", "de", "fr"].map(l => [
        `cap.${l}`,
        profile.capReachedNotice(tenant.business_name, l),
      ]),
    ),
    volatile: volatileContext({
      profile,
      locale: "de",
      profileName: "Anna",
      conversation: { turn_count: 0, lead_id: null },
    } as never),
    volatileResumed: volatileContext({
      profile,
      locale: "de",
      resumed: true,
      conversation: { turn_count: 3, lead_id: null },
    } as never),
    leadEmail: (() => {
      const e = newLeadEmail({
        tenant,
        profile,
        customer: { waId: "4915112345678", profileName: "Anna" },
        lead,
      })!
      return `${e.subject}\n${e.text}`
    })(),
    escalationEmail: (() => {
      const e = escalationEmail({
        tenant,
        profile,
        customer: { waId: "4915112345678", profileName: "Anna" },
        reason: "liveaboard price",
        urgency: "normal",
        history: [{ role: "user", content: "Wie viel kostet Silver Bank?" }],
      })!
      return `${e.subject}\n${e.text}`
    })(),
  }
}

describe("Grand Bay — nothing of DR Web Studio reaches customers or staff", () => {
  it("has no DR, James or web-studio text anywhere", async () => {
    const all = await everything()
    for (const [where, text] of Object.entries(all)) {
      expect(text, where).not.toMatch(DR_LEAK)
    }
  })

  it("is deterministic", async () => {
    expect(await everything()).toEqual(await everything())
  })

  it("serves one English knowledge block for every language — one cache entry", async () => {
    const k = await profile.loadKnowledge()
    expect(k.block("de")).toBe(k.block("en"))
    expect(k.block("fr")).toBe(k.block("es"))
  })

  it("keeps the whole cached prefix within budget", async () => {
    const all = await everything()
    const prefix = all.tools + all.persona + all["knowledge.en"]
    // Measured in production: ~2.75 chars per real token for this prefix, so
    // 135K chars ≈ 49K tokens. Each cold start writes it all (2x input rate).
    expect(prefix.length).toBeLessThan(135_000)
  })

  it("accepts Grand Bay's catalogue keys and drops anything else", async () => {
    const saved: unknown[] = []
    const { saveLead } = await import("@/lib/leads/saveLead")
    vi.mocked(saveLead).mockImplementation(async input => {
      saved.push(input)
      return "lead-1"
    })
    const k = await profile.loadKnowledge()
    const ctx = {
      tenant,
      conversation: { id: "c1", lead_id: null },
      catalogue: k.catalogue,
      escalatedResult: profile.escalatedResult,
      waId: "4915112345678",
      locale: "de",
    } as unknown as ToolContext
    const base = {
      name: "Anna",
      company: "",
      email: "",
      project_type: "",
      timeline: "",
      notes: "",
    }
    await runTool("save_lead", { ...base, service_key: "trip:catalina" }, ctx)
    await runTool("save_lead", { ...base, service_key: "landing-page" }, ctx)
    expect((saved[0] as { serviceKey?: string }).serviceKey).toBe(
      "trip:catalina",
    )
    expect((saved[1] as { serviceKey?: string }).serviceKey).toBeUndefined()
    // And a failed write goes to Grand Bay, not DR.
    expect((saved[0] as { tenantId: string }).tenantId).toBe("grandbay")
    expect((saved[0] as { fallback?: { to: string } }).fallback?.to).toBe(
      "bookings@grandbay.example",
    )
  })

  it("tells staff to answer in the chat, with the number", async () => {
    const all = await everything()
    expect(all.leadEmail).toContain("+1 829-374-1344")
    expect(all.leadEmail).toContain("Hotel:    Hotel Riu")
    expect(all.leadEmail).toContain("Group:    2 divers")
    expect(all.escalationEmail).toContain("Reply in the chat")
  })

  it("has the cap notice in all four languages", async () => {
    const all = await everything()
    expect(all["cap.de"]).toMatch(/Vielen Dank/)
    expect(all["cap.fr"]).toMatch(/Merci/)
    expect(all["cap.es"]).toMatch(/Gracias/)
    expect(all["cap.en"]).toMatch(/Thanks/)
  })

  it("uses the same tool names and schema shape as DR", async () => {
    const dr = profileFor({ tenant_id: "drwebstudio" })!
    const shape = (tools: typeof profile.tools) =>
      tools.map(t => ({
        name: t.name,
        props: Object.keys(
          (t.input_schema as { properties: object }).properties,
        ),
      }))
    expect(shape(profile.tools)).toEqual(shape(dr.tools))
  })
})

describe("Grand Bay persona", () => {
  const persona = profile.persona(tenant)

  it("carries the shared policy", () => {
    expect(persona).toMatch(/MUST NOT calculate, estimate, total, or guess/)
    expect(persona).toMatch(/Never claim to be a human/)
    expect(persona).toMatch(/Call it ONCE/)
  })

  it("ranks labelled price lines above FAQ prose", () => {
    expect(persona).toMatch(/the labelled line is correct/)
  })

  it("never promises German-speaking staff", () => {
    expect(persona).toMatch(/Never promise a\s+German-speaking instructor/)
  })

  it("never confirms availability", () => {
    expect(persona).toMatch(/Never confirm that a date or a spot is free/)
  })
})
