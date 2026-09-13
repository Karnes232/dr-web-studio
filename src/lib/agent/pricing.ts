/**
 * Claude list price, USD per million tokens.
 *
 * Deliberately its own module with no imports: the rate table is a standalone
 * fact, and keeping it free of the agent's dependency graph is what makes it
 * testable — `claude.ts` reaches the Sanity client transitively and throws at
 * import time without env vars.
 *
 * NOT keyed by model. `tenant.model` is never consulted when computing cost, so
 * these rates are only correct while the agent runs on Opus 5. See the note
 * beside the `model:` line in `claude.ts` before changing that.
 *
 * `cacheWrite` and the request's cache TTL are only correct **together**. A
 * 5-minute cache write bills at 1.25x input; a 1-hour write bills at 2x. This
 * constant sat at 6.25 — the 5-minute rate — while the request has always sent
 * `ttl: "1h"`, so every cache write was under-reported by 37.5%. That error
 * propagated into `messages.cost_usd`, `conversations.cost_usd`,
 * `tenants.cost_this_month_usd` and therefore the monthly spend cap, which let
 * spending run past its limit before tripping. If the ttl changes, change this.
 */
export const PRICE = {
  input: 5.0,
  output: 25.0,
  cacheRead: 0.5, // 0.1x input
  cacheWrite: 10.0, // 2x input — matches `ttl: "1h"` on the request
} as const
