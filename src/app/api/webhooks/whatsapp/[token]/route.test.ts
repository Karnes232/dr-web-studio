import { readFileSync } from "node:fs"
import path from "node:path"
import { createHmac } from "node:crypto"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

/**
 * The webhook route end to end, with the database and the agent mocked.
 *
 * What is under test is the routing: which webhook leads to a reply, which
 * stands the agent down, and which is stored but left alone. The coexistence
 * cases matter most — on a number staff also answer from their phones, a
 * misrouted echo means the agent talks over a person, or answers one.
 */

const { pending, runAgent, countKapsoMessage, store } = vi.hoisted(() => ({
  pending: [] as Promise<unknown>[],
  runAgent: vi.fn(),
  countKapsoMessage: vi.fn(),
  store: {
    applyStatus: vi.fn(),
    claimDelivery: vi.fn(),
    createHandedOffConversation: vi.fn(),
    findConversation: vi.fn(),
    haveSentMessage: vi.fn(),
    recordHumanOutbound: vi.fn(),
    recordInbound: vi.fn(),
    resolveTenant: vi.fn(),
    upsertConversation: vi.fn(),
  },
}))

vi.mock("next/server", async importOriginal => {
  const actual = await importOriginal<typeof import("next/server")>()
  return {
    ...actual,
    // Run the deferred work now and let the test await it.
    after: (fn: () => unknown) => {
      pending.push(Promise.resolve().then(fn))
    },
  }
})

vi.mock("@/lib/agent/run", () => ({
  runAgent: (...args: unknown[]) => runAgent(...args),
}))

vi.mock("@/lib/agent/alerts", () => ({
  countKapsoMessage: (...args: unknown[]) => countKapsoMessage(...args),
}))

vi.mock("@/lib/whatsapp/store", async importOriginal => {
  const actual = await importOriginal<typeof import("@/lib/whatsapp/store")>()
  return {
    ...actual,
    ...store,
    // The real decision logic, minus the database write on reactivation.
    claimTurn: async (
      conversation: Parameters<typeof actual.turnDecision>[0],
      now: Date,
      window: number | null,
    ) => {
      const d = actual.turnDecision(conversation, now, window)
      return { allowed: d.allowed, resumed: d.resumed }
    },
  }
})

import { POST } from "./route"
import { NextRequest } from "next/server"

const SECRET = "test-webhook-secret"
const TOKEN = "test-token"

const fixture = (name: string) =>
  readFileSync(
    path.join(process.cwd(), "src/lib/whatsapp/__fixtures__", name),
    "utf8",
  )

function deliver(raw: string, event: string, idempotencyKey?: string) {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-webhook-signature": createHmac("sha256", SECRET)
      .update(raw)
      .digest("hex"),
    "x-webhook-event": event,
  }
  if (idempotencyKey) headers["x-idempotency-key"] = idempotencyKey
  return POST(
    new NextRequest(`https://example.test/api/webhooks/whatsapp/${TOKEN}`, {
      method: "POST",
      body: raw,
      headers,
    }),
    { params: Promise.resolve({ token: TOKEN }) },
  )
}

async function settle() {
  while (pending.length) await pending.shift()
}

/** Re-stamp a fixture's timestamp so it is not stale. */
function fresh(raw: string, secondsAgo = 5): string {
  const body = JSON.parse(raw)
  body.message.timestamp = String(Math.floor(Date.now() / 1000) - secondsAgo)
  return JSON.stringify(body)
}

const grandbay = {
  tenant_id: "grandbay",
  phone_number_id: "900000000000001",
  resume_after_hours: null,
}

const conversation = (over: Record<string, unknown> = {}) => ({
  id: "conv-1",
  tenant_id: "grandbay",
  wa_id: "18295551234",
  status: "active",
  last_outbound_at: null,
  turn_count: 0,
  lead_id: null,
  ...over,
})

beforeEach(() => {
  process.env.KAPSO_WEBHOOK_SECRET = SECRET
  process.env.WHATSAPP_WEBHOOK_TOKEN = TOKEN
  for (const fn of Object.values(store)) fn.mockReset()
  runAgent.mockReset()
  countKapsoMessage.mockReset()
  store.claimDelivery.mockResolvedValue(true)
  store.resolveTenant.mockResolvedValue(grandbay)
  store.recordInbound.mockResolvedValue(true)
  store.haveSentMessage.mockResolvedValue(false)
})

afterEach(() => {
  vi.useRealTimers()
})

