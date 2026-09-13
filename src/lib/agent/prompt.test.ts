import { describe, expect, it } from "vitest"
import { systemPersona } from "./prompt"
import type { Tenant } from "@/lib/whatsapp/store"

const tenant = {
  tenant_id: "drwebstudio",
  business_name: "DR Web Studio",
  system_prompt: null,
  default_locale: "es",
} as unknown as Tenant

const prompt = systemPersona(tenant)

describe("systemPersona", () => {
  it("interpolates the business name everywhere", () => {
    expect(prompt).toContain("DR Web Studio")
    expect(prompt).not.toContain("{business}")
  })

  it("forbids calculating a price — the rule that matters most", () => {
    expect(prompt).toMatch(
      /MUST NOT calculate, estimate, total, or guess a price/,
    )
    expect(prompt).toContain("escalate")
    // The published-price carve-out must survive too, or the agent goes mute
    // on the pricing page numbers that are already public.
    expect(prompt).toMatch(/MAY state the published package prices/)
  })

  it("requires AI disclosure on the first reply and honesty if asked", () => {
    expect(prompt).toMatch(/FIRST reply/)
    expect(prompt).toMatch(/Never claim to be a human/)
  })

  it("pins Dominican Spanish, not generic Spanish", () => {
    expect(prompt).toContain('informal "tú"')
    expect(prompt).toContain("vosotros")
    expect(prompt).toMatch(/celular/)
  })

  it("keeps replies WhatsApp-shaped", () => {
    expect(prompt).toMatch(/SHORT/)
    expect(prompt).toMatch(/No markdown headings/)
  })

  it("lets a tenant override the whole persona", () => {
    const custom = systemPersona({
      ...tenant,
      system_prompt: "  Custom prompt.  ",
    } as unknown as Tenant)
    expect(custom).toBe("Custom prompt.")
  })
})
