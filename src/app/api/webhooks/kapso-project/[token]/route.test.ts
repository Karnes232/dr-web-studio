import { readFileSync } from "node:fs"
import path from "node:path"
import { createHmac } from "node:crypto"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { store, sendConnectionAlert } = vi.hoisted(() => ({
  store: {
    claimDelivery: vi.fn(),
    findTenantByPhoneNumberId: vi.fn(),
  },
  sendConnectionAlert: vi.fn(),
}))

vi.mock("@/lib/whatsapp/store", () => store)
vi.mock("@/lib/agent/alerts", () => ({
  sendConnectionAlert: (...a: unknown[]) => sendConnectionAlert(...a),
}))

import { POST } from "./route"
import { NextRequest } from "next/server"

const TOKEN = "test-token"
const GB_SECRET = "grandbay-generated-secret"
const DR_SECRET = "dr-generated-secret"

// From Kapso's docs — no real disconnect has happened yet.
const disconnected = readFileSync(
  path.join(
    process.cwd(),
    "src/lib/whatsapp/__fixtures__/project-disconnected.docs.json",
  ),
  "utf8",
)

const sign = (raw: string, secret: string) =>
  createHmac("sha256", secret).update(raw).digest("hex")

function deliver(raw: string, secret: string, event?: string) {
  return POST(
    new NextRequest(
      `https://example.test/api/webhooks/kapso-project/${TOKEN}`,
      {
        method: "POST",
        body: raw,
        headers: {
          "content-type": "application/json",
          "x-webhook-signature": sign(raw, secret),
          ...(event ? { "x-webhook-event": event } : {}),
        },
      },
    ),
    { params: Promise.resolve({ token: TOKEN }) },
  )
}

const saved = { ...process.env }
beforeEach(() => {
  process.env.WHATSAPP_WEBHOOK_TOKEN = TOKEN
  process.env.KAPSO_PROJECT_WEBHOOK_SECRET_GRANDBAY = GB_SECRET
  process.env.KAPSO_PROJECT_WEBHOOK_SECRET = DR_SECRET
  store.claimDelivery.mockReset().mockResolvedValue(true)
  store.findTenantByPhoneNumberId.mockReset().mockResolvedValue({
    tenant_id: "grandbay",
    active: true,
    kapso_project_secret_env: "KAPSO_PROJECT_WEBHOOK_SECRET_GRANDBAY",
  })
  sendConnectionAlert.mockReset()
})
afterEach(() => {
  process.env = { ...saved }
})

describe("Kapso project webhook", () => {
  it("alerts on a disconnect signed with the tenant's own secret", async () => {
    const res = await deliver(disconnected, GB_SECRET)
    expect(res.status).toBe(200)
    expect(sendConnectionAlert).toHaveBeenCalledTimes(1)
    const [, event] = sendConnectionAlert.mock.calls[0]
    expect(event).toMatchObject({
      event: "disconnected",
      phoneNumberId: "123456789012345",
      reason: "primary_inactivity",
      initiatedBy: "system",
      sourceEvent: "PARTNER_REMOVED",
    })
  })

  it("rejects another tenant's secret for this number", async () => {
    // DR's Kapso account must not be able to raise alerts about Grand Bay.
    const res = await deliver(disconnected, DR_SECRET)
    expect(res.status).toBe(401)
    expect(sendConnectionAlert).not.toHaveBeenCalled()
  })

  it("rejects a signature no configured secret made", async () => {
    const res = await deliver(disconnected, "nobody")
    expect(res.status).toBe(401)
    expect(store.findTenantByPhoneNumberId).not.toHaveBeenCalled()
  })

  it("rejects a bad path token", async () => {
    const res = await POST(
      new NextRequest("https://example.test/x", { method: "POST", body: "{}" }),
      { params: Promise.resolve({ token: "wrong" }) },
    )
    expect(res.status).toBe(404)
  })

  it("emails once per event, not per redelivery", async () => {
    store.claimDelivery.mockResolvedValueOnce(true).mockResolvedValueOnce(false)
    await deliver(disconnected, GB_SECRET)
    await deliver(disconnected, GB_SECRET)
    expect(sendConnectionAlert).toHaveBeenCalledTimes(1)
    expect(store.claimDelivery.mock.calls[0][0]).toBe(
      "conn:wae_9f2c1d7b8a4e3f5069c1b2a3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f607",
    )
  })

  it("acknowledges and ignores events it does not handle", async () => {
    const raw = JSON.stringify({
      event: "whatsapp.something.else",
      phone_number_id: "1",
    })
    const res = await deliver(raw, GB_SECRET)
    expect(res.status).toBe(200)
    expect(sendConnectionAlert).not.toHaveBeenCalled()
  })

  it("acknowledges a number that belongs to no tenant", async () => {
    store.findTenantByPhoneNumberId.mockResolvedValue(null)
    const res = await deliver(disconnected, GB_SECRET)
    expect(res.status).toBe(200)
    expect(sendConnectionAlert).not.toHaveBeenCalled()
  })

  it("reads the event from the payload or the header", async () => {
    const body = JSON.parse(disconnected)
    delete body.event
    const raw = JSON.stringify(body)
    await deliver(raw, GB_SECRET, "whatsapp.phone_number.reconnected")
    expect(sendConnectionAlert.mock.calls[0][1].event).toBe("reconnected")
  })
})
