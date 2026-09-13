/**
 * Content-based spam detection for the public lead forms.
 *
 * BotPoison is NOT broken and is not what this replaces. It fails closed
 * (`src/lib/botpoison-verify.ts`) and the submissions that got through had
 * genuinely solved its challenge — it is proof-of-work, a cost deterrent, and a
 * headless browser passes it every time. This is the layer underneath: what was
 * actually typed.
 *
 * Every weight below was derived from three real submissions captured on
 * 2026-09-13, not invented. Pure by design so those payloads can be replayed in
 * tests verbatim.
 */

export interface SpamCheckInput {
  name?: string
  company?: string
  message?: string
}

export interface SpamVerdict {
  spam: boolean
  score: number
  reasons: string[]
}

/** Reached by all three captured payloads; the digits-only rule alone hits it. */
export const SPAM_THRESHOLD = 3

/** `y` counts as a vowel deliberately — it lowers the false-positive rate. */
const VOWELS = /[aeiouáéíóúüàèìòùâêîôûy]/i
const LETTER = /\p{L}/u

/**
 * Longest run of consecutive consonants in any single word.
 *
 * Threshold is 5, not 4: real surnames reach 4 ("Schmidt" -> "Schm"), and
 * Spanish essentially never exceeds 3. All three captured names contain a word
 * with 5-6 ("Fctnqb", "gvdkfq", "Xbpcw").
 */
function longestConsonantRun(text: string): number {
  let best = 0
  for (const word of text.split(/\s+/)) {
    let run = 0
    for (const ch of word) {
      if (!LETTER.test(ch)) {
        run = 0
        continue
      }
      if (VOWELS.test(ch)) run = 0
      else best = Math.max(best, ++run)
    }
  }
  return best
}

function looksGenerated(text: string | undefined): boolean {
  const t = (text ?? "").trim()
  if (t.length < 5) return false
  return longestConsonantRun(t) >= 5
}

export function isSpammySubmission(input: SpamCheckInput): SpamVerdict {
  const reasons: string[] = []
  let score = 0

  const message = (input.message ?? "").trim()
  const name = (input.name ?? "").trim()
  const company = (input.company ?? "").trim()

  // Strongest signal. All three bots sent a bare 10-digit number as the
  // message, and the form already has a dedicated phone field, so a message
  // with no letters in it is never a real enquiry.
  if (message && !LETTER.test(message)) {
    score += 3
    reasons.push("message contains no letters")
  }

  // One token is not a message. Weak on its own — "Hola" would score 1.
  if (message && !/\s/.test(message) && message.length < 25) {
    score += 1
    reasons.push("message is a single short token")
  }

  const nameGenerated = looksGenerated(name)
  if (nameGenerated || looksGenerated(company)) {
    score += 2
    reasons.push("name or company looks machine-generated")
  }

  // A US company suffix is unremarkable by itself — plenty of real DR
  // businesses are LLCs — so it only counts alongside a generated-looking name.
  if (nameGenerated && /\b(LLC|L\.L\.C\.|Inc|Ltd|GmbH)\.?$/i.test(company)) {
    score += 1
    reasons.push("US company suffix alongside a generated name")
  }

  return { spam: score >= SPAM_THRESHOLD, score, reasons }
}
