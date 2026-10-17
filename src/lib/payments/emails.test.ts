import { beforeEach, describe, expect, it, vi } from "vitest"
import { FakePaymentsDb } from "../../../test/fakePaymentsDb"

const { send, holder } = vi.hoisted(() => ({
  send: vi.fn(),
  holder: { db: null as unknown },
}))

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: (...a: unknown[]) => send(...a) }
  },
}))
vi.mock("@/lib/supabase/serverClient", () => ({
  getSupabase: () => (holder.db as FakePaymentsDb | null)?.client ?? null,
}))
vi.mock("@/sanity/queries/layout/generalLayout", () => ({
  getContactEmail: async () => "ayuda@dr-webstudio.com",
  getCompanyInfo: async () => ({ whatsapp: "+1 809 555 0100" }),
}))

import { sendPaymentEmails, type PaymentEmailInput } from "./emails"
import { CLAIM_LEASE_MS, recordSucceeded } from "./store"

const input: PaymentEmailInput = {
  paymentIntentId: "pi_1",
  amount: 12500,
  currency: "usd",
  customerName: "Ana Pérez",
  customerEmail: "ana@example.com",
  locale: "es",
  paidAt: new Date("2026-01-15T15:00:00Z"),
  receiptUrl: "https://pay.stripe.com/receipts/abc",
}

let db: FakePaymentsDb
beforeEach(async () => {
  send.mockReset()
  send.mockResolvedValue({ data: { id: "em_1" }, error: null })
  db = new FakePaymentsDb()
  holder.db = db
  await recordSucceeded({
    paymentIntentId: "pi_1",
    livemode: false,
    amount: 12500,
    currency: "usd",
    customerName: "Ana Pérez",
    customerEmail: "ana@example.com",
    locale: "es",
    paidAt: input.paidAt,
    lastEventId: "evt_1",
  })
})

const call = (to: string) =>
  send.mock.calls.find(c => (c[0].to as string[]).includes(to))!

describe("sendPaymentEmails", () => {
  it("sends the customer a Spanish email with a reply-to, text fallback and idempotency key", async () => {
    await sendPaymentEmails(input)
    const [msg, opts] = call("ana@example.com")
    expect(msg.subject).toBe("Pago confirmado – DR Web Studio")
    expect(msg.to).toEqual(["ana@example.com"])
    expect(msg.replyTo).toBe("ayuda@dr-webstudio.com")
    expect(msg.from).toContain("james@dr-webstudio.com")
    expect(msg.html).toContain("$125.00")
    expect(msg.html).toContain("pi_1")
    expect(msg.text).toContain("pi_1")
    expect(opts).toEqual({ idempotencyKey: "payment/pi_1/customer" })
  })

  it("uses the English subject for an English customer", async () => {
    await sendPaymentEmails({ ...input, locale: "en" })
    expect(call("ana@example.com")[0].subject).toBe(
      "Payment confirmed – DR Web Studio",
    )
  })

  it("notifies the owner once, without the customer as a recipient", async () => {
    await sendPaymentEmails(input)
    const [msg, opts] = call("james@dr-webstudio.com")
    expect(msg.subject).toBe("Payment received: $125.00 from Ana Pérez")
    expect(msg.to).toEqual(["james@dr-webstudio.com"])
    expect(opts).toEqual({ idempotencyKey: "payment/pi_1/owner" })
    expect(send).toHaveBeenCalledTimes(2)
  })

  it("marks sent only after Resend accepts, and a repeat sends nothing", async () => {
    await sendPaymentEmails(input)
    const row = db.rows.get("pi_1")!
    expect(row.customer_email_sent_at).toBeTruthy()
    expect(row.owner_email_sent_at).toBeTruthy()
    await sendPaymentEmails(input)
    expect(send).toHaveBeenCalledTimes(2)
  })

  it("throws on a Resend error and leaves the email unsent", async () => {
    send.mockResolvedValue({
      data: null,
      error: { name: "rate_limit_exceeded" },
    })
    await expect(sendPaymentEmails(input)).rejects.toThrow(/Resend/)
    const row = db.rows.get("pi_1")!
    expect(row.customer_email_sent_at).toBeNull()
    expect(row.customer_email_claimed_at).toBeTruthy()
  })

  it("retries only the failed owner email, and only after the lease lapses", async () => {
    // The customer email goes out, then the owner's fails.
    send.mockResolvedValueOnce({ data: { id: "em_1" }, error: null })
    send.mockResolvedValueOnce({
      data: null,
      error: { name: "internal_server_error" },
    })
    await expect(sendPaymentEmails(input)).rejects.toThrow()
    expect(db.rows.get("pi_1")!.customer_email_sent_at).toBeTruthy()

    // Immediately retrying is blocked by the owner lease: no duplicate send.
    send.mockResolvedValue({ data: { id: "em_2" }, error: null })
    await sendPaymentEmails(input)
    expect(send).toHaveBeenCalledTimes(2)

    // Once the lease lapses the owner email is retried; the customer's never.
    vi.useFakeTimers()
    vi.setSystemTime(Date.now() + CLAIM_LEASE_MS + 5000)
    try {
      await sendPaymentEmails(input)
    } finally {
      vi.useRealTimers()
    }
    expect(send).toHaveBeenCalledTimes(3)
    expect(send.mock.calls[2][1]).toEqual({
      idempotencyKey: "payment/pi_1/owner",
    })
  })
})
