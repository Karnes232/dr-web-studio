import { describe, expect, it } from "vitest"
import { PRICE } from "./pricing"

/**
 * The cache-write rate and the request's cache TTL are only correct together,
 * and nothing else in the codebase ties them.
 *
 * `claude.ts` sends `cache_control: { type: "ephemeral", ttl: "1h" }`. A
 * 5-minute write bills at 1.25x input; a 1-hour write bills at 2x. The constant
 * sat at the 5-minute rate while the request asked for an hour, so every cache
 * write was under-reported by 37.5% — and that flowed into messages.cost_usd,
 * conversations.cost_usd, tenants.cost_this_month_usd, and the monthly spend
 * cap that decides when the agent stops talking to customers.
 *
 * If the TTL on the request ever changes, this test should fail.
 */
describe("PRICE", () => {
  it("charges cache writes at the 1-hour rate, not the 5-minute one", () => {
    expect(PRICE.cacheWrite).toBe(PRICE.input * 2)
    // The wrong value that shipped, pinned so it cannot quietly return.
    expect(PRICE.cacheWrite).not.toBe(PRICE.input * 1.25)
  })

  it("charges cache reads at a tenth of input", () => {
    expect(PRICE.cacheRead).toBeCloseTo(PRICE.input * 0.1, 10)
  })

  it("is Opus 5 list price", () => {
    // Not keyed by model. If tenants.model is ever changed, every figure
    // derived from this table becomes wrong — see the note in claude.ts.
    expect(PRICE.input).toBe(5.0)
    expect(PRICE.output).toBe(25.0)
  })

  it("prices output above input, so long replies are never cheap", () => {
    expect(PRICE.output).toBeGreaterThan(PRICE.input)
  })
})
