import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  isBusinessScopedUserId,
  sendText,
  sendTemplate,
  WINDOW_EXPIRED,
} from "./send"

const ORIGINAL_FETCH = global.fetch

function mockFetch(status: number, json: unknown) {
  const spy = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => json,
  })
  global.fetch = spy as unknown as typeof fetch
  return spy
}

describe("sendText", () => {
  beforeEach(() => {
    process.env.KAPSO_API_KEY = "test-key"
    process.env.KAPSO_API_BASE = "https://api.example.test/v24.0"
  })
  afterEach(() => {
    global.fetch = ORIGINAL_FETCH
    vi.restoreAllMocks()
  })

  it("posts a Meta-shaped text body and returns the message id", async () => {
    const spy = mockFetch(200, {
      messaging_product: "whatsapp",
      messages: [{ id: "wamid.SENT1" }],
    })

    const result = await sendText("647015955153740", "18295551234", "Hola")

    expect(result).toEqual({ ok: true, messageId: "wamid.SENT1" })

    const [url, init] = spy.mock.calls[0]
    expect(url).toBe("https://api.example.test/v24.0/647015955153740/messages")
    expect((init as RequestInit).method).toBe("POST")
    expect((init as RequestInit).headers).toMatchObject({
      "X-API-Key": "test-key",
    })

    const body = JSON.parse((init as RequestInit).body as string)
    expect(body).toEqual({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: "18295551234",
      type: "text",
      text: { body: "Hola" },
    })
  })

  it("surfaces Meta error 131047 so the caller can fall back to a template", async () => {
    mockFetch(400, {
      error: {
        code: WINDOW_EXPIRED,
        message:
          "More than 24 hours have passed since the recipient last replied",
      },
    })

    const result = await sendText("123", "18295551234", "Hola")

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errorCode).toBe(131047)
    expect(result.errorMessage).toContain("24 hours")
  })

  it("never throws when the network fails", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValue(new Error("ECONNRESET")) as unknown as typeof fetch

    const result = await sendText("123", "18295551234", "Hola")
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.errorMessage).toContain("ECONNRESET")
  })

  it("fails cleanly when the API key is missing", async () => {
    delete process.env.KAPSO_API_KEY
    const spy = mockFetch(200, {})

    const result = await sendText("123", "18295551234", "Hola")

    expect(result.ok).toBe(false)
    expect(spy).not.toHaveBeenCalled()
  })

  it("builds a template body with language and components", async () => {
    const spy = mockFetch(200, { messages: [{ id: "wamid.T1" }] })

    await sendTemplate("123", "18295551234", "re_engage", "es", [
      { type: "body", parameters: [{ type: "text", text: "Ana" }] },
    ])

    const body = JSON.parse(
      (spy.mock.calls[0][1] as RequestInit).body as string,
    )
    expect(body.type).toBe("template")
    expect(body.template.name).toBe("re_engage")
    expect(body.template.language).toEqual({ code: "es" })
    expect(body.template.components).toHaveLength(1)
  })
})

/**
 * `to` is phone-numbers-only. A business-scoped user id must go in `recipient`
 * or Meta rejects the send — so a username-only customer would be greeted by
 * the agent accepting their message and then never answering.
 */
describe("business-scoped user id recipients", () => {
  beforeEach(() => {
    process.env.KAPSO_API_KEY = "test-key"
    process.env.KAPSO_API_BASE = "https://api.example.test/v24.0"
  })
  afterEach(() => {
    global.fetch = ORIGINAL_FETCH
    vi.restoreAllMocks()
  })

  it("tells a BSUID apart from a phone number by shape", () => {
    expect(isBusinessScopedUserId("DO.1757134975438075")).toBe(true)
    expect(isBusinessScopedUserId("US.13491208655302741918")).toBe(true)
    expect(isBusinessScopedUserId("18295551234")).toBe(false)
    expect(isBusinessScopedUserId("+18295551234")).toBe(false)
  })

  it("sends a BSUID as `recipient`, with no `to` and no recipient_type", () => {
    const spy = mockFetch(200, { messages: [{ id: "wamid.B1" }] })

    return sendText("1262180810319552", "DO.1757134975438075", "Hola").then(
      () => {
        const body = JSON.parse(
          (spy.mock.calls[0][1] as RequestInit).body as string,
        )
        expect(body).toEqual({
          messaging_product: "whatsapp",
          recipient: "DO.1757134975438075",
          type: "text",
          text: { body: "Hola" },
        })
        expect(body).not.toHaveProperty("to")
        expect(body).not.toHaveProperty("recipient_type")
      },
    )
  })

  it("leaves the phone-number form exactly as it was", async () => {
    const spy = mockFetch(200, { messages: [{ id: "wamid.P1" }] })

    await sendText("1262180810319552", "18295551234", "Hola")

    const body = JSON.parse(
      (spy.mock.calls[0][1] as RequestInit).body as string,
    )
    expect(body).toEqual({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: "18295551234",
      type: "text",
      text: { body: "Hola" },
    })
  })

  it("addresses templates the same way", async () => {
    const spy = mockFetch(200, { messages: [{ id: "wamid.T2" }] })

    await sendTemplate("123", "DO.1757134975438075", "re_engage", "es")

    const body = JSON.parse(
      (spy.mock.calls[0][1] as RequestInit).body as string,
    )
    expect(body.recipient).toBe("DO.1757134975438075")
    expect(body).not.toHaveProperty("to")
  })
})
