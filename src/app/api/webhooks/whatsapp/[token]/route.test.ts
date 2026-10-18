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

const { pending, runAgent, notifyWaitingOnYou, countKapsoMessage, store } =
  vi.hoisted(() => ({
    pending: [] as Promise<unknown>[],
    runAgent: vi.fn(),
    notifyWaitingOnYou: vi.fn(),
    countKapsoMessage: vi.fn(),
    store: {
      applyStatus: vi.fn(),
      claimDelivery: vi.fn(),
      createHandedOffConversation: vi.fn(),
      findConversation: vi.fn(),
      haveSentMessage: vi.fn(),
      inboundCountSince: vi.fn(),
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
  notifyWaitingOnYou: (...args: unknown[]) => notifyWaitingOnYou(...args),
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
  notifyWaitingOnYou.mockReset()
  countKapsoMessage.mockReset()
  store.claimDelivery.mockResolvedValue(true)
  store.resolveTenant.mockResolvedValue(grandbay)
  store.recordInbound.mockResolvedValue(true)
  store.haveSentMessage.mockResolvedValue(false)
  store.inboundCountSince.mockResolvedValue(1)
})

afterEach(() => {
  vi.useRealTimers()
})

describe("Business App echo (coexistence), captured payload", () => {
  // A real staff reply from the phone: message.sent, `from` = the business.
  const echo = () => fresh(fixture("business-app-echo-phone.json"))
  const customer = "DO.1000000000000042"

  it("stands the agent down at once, with no takeover pause", async () => {
    store.findConversation.mockResolvedValue(conversation({ wa_id: customer }))

    const res = await deliver(echo(), "whatsapp.message.sent")
    expect(res.status).toBe(200)
    await settle()

    // Definitive: never checked against our own sends, never delayed.
    expect(store.haveSentMessage).not.toHaveBeenCalled()
    expect(store.recordHumanOutbound).toHaveBeenCalledTimes(1)
    const [, conv, message] = store.recordHumanOutbound.mock.calls[0]
    expect(conv.id).toBe("conv-1")
    expect(message.waId).toBe(customer)
    expect(runAgent).not.toHaveBeenCalled()
  })

  it("stands down even if the agent replied seconds ago", async () => {
    // The RECENT_SEND guard exists for inbox replies we might have sent
    // ourselves. An app message cannot be ours.
    store.findConversation.mockResolvedValue(
      conversation({
        wa_id: customer,
        last_outbound_at: new Date().toISOString(),
      }),
    )
    await deliver(echo(), "whatsapp.message.sent")
    await settle()
    expect(store.recordHumanOutbound).toHaveBeenCalledTimes(1)
  })

  it("does the same for a reply from WhatsApp Web", async () => {
    store.findConversation.mockResolvedValue(conversation({ wa_id: customer }))
    await deliver(
      fresh(fixture("business-app-echo-companion.json")),
      "whatsapp.message.sent",
    )
    await settle()
    expect(store.haveSentMessage).not.toHaveBeenCalled()
    expect(store.recordHumanOutbound).toHaveBeenCalledTimes(1)
  })

  it("creates a staff-started chat already handed off", async () => {
    store.findConversation.mockResolvedValue(null)
    store.createHandedOffConversation.mockResolvedValue(
      conversation({ wa_id: customer, status: "handed-off" }),
    )

    await deliver(echo(), "whatsapp.message.sent")
    await settle()

    expect(store.createHandedOffConversation).toHaveBeenCalledTimes(1)
    expect(store.createHandedOffConversation.mock.calls[0][1].waId).toBe(
      customer,
    )
    expect(store.recordHumanOutbound).toHaveBeenCalledTimes(1)
  })

  it("creates the captured staff-started chat handed off, keyed on `to`", async () => {
    store.findConversation.mockResolvedValue(null)
    store.createHandedOffConversation.mockResolvedValue(
      conversation({ wa_id: "18295550000", status: "handed-off" }),
    )
    await deliver(
      fresh(fixture("business-app-echo-new-chat.json")),
      "whatsapp.message.sent",
    )
    await settle()
    expect(store.haveSentMessage).not.toHaveBeenCalled()
    expect(store.createHandedOffConversation.mock.calls[0][1].waId).toBe(
      "18295550000",
    )
    expect(store.recordHumanOutbound).toHaveBeenCalledTimes(1)
  })

  it("leaves the agent's own send on the confirm-and-pause path", async () => {
    // Kapso's API echo on the same number has no `from`. It must still be
    // checked against our sends, or the agent would hand itself off.
    store.haveSentMessage.mockResolvedValue(true)
    await deliver(
      fresh(fixture("coexistence-api-send.json")),
      "whatsapp.message.sent",
    )
    await settle()
    expect(store.haveSentMessage).toHaveBeenCalled()
    expect(store.recordHumanOutbound).not.toHaveBeenCalled()
  })
})

describe("Business App echo (coexistence), described shape", () => {
  // Kapso support's description: origin stamped, on message.received. Not
  // seen in practice; kept so that shape still stands the agent down.
  const echo = () => fresh(fixture("business-app-echo.synthetic.json"))

  it("stands the agent down at once", async () => {
    store.findConversation.mockResolvedValue(conversation())
    await deliver(echo(), "whatsapp.message.received")
    await settle()
    expect(store.haveSentMessage).not.toHaveBeenCalled()
    expect(store.recordHumanOutbound).toHaveBeenCalledTimes(1)
    expect(store.recordHumanOutbound.mock.calls[0][2].waId).toBe("18295551234")
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

describe("a customer writes into a chat that is a person's", () => {
  // DR: James took the chat over; the agent waits 12 hours. He is emailed
  // once per quiet stretch, and only when he has been gone an hour — a live
  // back-and-forth must not email him on every reply.
  const MIN = 60 * 1000
  const HOUR = 60 * MIN
  const dr = {
    tenant_id: "drwebstudio",
    phone_number_id: "900000000000002",
    resume_after_hours: 12,
  }
  const inbound = () =>
    deliver(fresh(fixture("inbound-text.json")), "whatsapp.message.received")
  const chat = (status: string, lastAgo: number | null) =>
    conversation({
      tenant_id: "drwebstudio",
      status,
      last_outbound_at:
        lastAgo === null ? null : new Date(Date.now() - lastAgo).toISOString(),
    })

  beforeEach(() => {
    store.resolveTenant.mockResolvedValue(dr)
  })

  it("does not email during a live chat (James replied a minute ago)", async () => {
    // Isabel, 2026-10-17: she answered within a minute of every reply.
    store.upsertConversation.mockResolvedValue(chat("handed-off", 1 * MIN))
    await inbound()
    await settle()
    expect(runAgent).not.toHaveBeenCalled()
    expect(notifyWaitingOnYou).not.toHaveBeenCalled()
    expect(store.inboundCountSince).not.toHaveBeenCalled()
  })

  it("still does not email at 10 minutes", async () => {
    store.upsertConversation.mockResolvedValue(chat("handed-off", 10 * MIN))
    await inbound()
    await settle()
    expect(notifyWaitingOnYou).not.toHaveBeenCalled()
  })

  it("emails, without answering, once James has been quiet an hour", async () => {
    const c = chat("handed-off", 2 * HOUR)
    store.upsertConversation.mockResolvedValue(c)
    await inbound()
    await settle()
    expect(runAgent).not.toHaveBeenCalled()
    expect(notifyWaitingOnYou).toHaveBeenCalledTimes(1)

    const last = new Date(String(c.last_outbound_at)).getTime()
    // Counted from the end of the quiet hour, not from his last message.
    expect(store.inboundCountSince).toHaveBeenCalledWith(
      "conv-1",
      new Date(last + HOUR).toISOString(),
    )
    const resumesAt = notifyWaitingOnYou.mock.calls[0][2] as Date
    expect(resumesAt.getTime()).toBe(last + 12 * HOUR)
  })

  it("stays silent on the rest of the burst", async () => {
    store.upsertConversation.mockResolvedValue(chat("handed-off", 2 * HOUR))
    store.inboundCountSince.mockResolvedValue(2)
    await inbound()
    await settle()
    expect(notifyWaitingOnYou).not.toHaveBeenCalled()
  })

  it("emails for an escalation nobody has answered yet", async () => {
    store.upsertConversation.mockResolvedValue(chat("awaiting-human", 2 * HOUR))
    await inbound()
    await settle()
    expect(notifyWaitingOnYou).toHaveBeenCalledTimes(1)
  })

  it("never emails about a closed chat", async () => {
    store.upsertConversation.mockResolvedValue(chat("closed", 2 * HOUR))
    await inbound()
    await settle()
    expect(notifyWaitingOnYou).not.toHaveBeenCalled()
    expect(runAgent).not.toHaveBeenCalled()
  })

  it("answers, re-introducing itself, once 12 hours have passed", async () => {
    store.upsertConversation.mockResolvedValue(chat("handed-off", 13 * HOUR))
    await inbound()
    await settle()
    expect(runAgent).toHaveBeenCalledTimes(1)
    expect(runAgent.mock.calls[0][3]).toEqual({ resumed: true })
    expect(notifyWaitingOnYou).not.toHaveBeenCalled()
  })

  it("hands a never-resuming tenant's chat no resume time", async () => {
    // Grand Bay: whether that email is sent at all is the profile's call.
    store.resolveTenant.mockResolvedValue(grandbay)
    store.upsertConversation.mockResolvedValue(
      conversation({
        status: "handed-off",
        last_outbound_at: new Date(Date.now() - 2 * HOUR).toISOString(),
      }),
    )
    await inbound()
    await settle()
    expect(notifyWaitingOnYou.mock.calls[0][2]).toBeNull()
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
