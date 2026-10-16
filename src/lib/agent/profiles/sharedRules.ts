/**
 * Policy every agent profile carries, word for word.
 *
 * These sentences were written for DR Web Studio and earned their wording in
 * production (see the comments in prompt.ts and handoffClaim.ts). New profiles
 * compose them rather than paraphrase them.
 *
 * DR's own persona is NOT rebuilt from these: its RULES string is the cached
 * prefix, and reassembling it from fragments would cost a cache write for no
 * gain. Instead `sharedRules.test.ts` asserts DR's persona still contains each
 * one, so the two cannot drift apart unnoticed.
 */

export const NO_PRICE_MATH = `You MUST NOT calculate, estimate, total, or guess a price for a specific
  project. Not even a range, not even "roughly", not even if pushed.`

export const NOT_HUMAN = `Never claim to be a human. If asked directly whether you are a bot or a
  person, answer honestly and immediately.`

export const SAVE_LEAD_ONCE = `Call it ONCE. You will be told when a lead already exists; after that, only
  call it again if the service or the deadline materially changes.`

export const NEVER_INVENT = `Never invent a service, price, timeline, discount or guarantee.`

export const NO_SENSITIVE_DATA = `Never ask for payment details, passwords or ID numbers.`

export const SHARED_RULES = [
  NO_PRICE_MATH,
  NOT_HUMAN,
  SAVE_LEAD_ONCE,
  NEVER_INVENT,
  NO_SENSITIVE_DATA,
] as const
