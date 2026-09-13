/**
 * Did the agent *say* it handed the conversation over?
 *
 * The model will happily write "I've passed your details to James" without
 * calling `escalate_to_human`, which leaves a real customer waiting on a
 * handoff that never happened and James unaware anyone is waiting. Instructions
 * are advice; this is the check that turns the claim into something detectable.
 *
 * The hard part is that the agent legitimately *offers* a handoff constantly —
 * "want me to have him reach out?" — using the same vocabulary as the claim.
 * The discriminator is grammatical, not lexical: an offer is a question, a
 * claim is an assertion. So questions are stripped before matching.
 *
 * Every string in the test table is copied verbatim from real agent output.
 */

/**
 * Phrases that assert a handoff has happened or is committed. Deliberately not
 * just "James" — the agent mentions him in ordinary sentences ("James does a
 * free 30-minute consultation") with no handoff implied.
 */
const CLAIM_PHRASES = [
  // English
  "passed your details",
  "passed your info",
  "passed you to",
  "passed this to",
  "passed it to",
  "handed this to",
  "handed you over",
  "will reach out",
  "will be in touch",
  "will get in touch",
  "will contact you",
  "will pick this up",
  "will pick it up",
  "will follow up",
  "he'll reach out",
  "he will reach out",
  // Spanish
  "le pasé",
  "se lo pasé",
  "le paso",
  "se lo paso",
  "te paso con",
  "pasé tus datos",
  "paso tus datos",
  "te contactará",
  "te contactara",
  "se pondrá en contacto",
  "se pondra en contacto",
  "te escribirá",
  "te escribira",
  "lo retoma",
  "retoma directamente",
  "se comunicará",
  "se comunicara",
]

/**
 * Split into sentences and drop the questions.
 *
 * "Want me to have him reach out?" and "Anything else before I pass you to
 * James?" both contain claim vocabulary and both are offers. Keeping them would
 * fire the safety net on almost every turn.
 */
function assertions(reply: string): string {
  return reply
    .split(/(?<=[.!?])\s+|\n+/)
    .filter(s => !s.trim().endsWith("?"))
    .join(" ")
}

/** Strip accents so "pasé" matches "pase" and vice versa. */
const fold = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")

export function claimsHandoff(reply: string): boolean {
  if (!reply.trim()) return false
  const text = fold(assertions(reply))
  return CLAIM_PHRASES.some(p => text.includes(fold(p)))
}
