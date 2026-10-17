import { describe, expect, it } from "vitest"
import {
  isOurPayment,
  parseCheckoutInput,
  readPaymentMetadata,
} from "./validate"

const good = {
  amount: 5000,
  customerName: "Ana Pérez",
  customerEmail: "ana@example.com",
  lang: "es",
}

describe("parseCheckoutInput amount", () => {
  it.each([
    [99, "amount_min"],
    [0, "amount_min"],
    [-500, "amount_min"],
    [1_000_001, "amount_max"],
    [1.5, "amount_invalid"],
    [100.5, "amount_invalid"],
    ["5000", "amount_invalid"],
    [NaN, "amount_invalid"],
    [Infinity, "amount_invalid"],
    [undefined, "amount_invalid"],
    [null, "amount_invalid"],
    [2 ** 60, "amount_invalid"],
  ])("rejects %s", (amount, code) => {
    expect(parseCheckoutInput({ ...good, amount })).toEqual({ ok: false, code })
  })

  it.each([100, 5000, 1_000_000])("accepts %s", amount => {
    const r = parseCheckoutInput({ ...good, amount })
    expect(r.ok && r.value.amount).toBe(amount)
  })
})

describe("parseCheckoutInput people fields", () => {
  it("requires a name and trims it", () => {
    expect(parseCheckoutInput({ ...good, customerName: "   " })).toEqual({
      ok: false,
      code: "name_required",
    })
    const r = parseCheckoutInput({ ...good, customerName: "  Ana  " })
    expect(r.ok && r.value.customerName).toBe("Ana")
  })

  it("clamps an over-long name to 100 characters", () => {
    const r = parseCheckoutInput({ ...good, customerName: "a".repeat(500) })
    expect(r.ok && r.value.customerName).toHaveLength(100)
  })

  it("requires a well-formed email", () => {
    expect(parseCheckoutInput({ ...good, customerEmail: "" })).toEqual({
      ok: false,
      code: "email_required",
    })
    for (const bad of ["nope", "a@b", "a b@c.com", "@x.com"]) {
      expect(parseCheckoutInput({ ...good, customerEmail: bad })).toEqual({
        ok: false,
        code: "email_invalid",
      })
    }
  })

  it("clamps the email to 254 characters, which then fails the shape check", () => {
    const r = parseCheckoutInput({
      ...good,
      customerEmail: `${"a".repeat(300)}@example.com`,
    })
    expect(r.ok).toBe(false)
  })

  it("ignores a currency in the body", () => {
    const r = parseCheckoutInput({ ...good, currency: "jpy" })
    expect(r.ok).toBe(true)
    expect(r.ok && "currency" in r.value).toBe(false)
  })
})

describe("parseCheckoutInput lang and attemptId", () => {
  it("accepts es and en, defaults anything else to es", () => {
    const lang = (v: unknown) => {
      const r = parseCheckoutInput({ ...good, lang: v })
      return r.ok && r.value.lang
    }
    expect(lang("en")).toBe("en")
    expect(lang("es")).toBe("es")
    expect(lang("fr")).toBe("es")
    expect(lang(undefined)).toBe("es")
    expect(lang({})).toBe("es")
  })

  it("keeps a sane attemptId and drops a weird one", () => {
    const ok = parseCheckoutInput({
      ...good,
      attemptId: "123e4567-e89b-12d3-a456-426614174000",
    })
    expect(ok.ok && ok.value.attemptId).toBe(
      "123e4567-e89b-12d3-a456-426614174000",
    )
    const bad = parseCheckoutInput({ ...good, attemptId: "x; drop table" })
    expect(bad.ok && bad.value.attemptId).toBeUndefined()
  })

  it("survives a non-object body", () => {
    expect(parseCheckoutInput(null)).toEqual({
      ok: false,
      code: "amount_invalid",
    })
    expect(parseCheckoutInput("hi")).toEqual({
      ok: false,
      code: "amount_invalid",
    })
  })
})

describe("payment metadata", () => {
  it("round-trips what the create route writes", () => {
    const pi = {
      metadata: {
        source: "custom-payment",
        customerName: "Ana",
        customerEmail: "ana@example.com",
        lang: "en",
      },
    }
    expect(readPaymentMetadata(pi)).toEqual({
      customerName: "Ana",
      customerEmail: "ana@example.com",
      lang: "en",
    })
    expect(isOurPayment(pi)).toBe(true)
  })

  it("falls back safely and rejects foreign payments", () => {
    expect(readPaymentMetadata({ metadata: {} }).lang).toBe("es")
    expect(isOurPayment({ metadata: {} })).toBe(false)
    expect(isOurPayment({ metadata: { source: "other-app" } })).toBe(false)
  })
})
