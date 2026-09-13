import { describe, expect, it } from "vitest"
import { isSpammySubmission, SPAM_THRESHOLD } from "./spam"

/** The three submissions that reached the inbox on 2026-09-13, verbatim. */
const CAPTURED = [
  { name: "Fctnqb Lhldxtut", company: "Vjiuy LLC", message: "5403116344" },
  { name: "Ugvdkfq Byyglw", company: "Bhhlhud LLC", message: "2210221907" },
  { name: "Vbger Xbpcwus", company: "Crywmyg LLC", message: "8001605616" },
]

/**
 * Real enquiries. These matter more than the spam cases: a false positive
 * means a genuine prospect is silently filed as spam and never answered.
 */
const GENUINE = [
  {
    name: "María Fernández",
    company: "Restaurante El Conuco",
    message: "Hola, necesito una página web para mi restaurante en Punta Cana.",
  },
  {
    name: "James Karnes",
    company: "",
    message: "Quiero una tienda online, ¿cuánto cuesta?",
  },
  {
    name: "John Schmidt",
    company: "Caribbean Dive Ltd",
    message:
      "Hi, we run a dive centre in Bayahibe and need a bilingual booking site.",
  },
  {
    name: "Yudelka Guzmán",
    company: "Inmobiliaria RD",
    message: "Buenas, me interesa el plan de mantenimiento. ¿Qué incluye?",
  },
  { name: "Ana", company: "", message: "Hola" },
  {
    name: "Jean-Christophe D'Alembert",
    company: "Groupe Ltd",
    message: "Bonjour, nous cherchons un site multilingue.",
  },
]

describe("isSpammySubmission — the captured bots", () => {
  it.each(CAPTURED)("flags $name", input => {
    const v = isSpammySubmission(input)
    expect(v.spam).toBe(true)
    expect(v.score).toBeGreaterThanOrEqual(SPAM_THRESHOLD)
  })

  it("catches them on the message alone, without the name signals", () => {
    // The digits-only rule must stand by itself — if the bot starts sending
    // plausible names, the message check still holds.
    for (const c of CAPTURED) {
      const v = isSpammySubmission({
        name: "María Fernández",
        message: c.message,
      })
      expect(v.spam, c.message).toBe(true)
      expect(v.reasons).toContain("message contains no letters")
    }
  })

  it("catches them on the name alone, without the message signal", () => {
    for (const c of CAPTURED) {
      const v = isSpammySubmission({
        name: c.name,
        company: c.company,
        message: "Hello, I would like a website for my business please.",
      })
      expect(v.score, c.name).toBeGreaterThanOrEqual(SPAM_THRESHOLD)
    }
  })
})

describe("isSpammySubmission — genuine enquiries must pass", () => {
  it.each(GENUINE)("lets $name through", input => {
    const v = isSpammySubmission(input)
    expect(v.spam, `${input.name}: ${v.reasons.join(", ")}`).toBe(false)
  })

  it("does not punish a real surname with a 4-consonant run", () => {
    // "Schmidt" -> "Schm" is 4, which is why the threshold is 5 and not 4.
    expect(isSpammySubmission({ name: "John Schmidt" }).spam).toBe(false)
  })

  it("does not punish an LLC on its own", () => {
    expect(
      isSpammySubmission({
        name: "Pedro Martínez",
        company: "Bayahibe Tours LLC",
        message: "Necesito un sitio web para mi empresa de excursiones.",
      }).spam,
    ).toBe(false)
  })

  it("treats a short greeting as weak, not spam", () => {
    const v = isSpammySubmission({ name: "Ana", message: "Hola" })
    expect(v.score).toBeLessThan(SPAM_THRESHOLD)
  })

  it("handles empty and missing fields without throwing", () => {
    expect(isSpammySubmission({}).spam).toBe(false)
    expect(
      isSpammySubmission({ name: "", company: "", message: "" }).spam,
    ).toBe(false)
  })
})

describe("reasons are reported for the log line", () => {
  it("explains why a submission was flagged", () => {
    const v = isSpammySubmission(CAPTURED[0])
    expect(v.reasons.length).toBeGreaterThan(1)
    expect(v.reasons.join(" ")).toMatch(/no letters/)
  })
})
