import { describe, expect, it } from "vitest"
import { detectLocale } from "./locale"

describe("detectLocale", () => {
  it("reads real Dominican WhatsApp openers as Spanish", () => {
    for (const t of [
      "Hola, cuanto cuesta una pagina web?",
      "buenas, necesito un sitio para mi negocio",
      "Me interesa una tienda online",
      "Buenos días, quisiera información por favor",
    ]) {
      expect(detectLocale(t)).toBe("es")
    }
  })

  it("reads English openers as English", () => {
    for (const t of [
      "Hi, how much for a website?",
      "Hello, I need a site for my business",
      "I'm interested in an online store",
    ]) {
      expect(detectLocale(t)).toBe("en")
    }
  })

  it("treats accents and inverted punctuation as decisive Spanish", () => {
    // These effectively never appear in English, so they beat keyword counts.
    expect(detectLocale("¿Cuánto cuesta?")).toBe("es")
    expect(detectLocale("Diseño")).toBe("es")
  })

  it("falls back rather than guessing on ambiguous input", () => {
    expect(detectLocale("ok")).toBe("es")
    expect(detectLocale("")).toBe("es")
    expect(detectLocale("👋")).toBe("es")
    expect(detectLocale("ok", "en")).toBe("en")
  })

  it("handles the prefilled text from the site's own WhatsApp links", () => {
    // src/i18n/locales/*/translation.json → landingPage.whatsappMessage
    expect(
      detectLocale("¡Hola! Me interesa un sitio web para mi negocio."),
    ).toBe("es")
    expect(
      detectLocale("Hi! I'm interested in a website for my business."),
    ).toBe("en")
  })
})

describe("detectLocale — four-language tenant", () => {
  // Grand Bay serves tourists in English, Spanish, German and French.
  // SYNTHETIC openers until real ones exist in the messages table.
  const ALL = ["en", "es", "de", "fr"] as const
  const detect = (t: string) => detectLocale(t, "en", ALL)

  it("reads German", () => {
    for (const t of [
      "Hallo, wie viel kostet der Tauchkurs?",
      "Guten Tag, ich möchte tauchen gehen",
      "Ist der Open Water Kurs für Anfänger?",
      "Grüße aus München",
    ]) {
      expect(detect(t)).toBe("de")
    }
  })

  it("reads French", () => {
    for (const t of [
      "Bonjour, combien coûte la plongée ?",
      "Salut, je voudrais faire un baptême",
      "Merci, nous sommes deux plongeurs",
      "Est-ce que vous avez des cours pour débutants ?",
    ]) {
      expect(detect(t)).toBe("fr")
    }
  })

  it("still reads Spanish and English", () => {
    expect(detect("Hola, cuánto cuesta el curso?")).toBe("es")
    expect(detect("¿Tienen buceo con tiburones?")).toBe("es")
    expect(detect("Hi, how much is the shark dive?")).toBe("en")
  })

  it("does not take a Spanish ü for German", () => {
    expect(detect("Vimos un pingüino, hola")).toBe("es")
  })

  it("falls back on nothing to go on", () => {
    expect(detect("👍")).toBe("en")
    expect(detect("")).toBe("en")
  })

  it("never returns a language the tenant does not serve", () => {
    // A Spanish/English tenant (DR) sends German to its fallback logic.
    expect(["es", "en"]).toContain(
      detectLocale("Hallo, wie viel kostet das?", "es", ["es", "en"]),
    )
    expect(
      detectLocale("Bonjour, combien ?", "es", ["es", "en", "de"]),
    ).not.toBe("fr")
  })

  it("leaves DR's two-language path exactly as it was", () => {
    // Same inputs, with and without the explicit list.
    for (const t of [
      "Hola, cuanto cuesta una pagina web?",
      "Hi, how much for a website?",
      "Diseño",
      "ok",
    ]) {
      expect(detectLocale(t, "es", ["es", "en"])).toBe(detectLocale(t))
    }
  })
})
