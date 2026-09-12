import { describe, expect, it } from "vitest"
import { render } from "@react-email/render"
import ProjectPlannerCustomerEmail, {
  customerEmailSubject,
} from "./ProjectPlannerCustomerEmail"
import type { PlannerConfig } from "@/sanity/queries/project-planner/plannerConfig"

// Mirrors the live `plannerConfig.confirmation` document.
const confirmation = {
  headingTemplate: {
    en: "Your plan is ready, {name}.",
    es: "Tu plan está listo, {name}.",
  },
  subtitle: { en: "unused in email", es: "no usado en el correo" },
  estKicker: { en: "Estimated investment", es: "Inversión estimada" },
  estNote: {
    en: "A starting point, fixed once we confirm scope on a short call.",
    es: "Un punto de partida, fijo una vez confirmemos el alcance en una breve llamada.",
  },
  nextTitle: { en: "What happens next", es: "Qué sigue" },
  nextSteps: [
    {
      title: { en: "We review your plan.", es: "Revisamos tu plan." },
      body: { en: "Within one business day.", es: "En un día hábil." },
    },
    {
      title: {
        en: "You get a fixed quote.",
        es: "Recibes un presupuesto fijo.",
      },
      body: { en: "Itemized, no surprises.", es: "Detallado, sin sorpresas." },
    },
  ],
  footTemplate: {
    en: "Questions in the meantime? Email {email}.",
    es: "¿Preguntas mientras tanto? Escribe a {email}.",
  },
  restartLabel: { en: "Start over", es: "Empezar de nuevo" },
} as unknown as PlannerConfig["confirmation"]

const base = {
  name: "Ana",
  confirmation,
  contactEmail: "james@dr-webstudio.com",
  service: "E-commerce",
  addons: ["WhatsApp Business API Integration"],
  size: "6-10 pages",
  timeline: "4-5 weeks",
  estimateTotal: 1100,
  currencySymbol: "$",
  items: [
    { key: "base", label: "E-commerce", amount: 900 },
    { key: "size", label: "6-10 pages", amount: 200 },
  ],
}

describe("ProjectPlannerCustomerEmail", () => {
  it("renders the Spanish copy for an es lead", async () => {
    const html = await render(
      ProjectPlannerCustomerEmail({ ...base, locale: "es" }),
    )

    expect(html).toContain("Tu plan está listo, Ana.")
    expect(html).toContain("Inversión estimada")
    expect(html).toContain("$1,100")
    // The estimate must never read as a fixed quote.
    expect(html).toContain("Un punto de partida")
    expect(html).toContain("Qué sigue")
    expect(html).toContain("Revisamos tu plan.")
    expect(html).toContain("Escribe a james@dr-webstudio.com")
    // No unreplaced placeholders.
    expect(html).not.toContain("{name}")
    expect(html).not.toContain("{email}")
  })

  it("renders the English copy for an en lead", async () => {
    const html = await render(
      ProjectPlannerCustomerEmail({ ...base, locale: "en" }),
    )

    expect(html).toContain("Your plan is ready, Ana.")
    expect(html).toContain("Estimated investment")
    expect(html).toContain("A starting point")
    expect(html).toContain("What happens next")
    expect(html).not.toContain("{name}")
  })

  it("includes what the customer actually selected", async () => {
    const html = await render(
      ProjectPlannerCustomerEmail({ ...base, locale: "en" }),
    )

    expect(html).toContain("E-commerce")
    expect(html).toContain("WhatsApp Business API Integration")
    expect(html).toContain("6-10 pages")
    expect(html).toContain("4-5 weeks")
  })

  it("still renders when optional scope fields are missing", async () => {
    const html = await render(
      ProjectPlannerCustomerEmail({
        ...base,
        locale: "es",
        addons: [],
        size: undefined,
        timeline: "",
      }),
    )

    expect(html).toContain("Tu plan está listo, Ana.")
    expect(html).toContain("$1,100")
  })

  it("localises the subject line", () => {
    expect(customerEmailSubject("Ana", "es")).toBe(
      "Tu plan de proyecto, Ana — DR Web Studio",
    )
    expect(customerEmailSubject("Ana", "en")).toBe(
      "Your project plan, Ana — DR Web Studio",
    )
  })
})
