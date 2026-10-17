import { describe, expect, it } from "vitest"
import { formatMoney, formatPaidAt } from "./format"

describe("formatMoney", () => {
  it("formats cents with the currency, per locale", () => {
    expect(formatMoney(123456, "usd", "en")).toBe("$1,234.56")
    const es = formatMoney(123456, "usd", "es")
    expect(es).toContain("1,234.56")
    expect(es).toMatch(/US\$|\$/)
  })

  it("never divides by anything but 100", () => {
    expect(formatMoney(100, "usd", "en")).toBe("$1.00")
    expect(formatMoney(1_000_000, "usd", "en")).toBe("$10,000.00")
  })

  it("handles DOP", () => {
    expect(formatMoney(250000, "dop", "es")).toContain("2,500.00")
  })
})

describe("formatPaidAt", () => {
  it("uses the Dominican calendar day, not UTC's", () => {
    // 01:30 UTC on the 16th is 9:30 pm on the 15th in Santo Domingo (UTC-4).
    const d = new Date("2026-01-16T01:30:00Z")
    expect(formatPaidAt(d, "en")).toBe("January 15, 2026")
    expect(formatPaidAt(d, "es")).toContain("15")
    expect(formatPaidAt(d, "es").toLowerCase()).toContain("enero")
  })
})
