import { describe, expect, it } from "vitest"
import { isWindowOpen } from "./store"

/**
 * Neither Meta nor Kapso exposes the 24-hour customer service window as a
 * flag, so this computation is the only thing standing between a free-form
 * reply and error 131047.
 */
describe("isWindowOpen", () => {
  const now = new Date("2026-09-12T12:00:00Z")
  const at = (iso: string) => ({ last_inbound_at: iso })

  it("is open just inside 24 hours", () => {
    expect(isWindowOpen(at("2026-09-11T12:00:01Z"), now)).toBe(true)
  })

  it("is closed exactly at 24 hours", () => {
    expect(isWindowOpen(at("2026-09-11T12:00:00Z"), now)).toBe(false)
  })

  it("is closed well past 24 hours", () => {
    expect(isWindowOpen(at("2026-09-01T12:00:00Z"), now)).toBe(false)
  })

  it("is closed when the customer has never written", () => {
    expect(isWindowOpen({ last_inbound_at: null }, now)).toBe(false)
  })
})
