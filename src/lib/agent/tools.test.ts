import { beforeEach, describe, expect, it, vi } from "vitest"

const saveLeadMock = vi.fn()
vi.mock("@/lib/leads/saveLead", () => ({
  saveLead: (input: unknown) => saveLeadMock(input),
}))

import { TOOLS, runTool, cleanToolString, type ToolContext } from "./tools"
import fixture from "./__fixtures__/knowledge.json"
import type { AgentKnowledge } from "@/sanity/queries/agent/agentKnowledge"

const ctx = {
  tenant: { tenant_id: "drwebstudio" },
  conversation: { id: "conv-1" },
  knowledge: fixture as unknown as AgentKnowledge,
  waId: "18295551234",
  profileName: "Ana Gomez",
  locale: "es",
} as unknown as ToolContext

describe("tool schemas", () => {
  it("has only the tools that earn their cost", () => {
    expect(TOOLS.map(t => t.name).sort()).toEqual([
      "escalate_to_human",
      "save_lead",
    ])
    // Quoting is deliberately out of scope: a custom-price question escalates.
    expect(TOOLS.map(t => t.name)).not.toContain("compute_quote")
    // list_services was removed after measurement — every tool call costs a
    // second Claude request that re-sends the whole cached prefix, and the
    // knowledge base already carries the same catalogue.
    expect(TOOLS.map(t => t.name)).not.toContain("list_services")
  })

  it("is strict, closed, and fully required — so handlers can trust inputs", () => {
    for (const tool of TOOLS) {
      expect(tool.strict, `${tool.name} strict`).toBe(true)
      const schema = tool.input_schema as {
        properties?: Record<string, unknown>
        required?: string[]
        additionalProperties?: boolean
      }
      expect(schema.additionalProperties, `${tool.name}`).toBe(false)
      // strict mode requires every property to be listed in `required`.
      expect(
        (schema.required ?? []).sort(),
        `${tool.name} required must cover all properties`,
      ).toEqual(Object.keys(schema.properties ?? {}).sort())
    }
  })
})

describe("runTool", () => {
  beforeEach(() => {
    saveLeadMock.mockReset()
    saveLeadMock.mockResolvedValue("lead-1")
  })

  it("save_lead reuses the shared helper with the WhatsApp source and phone", async () => {
    await runTool(
      "save_lead",
      {
        name: "Ana Gomez",
        company: "Tienda Ana",
        email: "",
        service_key: "e-commerce",
        project_type: "tienda online",
        timeline: "1 mes",
        notes: "quiere pagos con tarjeta",
      },
      ctx,
    )

    const arg = saveLeadMock.mock.calls[0][0]
    expect(arg.source).toBe("whatsapp")
    expect(arg.tenantId).toBe("drwebstudio")
    expect(arg.phone).toBe("18295551234")
    expect(arg.serviceKey).toBe("e-commerce")
    expect(arg.locale).toBe("es")
    // Empty strings must not be stored as blanks.
    expect(arg.email).toBeUndefined()
  })

  it("save_lead falls back to the WhatsApp profile name when none is given", async () => {
    await runTool(
      "save_lead",
      {
        name: "",
        company: "",
        email: "",
        service_key: "",
        project_type: "web",
        timeline: "",
        notes: "",
      },
      ctx,
    )
    expect(saveLeadMock.mock.calls[0][0].name).toBe("Ana Gomez")
  })

  it("save_lead tells the model to carry on when the write fails", async () => {
    saveLeadMock.mockResolvedValue(null)
    const out = await runTool(
      "save_lead",
      {
        name: "Ana",
        company: "",
        email: "",
        service_key: "",
        project_type: "web",
        timeline: "",
        notes: "",
      },
      ctx,
    )
    expect(out.result).toContain("emailed")
    expect(out.result).toMatch(/Continue the conversation/)
  })

  it("escalate_to_human signals the handoff to the caller", async () => {
    const out = await runTool(
      "escalate_to_human",
      { reason: "asked for a custom quote", urgency: "normal" },
      ctx,
    )
    expect(out.escalated).toEqual({
      reason: "asked for a custom quote",
      urgency: "normal",
    })
  })

  it("does not throw on an unknown tool name", async () => {
    const out = await runTool("nope", {}, ctx)
    expect(out.result).toContain("Unknown tool")
  })
})

