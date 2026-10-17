import { beforeEach, describe, expect, it, vi } from "vitest"
import { FakePaymentsDb } from "../../../test/fakePaymentsDb"

const holder = vi.hoisted(() => ({ db: null as unknown }))
vi.mock("@/lib/supabase/serverClient", () => ({
  getSupabase: () => (holder.db as FakePaymentsDb | null)?.client ?? null,
}))

import {
  CLAIM_LEASE_MS,
  claimEmail,
  markEmailSent,
  recordSucceeded,
  type PaymentRecord,
} from "./store"

const record: PaymentRecord = {
  paymentIntentId: "pi_1",
  livemode: false,
  amount: 5000,
  currency: "usd",
  customerName: "Ana",
  customerEmail: "ana@example.com",
  locale: "es",
  paidAt: new Date("2026-01-15T15:00:00Z"),
  lastEventId: "evt_1",
}

let db: FakePaymentsDb
beforeEach(() => {
  db = new FakePaymentsDb()
  holder.db = db
})

describe("recordSucceeded", () => {
  it("inserts once and ignores a repeat delivery", async () => {
    await recordSucceeded(record)
    await recordSucceeded({ ...record, lastEventId: "evt_2" })
    expect(db.rows.size).toBe(1)
    expect(db.rows.get("pi_1")?.last_event_id).toBe("evt_1")
    expect(db.rows.get("pi_1")).toMatchObject({
      amount: 5000,
      currency: "usd",
      locale: "es",
      livemode: false,
    })
  })

  it("throws on a database error", async () => {
    db.failNext = "upsert"
    await expect(recordSucceeded(record)).rejects.toThrow()
  })

  it("throws when Supabase is not configured", async () => {
    holder.db = null
    await expect(recordSucceeded(record)).rejects.toThrow(/not configured/)
  })
})

describe("claimEmail", () => {
  const t0 = new Date("2026-01-15T15:00:00Z")

  beforeEach(async () => {
    await recordSucceeded(record)
  })

  it("lets exactly one concurrent delivery win", async () => {
    const [a, b] = await Promise.all([
      claimEmail("pi_1", "customer", t0),
      claimEmail("pi_1", "customer", t0),
    ])
    expect([a, b].sort()).toEqual([false, true])
  })

  it("blocks inside the lease and re-opens after it", async () => {
    expect(await claimEmail("pi_1", "customer", t0)).toBe(true)
    const inside = new Date(t0.getTime() + CLAIM_LEASE_MS - 1000)
    expect(await claimEmail("pi_1", "customer", inside)).toBe(false)
    const after = new Date(t0.getTime() + CLAIM_LEASE_MS + 1000)
    expect(await claimEmail("pi_1", "customer", after)).toBe(true)
  })

  it("never re-opens once sent", async () => {
    await claimEmail("pi_1", "customer", t0)
    await markEmailSent("pi_1", "customer", t0)
    const later = new Date(t0.getTime() + 10 * CLAIM_LEASE_MS)
    expect(await claimEmail("pi_1", "customer", later)).toBe(false)
    expect(db.rows.get("pi_1")?.customer_email_sent_at).toBe(t0.toISOString())
  })

  it("keeps the customer and owner emails independent", async () => {
    expect(await claimEmail("pi_1", "customer", t0)).toBe(true)
    expect(await claimEmail("pi_1", "owner", t0)).toBe(true)
  })

  it("returns false for an unknown payment", async () => {
    expect(await claimEmail("pi_missing", "customer", t0)).toBe(false)
  })

  it("throws on a database error", async () => {
    db.failNext = "update"
    await expect(claimEmail("pi_1", "customer", t0)).rejects.toThrow()
  })
})