describe("Business App echo (coexistence)", () => {
  const echo = () => fresh(fixture("business-app-echo.synthetic.json"))

  it("stands the agent down at once, with no takeover pause", async () => {
    store.findConversation.mockResolvedValue(conversation())

    const res = await deliver(echo(), "whatsapp.message.received")
    expect(res.status).toBe(200)
    await settle()

    // Definitive: never checked against our own sends, never delayed.
    expect(store.haveSentMessage).not.toHaveBeenCalled()
    expect(store.recordHumanOutbound).toHaveBeenCalledTimes(1)
    const [, conv, message] = store.recordHumanOutbound.mock.calls[0]
    expect(conv.id).toBe("conv-1")
    expect(message.waId).toBe("18295551234")
    expect(runAgent).not.toHaveBeenCalled()
  })

  it("stands down even if the agent replied seconds ago", async () => {
    // The RECENT_SEND guard exists for inbox replies we might have sent
    // ourselves. An app message cannot be ours.
    store.findConversation.mockResolvedValue(
      conversation({ last_outbound_at: new Date().toISOString() }),
    )
    await deliver(echo(), "whatsapp.message.received")
    await settle()
    expect(store.recordHumanOutbound).toHaveBeenCalledTimes(1)
  })

  it("creates a staff-started chat already handed off", async () => {
    store.findConversation.mockResolvedValue(null)
    store.createHandedOffConversation.mockResolvedValue(
      conversation({ status: "handed-off" }),
    )

    await deliver(echo(), "whatsapp.message.received")
    await settle()

    expect(store.createHandedOffConversation).toHaveBeenCalledTimes(1)
    expect(store.createHandedOffConversation.mock.calls[0][1].waId).toBe(
      "18295551234",
    )
    expect(store.recordHumanOutbound).toHaveBeenCalledTimes(1)
  })

  it("then leaves the other side's reply to the staff", async () => {
    // The supplier answers the chat staff started.
    store.upsertConversation.mockResolvedValue(
      conversation({
        status: "handed-off",
        last_outbound_at: new Date(Date.now() - 60_000).toISOString(),
      }),
    )
    await deliver(
      fresh(fixture("inbound-text.json")),
      "whatsapp.message.received",
    )
    await settle()
    expect(store.recordInbound).toHaveBeenCalledTimes(1)
    expect(runAgent).not.toHaveBeenCalled()
  })

  it("is claimed once per wamid whichever event carries it", async () => {
    store.findConversation.mockResolvedValue(conversation())
    const raw = echo()
    await deliver(raw, "whatsapp.message.received", "kapso-key-a")
    await deliver(raw, "whatsapp.message.sent", "kapso-key-b")
    await settle()

    const keys = store.claimDelivery.mock.calls.map(c => c[0])
    expect(keys).toEqual([
      "sent:wamid.SYNTHETIC.BUSINESSAPP.ECHO.0001",
      "sent:wamid.SYNTHETIC.BUSINESSAPP.ECHO.0001",
    ])
  })
})

describe("inbound", () => {
  it("answers a fresh message in an active conversation", async () => {
    store.upsertConversation.mockResolvedValue(conversation())
    await deliver(
      fresh(fixture("inbound-text.json")),
      "whatsapp.message.received",
    )
    await settle()
    expect(runAgent).toHaveBeenCalledTimes(1)
  })

  it("stores but never answers a message over an hour old", async () => {
    store.upsertConversation.mockResolvedValue(conversation())
    await deliver(
      fresh(fixture("inbound-text.json"), 2 * 60 * 60),
      "whatsapp.message.received",
    )
    await settle()
    expect(store.recordInbound).toHaveBeenCalledTimes(1)
    expect(runAgent).not.toHaveBeenCalled()
  })

  it("never answers imported history", async () => {
    // With a conversation available, only the origin check stands between
    // this message and a reply.
    store.upsertConversation.mockResolvedValue(conversation())
    await deliver(
      fresh(fixture("history-sync.synthetic.json")),
      "whatsapp.message.received",
    )
    await settle()
    expect(store.recordInbound).not.toHaveBeenCalled()
    expect(runAgent).not.toHaveBeenCalled()
  })
})

describe("inbox echo (cloud_api) — DR's path, unchanged", () => {
  it("still waits before concluding a person sent it", async () => {
    vi.useFakeTimers()
    store.findConversation.mockResolvedValue(conversation())

    await deliver(fixture("message-sent.json"), "whatsapp.message.sent")
    // Let the deferred work start, then cross the 12s confirmation pause.
    await vi.advanceTimersByTimeAsync(0)
    expect(store.haveSentMessage).toHaveBeenCalledTimes(1)
    expect(store.recordHumanOutbound).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(12_000)
    await settle()
    expect(store.haveSentMessage).toHaveBeenCalledTimes(2)
    expect(store.recordHumanOutbound).toHaveBeenCalledTimes(1)
  })

  it("treats its own recorded send as ours", async () => {
    store.haveSentMessage.mockResolvedValue(true)
    await deliver(fixture("message-sent.json"), "whatsapp.message.sent")
    await settle()
    expect(store.recordHumanOutbound).not.toHaveBeenCalled()
  })
})

describe("Kapso allowance and the send breaker", () => {
  it("does not call the agent while the tenant is paused", async () => {
    store.resolveTenant.mockResolvedValue({
      ...grandbay,
      paused_until: new Date(Date.now() + 30 * 60_000).toISOString(),
    })
    store.upsertConversation.mockResolvedValue(conversation())
    await deliver(
      fresh(fixture("inbound-text.json")),
      "whatsapp.message.received",
    )
    await settle()
    expect(store.recordInbound).toHaveBeenCalledTimes(1)
    expect(runAgent).not.toHaveBeenCalled()
  })

  it("answers again once the pause has expired", async () => {
    store.resolveTenant.mockResolvedValue({
      ...grandbay,
      paused_until: new Date(Date.now() - 60_000).toISOString(),
    })
    store.upsertConversation.mockResolvedValue(conversation())
    await deliver(
      fresh(fixture("inbound-text.json")),
      "whatsapp.message.received",
    )
    await settle()
    expect(runAgent).toHaveBeenCalledTimes(1)
  })

  it("counts each new inbound message and each staff message once", async () => {
    store.upsertConversation.mockResolvedValue(conversation())
    store.findConversation.mockResolvedValue(conversation())
    await deliver(
      fresh(fixture("inbound-text.json")),
      "whatsapp.message.received",
    )
    await deliver(
      fresh(fixture("business-app-echo.synthetic.json")),
      "whatsapp.message.received",
    )
    await settle()
    expect(countKapsoMessage).toHaveBeenCalledTimes(2)
  })

  it("does not count a redelivered inbound message", async () => {
    store.upsertConversation.mockResolvedValue(conversation())
    store.recordInbound.mockResolvedValue(false) // wamid already stored
    await deliver(
      fresh(fixture("inbound-text.json")),
      "whatsapp.message.received",
    )
    await settle()
    expect(countKapsoMessage).not.toHaveBeenCalled()
  })
})