describe("cleanToolString", () => {
  // Every one of these was captured verbatim from a real stored lead row.
  // The separator after "antml" is NOT an ASCII colon in any of them.
  it.each([
    ["</antml\u0903parameter>", ""],
    [
      "</antml\u061bparameter> Sitio web para barbería",
      "Sitio web para barbería",
    ],
    ['</antml":parameter>', ""],
    [
      '</parameter>\n<parameter name="notes">Centro de buceo.',
      "Centro de buceo.",
    ],
    ["</antml\u0903parameter> landing-pages", "landing-pages"],
  ])("scrubs %j", (input, expected) => {
    const out = cleanToolString(input)
    expect(out ?? "").toBe(expected)
    expect(out ?? "").not.toMatch(/antml/i)
    expect(out ?? "").not.toMatch(/<\/?parameter/i)
  })

  it("leaves ordinary text alone", () => {
    expect(cleanToolString("Antes de diciembre 2026")).toBe(
      "Antes de diciembre 2026",
    )
    expect(cleanToolString("ana@example.com")).toBe("ana@example.com")
  })

  it("returns undefined for blanks and non-strings", () => {
    expect(cleanToolString("")).toBeUndefined()
    expect(cleanToolString("   ")).toBeUndefined()
    expect(cleanToolString(undefined)).toBeUndefined()
    expect(cleanToolString(42)).toBeUndefined()
    expect(cleanToolString("</antml\u0903parameter>")).toBeUndefined()
  })
})

describe("save_lead rejects values that are not what the field is for", () => {
  beforeEach(() => {
    saveLeadMock.mockReset()
    saveLeadMock.mockResolvedValue("lead-1")
  })

  const base = {
    name: "Ana",
    company: "",
    email: "",
    service_key: "",
    project_type: "sitio",
    timeline: "",
    notes: "",
  }

  it("drops a non-email from the email field", async () => {
    // Captured verbatim: strict mode forces an email argument, and a real turn
    // filled it with the service key.
    await runTool(
      "save_lead",
      { ...base, email: "multilingual-and-international-websites" },
      ctx,
    )
    expect(saveLeadMock.mock.calls[0][0].email).toBeUndefined()
  })

  it("keeps a real email", async () => {
    await runTool("save_lead", { ...base, email: "ana@example.com" }, ctx)
    expect(saveLeadMock.mock.calls[0][0].email).toBe("ana@example.com")
  })

  it("keeps a service key that exists in the catalogue", async () => {
    const real = ctx.knowledge.plannerServices[0].key
    await runTool("save_lead", { ...base, service_key: real }, ctx)
    expect(saveLeadMock.mock.calls[0][0].serviceKey).toBe(real)
  })

  it("drops an invented service key rather than storing a slug that means nothing", async () => {
    await runTool(
      "save_lead",
      { ...base, service_key: "super-deluxe-website" },
      ctx,
    )
    expect(saveLeadMock.mock.calls[0][0].serviceKey).toBeUndefined()
  })
})

describe("save_lead stays one lead per conversation", () => {
  beforeEach(() => {
    saveLeadMock.mockReset()
    saveLeadMock.mockResolvedValue("lead-1")
  })

  const args = {
    name: "Ana",
    company: "",
    email: "",
    service_key: "e-commerce",
    project_type: "tienda",
    timeline: "",
    notes: "",
  }

  it("always scopes the lead to the conversation", async () => {
    await runTool("save_lead", args, ctx)
    // Dedupe is a unique index on leads.conversation_id — not app state that
    // two calls in the same turn can both read stale.
    expect(saveLeadMock.mock.calls[0][0].conversationId).toBe("conv-1")
  })

  it("passes the same conversation id however many times it is called", async () => {
    await runTool("save_lead", args, ctx)
    await runTool("save_lead", args, ctx)
    await runTool("save_lead", args, ctx)
    const ids = saveLeadMock.mock.calls.map(c => c[0].conversationId)
    expect(ids).toEqual(["conv-1", "conv-1", "conv-1"])
  })

  it("tells the model to stop calling it", async () => {
    const out = await runTool("save_lead", args, ctx)
    expect(out.result).toMatch(/Do not call save_lead again/)
  })
})
