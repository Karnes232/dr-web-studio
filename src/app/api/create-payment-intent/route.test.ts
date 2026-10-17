import { beforeEach, describe, expect, it, vi } from "vitest"

const { create, verify } = vi.hoisted(() => ({
  create: vi.fn(),
  verify: vi.fn(),
}))

vi.mock("@/lib/stripe", () => ({
  stripe: { paymentIntents: { create: (...a: unknown[]) => create(...a) } },
}))
vi.mock("@/lib/botpoison-verify", async importOriginal => ({
  ...(await importOriginal<typeof import("@/lib/botpoison-verify")>()),
  verifyBotpoisonSolution: (...a: unknown[]) => verify(...a),
}))

import { POST } from "./route"

const body = {
  amount: 5000,
  customerName: "Ana Pérez",
  customerEmail: "ana@example.com",
  lang: "en",
  attemptId: "123e4567-e89b-12d3-a456-426614174000",
  _botpoison: "solution",
}

function post(b: unknown) {
  return POST(
    new Request("http://localhost/api/create-payment-intent", {
      method: "POST",
      body: JSON.stringify(b),
    }) as never,
  )
}

beforeEach(() => {
  create.mockReset()
  verify.mockReset()
  verify.mockResolvedValue(true)
  create.mockResolvedValue({ client_secret: "pi_1_secret_x" })
  vi.spyOn(console, "error").mockImplementation(() => {})
})

describe("POST /api/create-payment-intent", () => {
  it("returns 400 without a BotPoison token and never calls Stripe", async () => {
    const { _botpoison, ...rest } = body
    void _botpoison
    const res = await post(rest)
    expect(res.status).toBe(400)
    expect(verify).not.toHaveBeenCalled()
    expect(create).not.toHaveBeenCalled()
  })

  it("returns 403 when the BotPoison check fails", async () => {
    verify.mockResolvedValue(false)
    const res = await post(body)
    expect(res.status).toBe(403)
    expect(create).not.toHaveBeenCalled()
  })

  it("returns 403 when the BotPoison call itself throws", async () => {
    verify.mockRejectedValue(new Error("network"))
    expect((await post(body)).status).toBe(403)
    expect(create).not.toHaveBeenCalled()
  })

  it.each([99, 1_000_001, 12.5, "5000"])(
    "rejects amount %s with 400",
    async amount => {
      const res = await post({ ...body, amount })
      expect(res.status).toBe(400)
      expect(create).not.toHaveBeenCalled()
    },
  )

  it("rejects a missing name with a code", async () => {
    const res = await post({ ...body, customerName: "" })
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: "name_required" })
  })

  it("creates the intent in usd even when the body asks for jpy", async () => {
    const res = await post({ ...body, currency: "jpy" })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ clientSecret: "pi_1_secret_x" })
    const params = create.mock.calls[0][0]
    expect(params.currency).toBe("usd")
    expect(params.amount).toBe(5000)
  })

  it("stamps metadata and sets no receipt_email", async () => {
    await post(body)
    const [params, opts] = create.mock.calls[0]
    expect(params.metadata).toEqual({
      source: "custom-payment",
      customerName: "Ana Pérez",
      customerEmail: "ana@example.com",
      lang: "en",
    })
    expect(params).not.toHaveProperty("receipt_email")
    expect(opts.idempotencyKey).toMatch(/^[0-9a-f]{64}$/)
  })

  it("derives the same idempotency key for the same attempt and details only", async () => {
    await post(body)
    await post(body)
    await post({ ...body, amount: 6000 })
    const keys = create.mock.calls.map(c => c[1].idempotencyKey)
    expect(keys[0]).toBe(keys[1])
    expect(keys[2]).not.toBe(keys[0])
  })

  it("returns a generic 500 with no details when Stripe throws", async () => {
    create.mockRejectedValue(new Error("sk_test_secret exploded"))
    const res = await post(body)
    expect(res.status).toBe(500)
    const text = await res.text()
    expect(text).toBe(JSON.stringify({ error: "create_failed" }))
    expect(text).not.toContain("sk_test")
  })
})
