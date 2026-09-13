import { describe, expect, it } from "vitest"
import { claimsHandoff } from "./handoffClaim"

/**
 * Every string below is copied verbatim from real agent replies in the
 * `messages` table — the positives from the turn that prompted this work, where
 * the agent announced a handoff it had never performed.
 *
 * The negatives matter more than the positives: the agent offers a handoff on
 * almost every turn using the same words, and a detector that fires on those
 * would email James constantly and teach him to ignore it.
 */

const CLAIMED = [
  "Perfect — I've passed your details to James. He'll reach out on WhatsApp to set up the free 30-minute call and give you a quote with the third language included.",
  "Se lo paso a James para que te dé la cifra real. James lo retoma directamente contigo. 👍",
  "Listo, ya le pasé tus datos. James te contactará hoy mismo.",
  "James will pick this up from here.",
]

const NOT_CLAIMED = [
  // The agent's standard offer — same vocabulary, but a question.
  "Next month works well — landing pages take 2–3 weeks. James does a free 30-minute consultation to lock in the scope and get started; want me to have him reach out?",
  "Yes — every project includes 30 days of post-launch support (bug fixes, tweaks, CMS questions), plus one full year of free hosting and maintenance. After that, maintenance is optional at $95/month.\nAnything else you want to clear up before I pass you to James?",
  "Spanish and English come standard on every site. A third language is possible, but it's quoted as an add-on since it depends on the content volume — James can price that in the free consultation. Want me to have him reach out?",
  "A landing page ($400) includes responsive design, custom brand styling, on-page SEO, a lead capture form and call-to-action buttons.",
  "¡Hola! Soy el asistente de DR Web Studio (no James, pero puedo pasarte con él cuando quieras 😊). ¿Qué tipo de negocio tienes?",
  "",
]

describe("claimsHandoff", () => {
  it.each(CLAIMED)("detects a claimed handoff: %s", reply => {
    expect(claimsHandoff(reply)).toBe(true)
  })

  it.each(NOT_CLAIMED)("does not fire on an offer or ordinary reply: %s", reply => {
    expect(claimsHandoff(reply)).toBe(false)
  })

  it("distinguishes the assertion from the question in one reply", () => {
    // The discriminator is grammatical, not lexical: both sentences below
    // contain "reach out".
    expect(claimsHandoff("Want me to have him reach out?")).toBe(false)
    expect(claimsHandoff("He'll reach out today.")).toBe(true)
  })

  it("matches regardless of accents", () => {
    expect(claimsHandoff("Ya le pase tus datos a James.")).toBe(true)
    expect(claimsHandoff("Ya le pasé tus datos a James.")).toBe(true)
  })
})
