import { describe, expect, it } from "vitest"
import { turnDecision, RESUME_AFTER_MS } from "./store"

/**
 * When a human takes over — or the agent escalates — the agent goes quiet and
 * comes back only after the business has been silent for five days.
 *
 * The rule is measured from `last_outbound_at`, never `last_inbound_at`:
 * `upsertConversation` has already stamped the inbound timestamp with the very
 * message being handled by the time anything reads the row, so it is always
 * "now" and would resume the agent instantly.
 */

const NOW = new Date("2026-09-20T12:00:00Z")
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString()
const DAY = 24 * 60 * 60 * 1000

describe("turnDecision", () => {
  it("lets the agent answer an active conversation", () => {
    expect(
      turnDecision({ status: "active", last_outbound_at: ago(1000) }, NOW),
    ).toEqual({ allowed: true, resumed: false, reactivate: false })
  })

  it("stays quiet right after a human takes over", () => {
    const d = turnDecision(
      { status: "handed-off", last_outbound_at: ago(60_000) },
      NOW,
    )
    expect(d.allowed).toBe(false)
  })

  it("is still quiet at four days", () => {
    expect(
      turnDecision({ status: "handed-off", last_outbound_at: ago(4 * DAY) }, NOW)
        .allowed,
    ).toBe(false)
  })

  it("resumes once the business has been silent for five days", () => {
    const d = turnDecision(
      { status: "handed-off", last_outbound_at: ago(5 * DAY + 1000) },
      NOW,
    )
    expect(d).toEqual({ allowed: true, resumed: true, reactivate: true })
  })

  it("applies the same rule to agent escalations", () => {
    // These were previously one-way: an escalated customer returning weeks
    // later got silence forever.
    expect(
      turnDecision(
        { status: "awaiting-human", last_outbound_at: ago(6 * DAY) },
        NOW,
      ),
    ).toEqual({ allowed: true, resumed: true, reactivate: true })
    expect(
      turnDecision(
        { status: "awaiting-human", last_outbound_at: ago(1 * DAY) },
        NOW,
      ).allowed,
    ).toBe(false)
  })

  it("never resumes a closed conversation", () => {
    expect(
      turnDecision({ status: "closed", last_outbound_at: ago(400 * DAY) }, NOW)
        .allowed,
    ).toBe(false)
  })

  it("treats a handoff that never got a reply as immediately eligible", () => {
    // No outbound has ever been sent, so nobody is mid-exchange.
    expect(
      turnDecision({ status: "handed-off", last_outbound_at: null }, NOW)
        .allowed,
    ).toBe(true)
  })

  it("flags a resume so the agent re-introduces itself", () => {
    // The persona only discloses on the FIRST reply, which cannot fire when
    // there is history — this flag is what makes it say who it is again.
    const d = turnDecision(
      { status: "handed-off", last_outbound_at: ago(RESUME_AFTER_MS + 1) },
      NOW,
    )
    expect(d.resumed).toBe(true)
  })

  it("uses exactly five days", () => {
    expect(RESUME_AFTER_MS).toBe(5 * DAY)
  })
})
