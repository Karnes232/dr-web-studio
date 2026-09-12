import { beforeEach, describe, expect, it, vi } from "vitest"

const single = vi.fn()
const insert = vi.fn()
const from = vi.fn()
const getSupabase = vi.fn()
const sendEmail = vi.fn()

vi.mock("@/lib/supabase/serverClient", () => ({
  getSupabase: () => getSupabase(),
  isSupabaseConfigured: () => Boolean(getSupabase()),
}))

vi.mock("@/sanity/queries/layout/generalLayout", () => ({
  getContactEmail: async () => "james@dr-webstudio.com",
}))

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: (args: unknown) => sendEmail(args) }
  },
}))

import { saveLead } from "./saveLead"

/** Rebuild the `.from().insert().select().single()` chain for each test. */
function mockSupabase(result: { data?: unknown; error?: unknown }) {
  single.mockResolvedValue(result)
  insert.mockReturnValue({ select: () => ({ single }) })
  from.mockReturnValue({ insert })
  getSupabase.mockReturnValue({ from })
}

describe("saveLead", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sendEmail.mockResolvedValue({ data: { id: "email-1" }, error: null })
    mockSupabase({ data: { id: "row-123" }, error: null })
  })

  it("inserts a contact-form lead and returns the row id", async () => {
    const id = await saveLead({
      source: "contact-form",
      name: "Ana",
      email: "ana@example.com",
      phone: "8095551234",
      message: "Necesito un sitio web",
      projectType: "business-website",
      budgetBand: "$600-1000",
      locale: "es",
    })

    expect(id).toBe("row-123")
    expect(from).toHaveBeenCalledWith("leads")

    const row = insert.mock.calls[0][0]
    expect(row.source).toBe("contact-form")
    expect(row.status).toBe("new")
    expect(row.tenant_id).toBe("drwebstudio")
    expect(row.project_type).toBe("business-website")
    expect(row.budget_band).toBe("$600-1000")
    expect(row.locale).toBe("es")
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it("maps references onto reference_urls, since references is reserved SQL", async () => {
    await saveLead({
      source: "project-planner",
      name: "Luis",
      email: "luis@example.com",
      serviceKey: "e-commerce",
      references: ["https://a.com", "https://b.com"],
      rush: true,
    })

    const row = insert.mock.calls[0][0]
    expect(row.reference_urls).toEqual(["https://a.com", "https://b.com"])
    expect(row).not.toHaveProperty("references")
    expect(row.service_key).toBe("e-commerce")
    expect(row.rush).toBe(true)
  })

  it("drops empty strings and empty arrays instead of storing blanks", async () => {
    await saveLead({
      source: "contact-form",
      name: "Ana",
      email: "ana@example.com",
      company: "",
      timeline: "   ",
      addons: [],
    })

    const row = insert.mock.calls[0][0]
    expect(row).not.toHaveProperty("company")
    expect(row).not.toHaveProperty("timeline")
    expect(row).not.toHaveProperty("addons")
  })

  it("stores the estimate as jsonb with a pricing snapshot", async () => {
    await saveLead({
      source: "project-planner",
      name: "Luis",
      email: "luis@example.com",
      estimate: {
        total: 1100,
        currency: "USD",
        currencySymbol: "$",
        items: [{ key: "base", label: "E-commerce", amount: 900 }],
      },
    })

    const row = insert.mock.calls[0][0]
    expect(row.estimate.total).toBe(1100)
    expect(row.estimate.items).toHaveLength(1)
    expect(row.pricing_snapshot_at).toBeTypeOf("string")
  })

  it("omits the estimate entirely when there is no total", async () => {
    await saveLead({
      source: "whatsapp",
      name: "Sin precio",
      email: "x@example.com",
    })

    const row = insert.mock.calls[0][0]
    expect(row).not.toHaveProperty("estimate")
    expect(row).not.toHaveProperty("pricing_snapshot_at")
  })

  it("emails the payload when the insert errors, and never throws", async () => {
    // What a paused free-tier project looks like: an error in the payload.
    mockSupabase({ data: null, error: { message: "Project is paused" } })

    const id = await saveLead({
      source: "contact-form",
      name: "Ana",
      email: "ana@example.com",
    })

    expect(id).toBeNull()
    expect(sendEmail).toHaveBeenCalledTimes(1)
    const sent = sendEmail.mock.calls[0][0]
    expect(sent.subject).toContain("Lead not saved")
    expect(sent.text).toContain("Project is paused")
    expect(sent.text).toContain("ana@example.com")
  })

  it("emails the payload when the client throws outright", async () => {
    getSupabase.mockReturnValue({
      from: () => {
        throw new Error("network unreachable")
      },
    })

    await expect(
      saveLead({ source: "contact-form", name: "Ana", email: "a@b.com" }),
    ).resolves.toBeNull()
    expect(sendEmail).toHaveBeenCalledTimes(1)
    expect(sendEmail.mock.calls[0][0].text).toContain("network unreachable")
  })

  it("emails the payload when Supabase is not configured at all", async () => {
    getSupabase.mockReturnValue(null)

    const id = await saveLead({
      source: "contact-form",
      name: "Ana",
      email: "a@b.com",
    })

    expect(id).toBeNull()
    expect(sendEmail).toHaveBeenCalledTimes(1)
    expect(sendEmail.mock.calls[0][0].text).toContain("not configured")
  })

  it("still resolves null when even the fallback email fails", async () => {
    mockSupabase({ data: null, error: { message: "boom" } })
    sendEmail.mockRejectedValue(new Error("resend down"))

    await expect(
      saveLead({ source: "whatsapp", name: "Ana" }),
    ).resolves.toBeNull()
  })
})
