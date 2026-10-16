import { afterEach, describe, expect, it } from "vitest"
import { tenantSecret } from "./tenantEnv"

const saved = { ...process.env }
afterEach(() => {
  process.env = { ...saved }
})

describe("tenantSecret", () => {
  it("uses the default variable when the row names none", () => {
    process.env.KAPSO_API_KEY = "dr-key"
    expect(tenantSecret(null, "KAPSO_API_KEY")).toEqual({
      ok: true,
      name: "KAPSO_API_KEY",
      value: "dr-key",
    })
    expect(tenantSecret(undefined, "KAPSO_API_KEY").ok).toBe(true)
  })

  it("uses the named variable", () => {
    process.env.KAPSO_API_KEY = "dr-key"
    process.env.KAPSO_API_KEY_GRANDBAY = "gb-key\n"
    const s = tenantSecret("KAPSO_API_KEY_GRANDBAY", "KAPSO_API_KEY")
    expect(s).toEqual({
      ok: true,
      name: "KAPSO_API_KEY_GRANDBAY",
      value: "gb-key",
    })
  })

  it("fails closed when the named variable is unset — never borrows the default", () => {
    process.env.KAPSO_API_KEY = "dr-key"
    delete process.env.KAPSO_API_KEY_GRANDBAY
    const s = tenantSecret("KAPSO_API_KEY_GRANDBAY", "KAPSO_API_KEY")
    expect(s.ok).toBe(false)
    expect(JSON.stringify(s)).not.toContain("dr-key")
  })

  it("refuses a name outside the allowed prefix", () => {
    process.env.SUPABASE_SECRET_KEY = "db-secret"
    const s = tenantSecret("SUPABASE_SECRET_KEY", "KAPSO_API_KEY")
    expect(s.ok).toBe(false)
    expect(JSON.stringify(s)).not.toContain("db-secret")
    // Lowercase suffixes and look-alike prefixes too.
    expect(tenantSecret("KAPSO_API_KEY_gb", "KAPSO_API_KEY").ok).toBe(false)
    expect(tenantSecret("KAPSO_API_KEYS", "KAPSO_API_KEY").ok).toBe(false)
    expect(tenantSecret("ANTHROPIC_API_KEY", "KAPSO_API_KEY").ok).toBe(false)
  })

  it("fails closed when the default itself is unset", () => {
    delete process.env.ANTHROPIC_API_KEY
    expect(tenantSecret(null, "ANTHROPIC_API_KEY").ok).toBe(false)
  })
})
