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
  it("strips tool-call markup the model leaked into an argument", () => {
    // Taken verbatim from a real turn: this was stored as a `timeline` value.
    const leaked =
      '</parameter>\n<parameter name="notes">Centro de buceo. Quiere sitio informativo.'
    const out = cleanToolString(leaked)
    expect(out).not.toContain("<parameter")
    expect(out).not.toContain("</parameter>")
    expect(out).toContain("Centro de buceo")
  })

  it("leaves ordinary text alone", () => {
    expect(cleanToolString("Antes de diciembre 2026")).toBe(
      "Antes de diciembre 2026",
    )
  })

  it("returns undefined for blanks and non-strings", () => {
    expect(cleanToolString("")).toBeUndefined()
    expect(cleanToolString("   ")).toBeUndefined()
    expect(cleanToolString(undefined)).toBeUndefined()
    expect(cleanToolString(42)).toBeUndefined()
    // Markup-only input must not survive as an empty-ish string.
    expect(cleanToolString("</parameter>")).toBeUndefined()
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

  it("inserts and reports the new id when the conversation has no lead yet", async () => {
    const out = await runTool("save_lead", args, ctx)
    expect(saveLeadMock.mock.calls[0][0].leadId).toBeUndefined()
    expect(out.leadId).toBe("lead-1")
  })

  it("updates the existing lead instead of inserting a second one", async () => {
    const withLead = {
      ...ctx,
      conversation: { ...ctx.conversation, lead_id: "lead-1" },
    } as unknown as ToolContext

    const out = await runTool("save_lead", args, withLead)

    // The whole point: a 9-turn conversation produced six duplicate rows before.
    expect(saveLeadMock.mock.calls[0][0].leadId).toBe("lead-1")
    expect(out.leadId).toBeUndefined()
  })

  it("tells the model to stop calling it", async () => {
    const out = await runTool("save_lead", args, ctx)
    expect(out.result).toMatch(/Do not call save_lead again/)
  })
})
