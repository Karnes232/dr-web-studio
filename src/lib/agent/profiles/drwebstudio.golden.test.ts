import { describe, expect, it, vi } from "vitest"

// tools.ts imports saveLead, which pulls in clients that need env vars.
// Only the tool schemas are under test here.
vi.mock("@/lib/leads/saveLead", () => ({ saveLead: vi.fn() }))

// The profile loads live Sanity content; feed it the same fixture instead.
vi.mock("@/sanity/queries/agent/agentKnowledge", async () => ({
  getAgentKnowledge: async () =>
    (await import("../__fixtures__/knowledge.json")).default,
}))

import { systemPersona } from "../prompt"
import { renderKnowledge } from "../knowledge"
import { TOOLS } from "../tools"
import { volatileContext } from "../claude"
import { profileFor } from "."
import fixture from "../__fixtures__/knowledge.json"
import type { AgentKnowledge } from "@/sanity/queries/agent/agentKnowledge"
import type { Tenant } from "@/lib/whatsapp/store"

/**
 * DR Web Studio's cached prefix, locked byte for byte.
 *
 * Everything up to the `cache_control` breakpoint — tools, then system[0]
 * (persona), then system[1] (knowledge) — is the prompt cache key. Changing a
 * single byte of it costs a cache WRITE on the next request, which at DR's
 * sparse traffic is the dominant cost of a conversation. Adding a second
 * tenant must not touch any of it, so these snapshots were committed BEFORE
 * the multi-tenant work began and must never be updated as part of it.
 *
 * If one of these fails, the change altered what DR sends to Claude. Fix the
 * change, do not re-record the snapshot — unless DR's prompt is being edited
 * on purpose, in which case that edit belongs in its own commit.
 */

const tenant = {
  tenant_id: "drwebstudio",
  business_name: "DR Web Studio",
  system_prompt: null,
  default_locale: "es",
} as unknown as Tenant

const kb = fixture as unknown as AgentKnowledge

const SNAPSHOTS = "./__snapshots__/drwebstudio"

describe("DR Web Studio cached prefix (golden)", () => {
  it("tools are unchanged", async () => {
    await expect(JSON.stringify(TOOLS, null, 2)).toMatchFileSnapshot(
      `${SNAPSHOTS}/tools.json`,
    )
  })

  it("system[0] persona is unchanged", async () => {
    await expect(systemPersona(tenant)).toMatchFileSnapshot(
      `${SNAPSHOTS}/persona.txt`,
    )
  })

  // run.ts renders exactly one locale per request: "en", otherwise "es".
  it.each(["es", "en"] as const)(
    "system[1] knowledge (%s) is unchanged",
    async lang => {
      await expect(renderKnowledge(kb, lang)).toMatchFileSnapshot(
        `${SNAPSHOTS}/knowledge.${lang}.txt`,
      )
    },
  )
})

/**
 * The same bytes through the path production now takes: tenant row →
 * profileFor → profile. The snapshots above only prove the old functions are
 * unchanged; this proves the refactored request still uses them.
 */
describe("DR Web Studio through the profile registry (golden)", () => {
  const profile = profileFor({ tenant_id: "drwebstudio" })

  it("resolves a row with no agent_profile to DR", () => {
    expect(profile?.id).toBe("drwebstudio")
    expect(
      profileFor({ tenant_id: "drwebstudio", agent_profile: "drwebstudio" }),
    ).toBe(profile)
  })

  it("sends the same tools", async () => {
    await expect(JSON.stringify(profile!.tools, null, 2)).toMatchFileSnapshot(
      `${SNAPSHOTS}/tools.json`,
    )
  })

  it("sends the same persona", async () => {
    await expect(profile!.persona(tenant)).toMatchFileSnapshot(
      `${SNAPSHOTS}/persona.txt`,
    )
  })

  it.each([
    ["es", "es"],
    ["en", "en"],
    // Anything that is not English renders the Spanish block, as before.
    ["fr", "es"],
  ] as const)(
    "sends the same knowledge for locale %s",
    async (locale, file) => {
      const knowledge = await profile!.loadKnowledge()
      await expect(knowledge.block(locale)).toMatchFileSnapshot(
        `${SNAPSHOTS}/knowledge.${file}.txt`,
      )
    },
  )

  it("validates save_lead against the same service keys", async () => {
    const knowledge = await profile!.loadKnowledge()
    expect(knowledge.catalogue.map(c => c.key)).toEqual(
      kb.plannerServices.map(p => p.key),
    )
  })

  it("keeps the volatile system message word for word", () => {
    // Not part of the cached prefix, but it is DR's behaviour. Built here the
    // way claude.ts built it inline before profiles.
    const at = new Date("2026-10-16T16:00:00Z")
    const now = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/Santo_Domingo",
      dateStyle: "full",
      timeStyle: "short",
    }).format(at)
    const RESUMED =
      "This conversation was handled by a person, or paused, and has been quiet for days. You are picking it back up. Greet them again briefly, say plainly that you are the assistant (not James) helping them, and acknowledge the gap before continuing — do not pretend the pause did not happen."

    const base = {
      profile: profile!,
      locale: "es",
      profileName: "Ana",
      conversation: { turn_count: 0, lead_id: null },
    } as unknown as Parameters<typeof volatileContext>[0]

    expect(volatileContext(base, at)).toBe(
      `Current local time in the Dominican Republic: ${now}. Conversation language: es. The customer's WhatsApp name is Ana. This is your FIRST reply in this conversation — introduce yourself as an assistant here. No lead saved yet for this conversation.`,
    )
    expect(volatileContext({ ...base, resumed: true }, at)).toContain(RESUMED)
  })

  it("keeps the escalation result and cap notices", () => {
    expect(profile!.escalatedResult).toBe(
      "Escalated. Tell the customer briefly that James will pick this up, then stop.",
    )
    expect(profile!.capReachedNotice("DR Web Studio", "en")).toBe(
      "Thanks for your message! I can't answer automatically right now, but I've passed it to the DR Web Studio team and someone will get back to you shortly.",
    )
    expect(profile!.capReachedNotice("DR Web Studio", "es")).toBe(
      "¡Gracias por escribirnos! En este momento no puedo responderte automáticamente, pero ya le pasé tu mensaje al equipo de DR Web Studio y te contestan en breve.",
    )
  })

  it("refuses an unknown profile instead of falling back to DR", () => {
    expect(
      profileFor({ tenant_id: "x", agent_profile: "no-such-profile" }),
    ).toBeNull()
  })
})
