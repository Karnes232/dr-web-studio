import { describe, expect, it } from "vitest"
import {
  turnDecision,
  resumeAfterMsFor,
  resumeWindowMs,
  RESUME_AFTER_MS,
} from "./store"

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
      turnDecision(
        { status: "handed-off", last_outbound_at: ago(4 * DAY) },
        NOW,
      ).allowed,
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

describe("turnDecision — per-tenant resume window", () => {
  // Grand Bay staff answer from their phones on the same number, so a chat a
  // person spoke in must stay theirs: `resume_after_hours` NULL = never.
  const NEVER = null

  it("never resumes a handed-off chat when the tenant says never", () => {
    expect(
      turnDecision(
        { status: "handed-off", last_outbound_at: ago(400 * DAY) },
        NOW,
        NEVER,
      ).allowed,
    ).toBe(false)
  })

  it("never resumes even a handoff that got no reply", () => {
    // A person-started chat is created handed-off; the agent stays out.
    expect(
      turnDecision({ status: "handed-off", last_outbound_at: null }, NOW, NEVER)
        .allowed,
    ).toBe(false)
  })

  it("still resumes an agent escalation nobody answered, after five days", () => {
    // awaiting-human means the agent escalated; staff may never have spoken.
    // Leaving that customer in permanent silence is the old one-way bug.
    expect(
      turnDecision(
        { status: "awaiting-human", last_outbound_at: ago(6 * DAY) },
        NOW,
        NEVER,
      ).allowed,
    ).toBe(true)
  })

  it("keeps DR's behaviour at 120 hours exactly", () => {
    const window = resumeAfterMsFor({ resume_after_hours: 120 })
    expect(window).toBe(RESUME_AFTER_MS)
    expect(
      turnDecision(
        { status: "handed-off", last_outbound_at: ago(4 * DAY) },
        NOW,
        window,
      ).allowed,
    ).toBe(false)
    expect(
      turnDecision(
        { status: "handed-off", last_outbound_at: ago(5 * DAY + 1000) },
        NOW,
        window,
      ).allowed,
    ).toBe(true)
  })
})

describe("turnDecision — a 12-hour tenant", () => {
  // DR: James takes a chat over, and if the customer writes again after he
  // has been quiet for 12 hours, the agent picks it back up.
  const HOUR = 60 * 60 * 1000
  const window = resumeAfterMsFor({ resume_after_hours: 12 })

  it("stays quiet at 11 hours", () => {
    expect(
      turnDecision(
        { status: "handed-off", last_outbound_at: ago(11 * HOUR) },
        NOW,
        window,
      ).allowed,
    ).toBe(false)
  })

  it("resumes a chat a person took over at 13 hours", () => {
    expect(
      turnDecision(
        { status: "handed-off", last_outbound_at: ago(13 * HOUR) },
        NOW,
        window,
      ),
    ).toEqual({ allowed: true, resumed: true, reactivate: true })
  })

  it("resumes an escalation nobody answered just as fast", () => {
    // An escalated chat must never wait longer than one a person spoke in.
    expect(
      turnDecision(
        { status: "awaiting-human", last_outbound_at: ago(13 * HOUR) },
        NOW,
        window,
      ).allowed,
    ).toBe(true)
    expect(
      turnDecision(
        { status: "awaiting-human", last_outbound_at: ago(11 * HOUR) },
        NOW,
        window,
      ).allowed,
    ).toBe(false)
  })
})

describe("resumeWindowMs", () => {
  it("gives handed-off chats the tenant's window, never included", () => {
    expect(resumeWindowMs("handed-off", 12)).toBe(12)
    expect(resumeWindowMs("handed-off", null)).toBeNull()
  })

  it("caps escalations at the tenant's window and at five days", () => {
    expect(resumeWindowMs("awaiting-human", 12)).toBe(12)
    expect(resumeWindowMs("awaiting-human", 10 * RESUME_AFTER_MS)).toBe(
      RESUME_AFTER_MS,
    )
    expect(resumeWindowMs("awaiting-human", null)).toBe(RESUME_AFTER_MS)
  })
})

describe("resumeAfterMsFor", () => {
  it("keeps the five-day default before the column exists", () => {
    // Deploying the code ahead of the migration must change nothing.
    expect(resumeAfterMsFor({})).toBe(RESUME_AFTER_MS)
  })

  it("maps NULL to never", () => {
    expect(resumeAfterMsFor({ resume_after_hours: null })).toBeNull()
  })

  it("converts hours", () => {
    expect(resumeAfterMsFor({ resume_after_hours: 2 })).toBe(2 * 60 * 60 * 1000)
  })
})
