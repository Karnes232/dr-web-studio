import { beforeEach, describe, expect, it, vi } from "vitest"
import Stripe from "stripe"
import { FakePaymentsDb } from "../../../../../test/fakePaymentsDb"

const SECRET = "whsec_test_secret"
const signer = new Stripe("sk_test_dummy")

const { retrieve, send, holder } = vi.hoisted(() => ({
  retrieve: vi.fn(),
  send: vi.fn(),
  holder: { db: null as unknown },
}))

vi.mock("@/lib/stripe", async () => {
  const S = (await import("stripe")).default
  const real = new S("sk_test_dummy")
  return {
    stripe: {
      webhooks: real.webhooks,
      paymentIntents: { retrieve: (...a: unknown[]) => retrieve(...a) },
    },
  }
})
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: (...a: unknown[]) => send(...a) }
  },
}))
vi.mock("@/lib/supabase/serverClient", () => ({
  getSupabase: () => (holder.db as FakePaymentsDb | null)?.client ?? null,
}))
vi.mock("@/sanity/queries/layout/generalLayout", () => ({
  getContactEmail: async () => null,
  getCompanyInfo: async () => null,
}))

import { POST } from "./route"

function pi(overrides: Record<string, unknown> = {}) {
  return {
    id: "pi_1",
    object: "payment_intent",
    status: "succeeded",
    amount: 5000,
    currency: "usd",
    livemode: false,
    metadata: {
      source: "custom-payment",
      customerName: "Ana Pérez",
      customerEmail: "ana@example.com",
      lang: "es",
    },
    latest_charge: {
      id: "ch_1",
      created: 1_768_489_200,
      receipt_url: "https://pay.stripe.com/receipts/x",
    },
    ...overrides,
  }
}

function eventBody(type = "payment_intent.succeeded", id = "evt_1") {
  return JSON.stringify({
    id,
    object: "event",
    type,
    created: 1_768_489_200,
    data: { object: { id: "pi_1", object: "payment_intent" } },
  })
}

function post(payload: string, signature?: string | null) {
  const headers = new Headers()
  const sig =
    signature === undefined
      ? signer.webhooks.generateTestHeaderString({ payload, secret: SECRET })
      : signature
  if (sig) headers.set("stripe-signature", sig)
  return POST(
    new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: payload,
      headers,
    }) as never,
  )
}

let db: FakePaymentsDb
beforeEach(() => {
  process.env.STRIPE_WEBHOOK_SECRET = SECRET
  retrieve.mockReset()
  retrieve.mockResolvedValue(pi())
  send.mockReset()
  send.mockResolvedValue({ data: { id: "em_1" }, error: null })
  db = new FakePaymentsDb()
  holder.db = db
  vi.spyOn(console, "error").mockImplementation(() => {})
})

describe("POST /api/webhooks/stripe", () => {
  it("rejects a bad signature with 400 and does nothing", async () => {
    const res = await post(eventBody(), "t=1,v1=deadbeef")
    expect(res.status).toBe(400)
    expect(retrieve).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
  })

  it("rejects a missing signature with 400", async () => {
    expect((await post(eventBody(), null)).status).toBe(400)
  })

  it("rejects a body altered after signing", async () => {
    const payload = eventBody()
    const sig = signer.webhooks.generateTestHeaderString({
      payload,
      secret: SECRET,
    })
    expect((await post(payload.replace("pi_1", "pi_2"), sig)).status).toBe(400)
  })

  it("acknowledges other event types without work", async () => {
    const res = await post(eventBody("payment_intent.payment_failed"))
    expect(res.status).toBe(200)
    expect(retrieve).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
  })

  it("ignores a payment this checkout did not create", async () => {
    retrieve.mockResolvedValue(pi({ metadata: {} }))
    const res = await post(eventBody())
    expect(res.status).toBe(200)
    expect(send).not.toHaveBeenCalled()
    expect(db.rows.size).toBe(0)
  })

  it("re-fetches the intent expanding the charge", async () => {
    await post(eventBody())
    expect(retrieve).toHaveBeenCalledWith("pi_1", { expand: ["latest_charge"] })
  })

  it("records the payment and sends the Spanish pair once", async () => {
    const res = await post(eventBody())
    expect(res.status).toBe(200)
    expect(db.rows.get("pi_1")).toMatchObject({
      amount: 5000,
      currency: "usd",
      locale: "es",
      livemode: false,
      last_event_id: "evt_1",
    })
    expect(send).toHaveBeenCalledTimes(2)
    const customer = send.mock.calls.find(
      c => c[0].to[0] === "ana@example.com",
    )!
    expect(customer[0].subject).toBe("Pago confirmado – DR Web Studio")
    expect(customer[0].html).toContain("https://pay.stripe.com/receipts/x")
  })

  it("sends the English subject for an English payment", async () => {
    retrieve.mockResolvedValue(
      pi({ metadata: { ...pi().metadata, lang: "en" } }),
    )
    await post(eventBody())
    const customer = send.mock.calls.find(
      c => c[0].to[0] === "ana@example.com",
    )!
    expect(customer[0].subject).toBe("Payment confirmed – DR Web Studio")
  })

  it("sends nothing new on a duplicate delivery", async () => {
    await post(eventBody())
    const res = await post(eventBody())
    expect(res.status).toBe(200)
    expect(send).toHaveBeenCalledTimes(2)
    // Even a different event id for the same payment (e.g. a resend).
    await post(eventBody("payment_intent.succeeded", "evt_2"))
    expect(send).toHaveBeenCalledTimes(2)
    expect(db.rows.size).toBe(1)
  })

  it("answers 500 with a generic body when the store fails", async () => {
    db.failNext = "upsert"
    const res = await post(eventBody())
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: "processing_failed" })
    expect(send).not.toHaveBeenCalled()
  })

  it("answers 500 when Supabase is not configured", async () => {
    holder.db = null
    expect((await post(eventBody())).status).toBe(500)
    expect(send).not.toHaveBeenCalled()
  })

  it("answers 500 when Resend fails, then a retry sends exactly one pair", async () => {
    send.mockResolvedValue({
      data: null,
      error: { name: "internal_server_error" },
    })
    expect((await post(eventBody())).status).toBe(500)
    expect(db.rows.has("pi_1")).toBe(true)

    // The failed claim is leased for 2 minutes; let it lapse for the retry.
    for (const r of db.rows.values()) {
      r.customer_email_claimed_at = null
      r.owner_email_claimed_at = null
    }
    send.mockReset()
    send.mockResolvedValue({ data: { id: "em_1" }, error: null })
    expect((await post(eventBody())).status).toBe(200)
    expect(send).toHaveBeenCalledTimes(2)
  })

  it("keeps customer details out of the error log", async () => {
    db.failNext = "upsert"
    await post(eventBody())
    const logged = JSON.stringify(
      (console.error as unknown as { mock: { calls: unknown[] } }).mock.calls,
    )
    expect(logged).not.toContain("ana@example.com")
    expect(logged).not.toContain("Ana")
  })
})
