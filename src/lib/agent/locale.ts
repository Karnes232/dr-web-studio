/**
 * Pick the conversation language from the customer's first message.
 *
 * Detected ONCE and then persisted to `conversations.locale` — never re-run per
 * turn. Re-detecting every message is what makes these bots flip language
 * mid-conversation, which reads as broken.
 *
 * Deliberately crude: Claude replies in whatever language the customer writes
 * regardless, so this only decides the stored locale (used for the lead record
 * and the greeting). Spanish is the default because the Dominican market is the
 * primary audience.
 */

const SPANISH =
  /\b(hola|buenas|buenos|gracias|necesito|quiero|quisiera|cuanto|cuánto|cuesta|precio|pagina|página|sitio|web|negocio|empresa|tienda|por favor|me interesa|saludos|disculpe|puede|podría|tengo|para|como|cómo)\b/i
const ENGLISH =
  /\b(hello|hi|hey|thanks|thank you|need|want|would like|how much|cost|price|website|site|business|shop|store|please|interested|good morning|good afternoon|can you|could you|i have|looking for)\b/i

const GERMAN =
  /\b(hallo|guten|tag|morgen|abend|danke|bitte|ich|wir|möchte|moechte|würde|wuerde|gerne|wie viel|wieviel|kostet|preis|tauchen|tauchkurs|kurs|und|nicht|haben|können|koennen|sind|ist|für|fuer|mit|einen|eine)\b/gi
const FRENCH =
  /\b(bonjour|bonsoir|salut|merci|je|nous|vous|voudrais|voudrions|combien|coûte|coute|prix|plongée|plongee|cours|avec|pour|est-ce|c'est|s'il vous plaît|s'il vous plait|une|des|sommes|avons)\b/gi

/** Characters only German or only French uses, among these four languages. */
const GERMAN_CHARS = /[ßäö]/i
const FRENCH_CHARS = /[çœèêàâîôûëï]/i

/**
 * Detect among the languages a tenant serves.
 *
 * `allowed` comes from `tenants.locales`. A tenant that serves only Spanish
 * and English (DR Web Studio) goes through exactly the original logic, so its
 * stored locales do not shift. German and French are considered only for a
 * tenant that lists them: a dive center in Punta Cana hears all four.
 */
export function detectLocale(
  text: string,
  fallback = "es",
  allowed: readonly string[] = ["es", "en"],
): string {
  const multi = allowed.includes("de") || allowed.includes("fr")
  if (!multi) return detectSpanishOrEnglish(text, fallback)
  return detectAmong(text, fallback, allowed)
}

function detectAmong(
  text: string,
  fallback: string,
  allowed: readonly string[],
): string {
  const t = (text ?? "").trim()
  if (!t) return fallback

  const count = (re: RegExp) => (t.match(re) ?? []).length
  const scores: Record<string, number> = {
    es: count(new RegExp(SPANISH.source, "gi")),
    en: count(new RegExp(ENGLISH.source, "gi")),
    de: count(GERMAN),
    fr: count(FRENCH),
  }

  // Script signals beat word counts. "ü" is German or Spanish (pingüino),
  // so it only counts for German alongside German words.
  if (allowed.includes("es") && /[ñ¿¡]/.test(t)) return "es"
  if (allowed.includes("de") && GERMAN_CHARS.test(t)) return "de"
  if (allowed.includes("de") && /ü/i.test(t) && scores.de > 0) return "de"
  if (allowed.includes("fr") && FRENCH_CHARS.test(t)) return "fr"

  let best = fallback
  let bestScore = 0
  let tie = false
  for (const lang of allowed) {
    const score = scores[lang] ?? 0
    if (score > bestScore) {
      best = lang
      bestScore = score
      tie = false
    } else if (score === bestScore && score > 0) {
      tie = true
    }
  }
  if (bestScore === 0 || tie) {
    // Accents shared by Spanish and French (á é í ó ú): Spanish unless French
    // words say otherwise — the tie case above.
    if (allowed.includes("es") && /[áéíóú]/i.test(t) && scores.fr === 0) {
      return "es"
    }
    return fallback
  }
  return best
}

function detectSpanishOrEnglish(text: string, fallback: string): string {
  const t = (text ?? "").trim()
  if (!t) return fallback

  const es = (t.match(SPANISH) ?? []).length
  const en = (t.match(ENGLISH) ?? []).length

  // Accented characters and inverted punctuation are strong Spanish signals
  // and effectively never appear in English.
  const spanishChars = /[ñáéíóúü¿¡]/i.test(t)

  if (spanishChars) return "es"
  if (en > 0 && es === 0) return "en"
  if (es > 0 && en === 0) return "es"
  return fallback
}
