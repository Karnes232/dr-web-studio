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
