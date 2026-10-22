import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/leads/saveLead", () => ({ saveLead: vi.fn() }))
vi.mock("@/sanity/queries/agent/agentKnowledge", () => ({
  getAgentKnowledge: vi.fn(),
}))

import { anthropicFor, TEAM_NOTE, volatileContext } from "./claude"
import { drwebstudio } from "./profiles/drwebstudio"
import { TEAM_MARKER } from "@/lib/whatsapp/store"

const saved = { ...process.env }
afterEach(() => {
  process.env = { ...saved }
})

describe("anthropicFor", () => {
  it("uses James's key when the tenant brings none", () => {
    process.env.ANTHROPIC_API_KEY = "james-key"
    expect(anthropicFor({ anthropic_api_key_env: null }).apiKey).toBe(
      "james-key",
    )
    // Columns not migrated yet: same thing.
    expect(anthropicFor({}).apiKey).toBe("james-key")
  })

  it("bills a bring-your-own-key tenant to their own key", () => {
    process.env.ANTHROPIC_API_KEY = "james-key"
    process.env.ANTHROPIC_API_KEY_CLIENT = "client-key"
    expect(
      anthropicFor({ anthropic_api_key_env: "ANTHROPIC_API_KEY_CLIENT" })
        .apiKey,
    ).toBe("client-key")
  })

  it("throws rather than silently billing James when their key is missing", () => {
    process.env.ANTHROPIC_API_KEY = "james-key"
    delete process.env.ANTHROPIC_API_KEY_GONE
    expect(() =>
      anthropicFor({ anthropic_api_key_env: "ANTHROPIC_API_KEY_GONE" }),
    ).toThrow(/ANTHROPIC_API_KEY_GONE is not set/)
  })

  it("refuses a variable outside the ANTHROPIC_API_KEY prefix", () => {
    process.env.KAPSO_API_KEY = "kapso"
    expect(() =>
      anthropicFor({ anthropic_api_key_env: "KAPSO_API_KEY" }),
    ).toThrow(/not an allowed name/)
  })

  it("reuses one client per key", () => {
    process.env.ANTHROPIC_API_KEY = "james-key"
    expect(anthropicFor({})).toBe(anthropicFor({ anthropic_api_key_env: null }))
  })
})

describe("volatileContext — a person's messages in the history", () => {
  const base = {
    profile: drwebstudio,
    locale: "es",
    profileName: "Isabel",
    conversation: { turn_count: 5, lead_id: "lead-1" },
  } as unknown as Parameters<typeof volatileContext>[0]

  it("explains the marker when a person wrote part of the history", () => {
    const text = volatileContext({
      ...base,
      history: [
        { role: "user", content: "Hola" },
        { role: "assistant", content: `${TEAM_MARKER}Soy James 👋` },
        { role: "user", content: "Gracias" },
      ],
    })
    expect(text).toContain(TEAM_NOTE)
  })

  it("says nothing about it when only the agent spoke", () => {
    const text = volatileContext({
      ...base,
      history: [
        { role: "user", content: "Hola" },
        { role: "assistant", content: "¡Hola!" },
      ],
    })
    expect(text).not.toContain(TEAM_NOTE)
  })

  it("does not tell a resumed agent how long the pause was", () => {
    // The resume window can be 12 hours; "for days" made it apologise for
    // "la pausa de estos días" the next morning.
    const text = volatileContext({ ...base, resumed: true })
    expect(text).toContain("quiet for a while")
    expect(text).not.toContain("for days")
    expect(text).toContain("call escalate_to_human")
  })
})
