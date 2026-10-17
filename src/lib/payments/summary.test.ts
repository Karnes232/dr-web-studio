import { beforeEach, describe, expect, it, vi } from "vitest"

const { retrieve } = vi.hoisted(() => ({ retrieve: vi.fn() }))
vi.mock("@/lib/stripe", () => ({
  stripe: { paymentIntents: { retrieve: (...a: unknown[]) => retrieve(...a) } },
}))

import { getPaymentSummary } from "./summary"

const pi = {
  id: "pi_3Abc",
  amount: 5000,
  currency: "usd",
  status: "succeeded",
  created: 1_768_489_200,
  description: "Custom payment from Ana",
  receipt_email: "ana@example.com",
  client_secret: "pi_3Abc_secret_zzz",
  metadata: {
    source: "custom-payment",
    customerName: "Ana",
    customerEmail: "ana@example.com",
    lang: "es",
  },
}

const stripeError = (props: { code: string; statusCode: number }) =>
  Object.assign(new Error("stripe"), props)

beforeEach(() => {
  retrieve.mockReset()
})

describe("getPaymentSummary", () => {
  it("returns exactly five keys and no PII", async () => {
    retrieve.mockResolvedValue(pi)
    const s = await getPaymentSummary("pi_3Abc")
    expect(s).toEqual({
      id: "pi_3Abc",
      amount: 5000,
      currency: "usd",
      status: "succeeded",
      created: 1_768_489_200,
    })
    expect(Object.keys(s!)).toHaveLength(5)
    expect(JSON.stringify(s)).not.toContain("ana@example.com")
    expect(JSON.stringify(s)).not.toContain("secret")
  })

  it.each([undefined, "", "cs_test_123", "pi_", "pi_abc/../x", "pi_abc def"])(
    "rejects malformed id %j without calling Stripe",
    async id => {
      expect(await getPaymentSummary(id)).toBeNull()
      expect(retrieve).not.toHaveBeenCalled()
    },
  )

  it("returns null when Stripe has no such intent", async () => {
    retrieve.mockRejectedValue(
      stripeError({ code: "resource_missing", statusCode: 404 }),
    )
    expect(await getPaymentSummary("pi_nope")).toBeNull()
  })

  it("returns null for a payment this checkout did not create", async () => {
    retrieve.mockResolvedValue({ ...pi, metadata: {} })
    expect(await getPaymentSummary("pi_3Abc")).toBeNull()
  })

  it("re-throws other Stripe errors", async () => {
    retrieve.mockRejectedValue(
      stripeError({ code: "api_connection_error", statusCode: 500 }),
    )
    await expect(getPaymentSummary("pi_3Abc")).rejects.toHaveProperty(
      "code",
      "api_connection_error",
    )
  })
})
