import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/leads/saveLead", () => ({ saveLead: vi.fn() }))

import { anthropicFor } from "./claude"

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
