import { beforeEach, describe, expect, it, vi } from "vitest"

const { send, bump, record } = vi.hoisted(() => ({
  send: vi.fn(),
  bump: vi.fn(),
  record: vi.fn(),
}))

vi.mock("resend", () => ({
  Resend: class {
    emails = { send }
  },
}))
vi.mock("@/lib/whatsapp/store", () => ({
  bumpKapsoMeter: bump,
  recordSendResult: record,
}))

import {
  alertRecipients,
  countKapsoMessage,
  noteSendResult,
  OPS_EMAIL,
} from "./alerts"
import { WINDOW_EXPIRED } from "@/lib/whatsapp/send"
import type { Tenant } from "@/lib/whatsapp/store"

const tenant = {
  tenant_id: "grandbay",
  business_name: "Grand Bay of the Sea",
  escalation_email: "info@grandbay.example",
  send_failures: 0,
  paused_until: null,
} as unknown as Tenant

beforeEach(() => {
  send.mockReset()
  bump.mockReset()
  record.mockReset()
})

describe("alertRecipients", () => {
  it("always includes the operator, plus the tenant", () => {
    expect(alertRecipients(tenant)).toEqual([
      OPS_EMAIL,
      "info@grandbay.example",
    ])
  })

  it("does not send James two copies when he is the escalation address", () => {
    expect(alertRecipients({ escalation_email: OPS_EMAIL })).toEqual([
      OPS_EMAIL,
    ])
  })

  it("still reaches the operator when the tenant has no address", () => {
    expect(alertRecipients({ escalation_email: null })).toEqual([OPS_EMAIL])
  })
})

describe("countKapsoMessage", () => {
  it("emails only on the increment that crosses 80%", async () => {
    bump.mockResolvedValueOnce({
      messages: 1599,
      allowance: 2000,
      crossed: false,
    })
    bump.mockResolvedValueOnce({
      messages: 1600,
      allowance: 2000,
      crossed: true,
    })
    bump.mockResolvedValueOnce({
      messages: 1601,
      allowance: 2000,
      crossed: false,
    })
    await countKapsoMessage(tenant)
    await countKapsoMessage(tenant)
    await countKapsoMessage(tenant)
    expect(send).toHaveBeenCalledTimes(1)
    expect(send.mock.calls[0][0].text).toContain("1600 of 2000")
  })

  it("is silent for a tenant with no allowance", async () => {
    bump.mockResolvedValue(null)
    await countKapsoMessage(tenant)
    expect(send).not.toHaveBeenCalled()
  })

  it("never throws into the webhook", async () => {
    bump.mockRejectedValue(new Error("db down"))
    await expect(countKapsoMessage(tenant)).resolves.toBeUndefined()
  })
})

describe("noteSendResult", () => {
  const failure = {
    ok: false as const,
    errorMessage: "HTTP 402",
    httpStatus: 402,
    rawBody: "Insufficient credits or free messages",
  }

  it("skips the database on a healthy success", async () => {
    await noteSendResult(tenant, { ok: true, messageId: "wamid.1" })
    expect(record).not.toHaveBeenCalled()
  })

  it("clears a streak on success", async () => {
    record.mockResolvedValue({
      failures: 0,
      paused_until: null,
      tripped: false,
    })
    await noteSendResult(
      { ...tenant, send_failures: 2 },
      { ok: true, messageId: "wamid.1" },
    )
    expect(record).toHaveBeenCalledWith(expect.anything(), true)
    expect(send).not.toHaveBeenCalled()
  })

  it("ignores window-expired failures entirely", async () => {
    await noteSendResult(tenant, {
      ok: false,
      errorCode: WINDOW_EXPIRED,
      errorMessage: "window",
    })
    expect(record).not.toHaveBeenCalled()
  })

  it("alerts once, with the raw response, when the breaker trips", async () => {
    record.mockResolvedValueOnce({
      failures: 2,
      paused_until: null,
      tripped: false,
    })
    record.mockResolvedValueOnce({
      failures: 3,
      paused_until: "2026-10-16T18:00:00Z",
      tripped: true,
    })
    record.mockResolvedValueOnce({
      failures: 4,
      paused_until: "2026-10-16T19:00:00Z",
      tripped: false,
    })
    await noteSendResult(tenant, failure)
    await noteSendResult(tenant, failure)
    await noteSendResult(tenant, failure)
    expect(send).toHaveBeenCalledTimes(1)
    const text: string = send.mock.calls[0][0].text
    expect(text).toContain("Insufficient credits or free messages")
    expect(text).toContain("HTTP status: 402")
    expect(send.mock.calls[0][0].to).toEqual([
      OPS_EMAIL,
      "info@grandbay.example",
    ])
  })
})
