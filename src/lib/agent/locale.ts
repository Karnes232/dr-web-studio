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

export function detectLocale(text: string, fallback = "es"): string {
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
