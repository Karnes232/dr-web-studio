/**
 * Seed the Project Planner content in Sanity, GENERATED FROM the live
 * `serviceItem` documents (the same data that powers /our-services). Each
 * serviceItem becomes a `plannerService` (starting price + included items +
 * timeline) and its optional features become per-service `plannerAddon` docs.
 * `plannerConfig` chrome copy is authored bilingually below.
 *
 * Run with the project's env loaded:
 *   node --env-file=.env.local scripts/seedPlanner.mjs
 *
 * Safe to re-run: clears prior planner docs, then recreates from current CMS.
 * IDs are non-dotted (dotted ids are hidden from the public client).
 */
import { createClient } from "@sanity/client"

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-06-01"
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN.\n" +
      "Run: node --env-file=.env.local scripts/seedPlanner.mjs",
  )
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

const l = (en, es) => ({ en, es })

/* ----------------------- service → planner mapping ------------------------ */

// Maintenance is recurring ($/month), excluded from the one-time planner.
const EXCLUDE = new Set(["ongoing-website-maintenance-and-support"])

// Services that get the Size & Content step (page tiers + per-page content).
const PAGE_BASED = new Set([
  "custom-business",
  "e-commerce",
  "web-applications",
  "multilingual-and-international-websites",
  "website-migrations-or-rebuilds",
])

const SLUG_ICON = {
  "custom-business": "Briefcase",
  "landing-pages": "MousePointerClick",
  "e-commerce": "ShoppingCart",
  "web-applications": "AppWindow",
  "headless-cms-development": "Database",
  "multilingual-and-international-websites": "Globe",
  "website-migrations-or-rebuilds": "RefreshCw",
  "api-integrations-and-automation": "Workflow",
}

// Sales-led display order; anything unmapped falls to the end.
const SLUG_ORDER = {
  "custom-business": 1,
  "landing-pages": 2,
  "e-commerce": 3,
  "web-applications": 4,
  "headless-cms-development": 5,
  "multilingual-and-international-websites": 6,
  "website-migrations-or-rebuilds": 7,
  "api-integrations-and-automation": 8,
}

const kebab = s =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const toPrice = raw => {
  const n = parseInt(String(raw).replace(/[^0-9]/g, ""), 10)
  return Number.isFinite(n) ? n : 0
}

const timelineLabel = raw => {
  const n = String(raw || "").trim().replace(/-/, "–")
  return l(`${n} weeks`, `${n} semanas`)
}

/* ------------------------------- config ----------------------------------- */

const config = {
  _id: "plannerConfig",
  _type: "plannerConfig",
  intro: {
    kicker: l("Project Planner", "Planificador de proyectos"),
    title: l("DR Web Studio", "DR Web Studio"),
    subtitle: l(
      "Pick a service, add what you need, and get an instant starting price.",
      "Elige un servicio, añade lo que necesites y obtén un precio inicial al instante.",
    ),
    timeLabel: l("About 2 minutes", "Unos 2 minutos"),
  },
  nav: {
    backLabel: l("Back", "Atrás"),
    continueLabel: l("Continue", "Continuar"),
    submitLabel: l("Get my estimate", "Obtener mi estimado"),
    skipLabel: l("Skip — no add-ons", "Omitir — sin extras"),
    progressTemplate: l("Step {current} of {total}", "Paso {current} de {total}"),
  },
  steps: {
    service: {
      kicker: l("01 · Service", "01 · Servicio"),
      title: l("What do you need?", "¿Qué necesitas?"),
      subtitle: l(
        "Pick the service that fits best — each starts at a base price you can build on.",
        "Elige el servicio que mejor encaje; cada uno parte de un precio base sobre el que puedes construir.",
      ),
    },
    addons: {
      kicker: l("02 · Add-ons", "02 · Extras"),
      title: l("Anything to add?", "¿Algo que añadir?"),
      subtitle: l(
        "Optional extras for this service. Skip anything you're unsure about — we can add it later.",
        "Extras opcionales para este servicio. Omite lo que no tengas claro; podemos añadirlo después.",
      ),
      emptyNote: l(
        "This service has no optional add-ons. Continue to the next step.",
        "Este servicio no tiene extras opcionales. Continúa al siguiente paso.",
      ),
    },
    design: {
      kicker: l("03 · Design", "03 · Diseño"),
      title: l("What should it feel like?", "¿Qué sensación debe transmitir?"),
      subtitle: l(
        "Pick a direction and share a few sites you like — it helps us match your taste.",
        "Elige una dirección y comparte algunos sitios que te gusten; nos ayuda a captar tu estilo.",
      ),
      referencesLabel: l(
        "Sites you'd like to look similar to",
        "Sitios a los que te gustaría parecerte",
      ),
      referencesPlaceholder: l(
        "One URL per line — e.g. https://stripe.com",
        "Una URL por línea — p. ej. https://stripe.com",
      ),
    },
    size: {
      kicker: l("04 · Size & content", "04 · Tamaño y contenido"),
      title: l("How big is the site?", "¿Qué tan grande es el sitio?"),
      subtitle: l(
        "A rough size is fine — we'll confirm the exact scope together.",
        "Un tamaño aproximado está bien; confirmaremos el alcance exacto juntos.",
      ),
      sizeHeading: l("How many pages?", "¿Cuántas páginas?"),
      contentHeading: l("Is your content ready?", "¿Tu contenido está listo?"),
      contentReadyLabel: l("Yes, it's ready", "Sí, está listo"),
      contentReadyDesc: l("I have my text and images.", "Tengo mis textos e imágenes."),
      contentNeedLabel: l("I'll need copywriting", "Necesitaré redacción"),
      contentNeedDesc: l(
        "Write the content for me, priced per page.",
        "Redacta el contenido por mí, con precio por página.",
      ),
    },
    timeline: {
      kicker: l("05 · Timeline", "05 · Plazo"),
      title: l("How soon do you need it?", "¿Para cuándo lo necesitas?"),
      subtitle: l(
        "Here's the typical timeline. Need it faster? Add rush delivery.",
        "Este es el plazo habitual. ¿Lo necesitas antes? Añade entrega urgente.",
      ),
      estimatedTimelineLabel: l("Typical timeline", "Plazo habitual"),
      rushLabel: l("Rush delivery", "Entrega urgente"),
      rushDesc: l(
        "Prioritize my project for a faster turnaround.",
        "Prioriza mi proyecto para una entrega más rápida.",
      ),
      rushTag: l("+20%", "+20%"),
    },
    contact: {
      kicker: l("06 · Almost done", "06 · Casi listo"),
      title: l("Where do we send your estimate?", "¿A dónde enviamos tu estimado?"),
      subtitle: l(
        "We'll reply within one business day with a fixed, itemized quote.",
        "Te responderemos en un día hábil con un presupuesto fijo y detallado.",
      ),
    },
  },
  contactFields: {
    name: {
      label: l("Your name", "Tu nombre"),
      placeholder: l("Jane Rivera", "Ana Rivera"),
    },
    email: {
      label: l("Email", "Correo electrónico"),
      placeholder: l("jane@company.com", "ana@empresa.com"),
      note: l("So we can send your quote.", "Para poder enviarte tu presupuesto."),
    },
    company: {
      label: l("Business name", "Nombre del negocio"),
      placeholder: l("Optional", "Opcional"),
    },
    message: {
      label: l("Anything else?", "¿Algo más?"),
      placeholder: l(
        "Links, references, questions — anything that helps.",
        "Enlaces, referencias, preguntas; lo que sea útil.",
      ),
    },
    nameInvalid: l(
      "Enter a valid email so we can reach you.",
      "Ingresa un correo válido para poder contactarte.",
    ),
    reassurance: l(
      "Free, no obligation. We'll never share your email or send spam.",
      "Gratis y sin compromiso. Nunca compartiremos tu correo ni enviaremos spam.",
    ),
  },
  estimatePanel: {
    kicker: l("Your estimate", "Tu estimado"),
    startingFromLabel: l("Starting from", "Desde"),
    ballparkNote: l(
      "Updates as you choose · final quote after we talk",
      "Se actualiza con tus elecciones · presupuesto final tras hablar",
    ),
    includedHeading: l("Included in your base", "Incluido en tu base"),
    timelineLabel: l("Timeline", "Plazo"),
    contentLine: l("Content & copywriting", "Contenido y redacción"),
    rushLine: l("Rush delivery (+{pct}%)", "Entrega urgente (+{pct}%)"),
    emptyBody: l(
      "Pick a service to start your estimate. Each choice updates the total in real time.",
      "Elige un servicio para empezar tu estimado. Cada elección actualiza el total en tiempo real.",
    ),
    footnote: l(
      "A starting point from your choices. Your final quote is fixed after we talk — no surprises.",
      "Un punto de partida según tus elecciones. Tu presupuesto final se fija después de hablar; sin sorpresas.",
    ),
    mobileKicker: l("Estimate", "Estimado"),
    mobileCta: l("View breakdown", "Ver desglose"),
  },
  confirmation: {
    headingTemplate: l("Your plan is ready, {name}.", "Tu plan está listo, {name}."),
    subtitle: l(
      "Here's the shape of your project. We've sent a copy to your inbox and we'll follow up within one business day.",
      "Esta es la forma de tu proyecto. Enviamos una copia a tu correo y te contactaremos en un día hábil.",
    ),
    estKicker: l("Estimated investment", "Inversión estimada"),
    estNote: l(
      "A starting point, fixed once we confirm scope on a short call.",
      "Un punto de partida, fijo una vez confirmemos el alcance en una breve llamada.",
    ),
    nextTitle: l("What happens next", "Qué sigue"),
    nextSteps: [
      { _key: "n1", title: l("We review your plan.", "Revisamos tu plan."), body: l("Within one business day.", "En un día hábil.") },
      { _key: "n2", title: l("You get a fixed quote.", "Recibes un presupuesto fijo."), body: l("Itemized, no surprises.", "Detallado, sin sorpresas.") },
      { _key: "n3", title: l("We book a short call.", "Agendamos una breve llamada."), body: l("To lock scope and timeline.", "Para definir el alcance y el plazo.") },
    ],
    footTemplate: l(
      "Questions in the meantime? Email {email}.",
      "¿Preguntas mientras tanto? Escribe a {email}.",
    ),
    restartLabel: l("Start over", "Empezar de nuevo"),
  },
  estimateSettings: {
    currencyCode: "USD",
    currencySymbol: "$",
    rushPct: 0.2,
    rounding: 50,
    contentPerPagePrice: 30,
  },
}

/* --------------------- design styles + size tiers ------------------------- */

const designStyles = [
  ["minimal", l("Clean & minimal", "Limpio y minimalista"), l("Calm, spacious, content-first.", "Tranquilo, espacioso y centrado en el contenido.")],
  ["bold", l("Modern & bold", "Moderno y audaz"), l("Strong type, color, and motion.", "Tipografía fuerte, color y movimiento.")],
  ["corporate", l("Corporate & professional", "Corporativo y profesional"), l("Structured and trustworthy.", "Estructurado y confiable.")],
  ["playful", l("Playful & creative", "Divertido y creativo"), l("Friendly, expressive, full of personality.", "Amigable, expresivo y con personalidad.")],
  ["editorial", l("Elegant & editorial", "Elegante y editorial"), l("Refined, typographic, magazine-like.", "Refinado, tipográfico, estilo revista.")],
].map(([key, title, description], i) => ({
  _id: `planner-design-${key}`,
  _type: "plannerDesignStyle",
  key,
  title,
  description,
  order: i + 1,
}))

// Lighter tier adds; representative page counts drive the per-page content calc.
const sizeTiers = [
  ["up-to-5", l("Up to 5 pages", "Hasta 5 páginas"), 0, 5],
  ["6-10", l("6–10 pages", "6–10 páginas"), 200, 10],
  ["11-20", l("11–20 pages", "11–20 páginas"), 500, 20],
  ["20-plus", l("20+ pages", "Más de 20 páginas"), 900, 30],
].map(([key, label, priceModifier, pages], i) => ({
  _id: `planner-size-${key}`,
  _type: "plannerSizeTier",
  key,
  label,
  priceModifier,
  pages,
  order: i + 1,
}))

/* --------------------------------- run ------------------------------------ */

const SERVICE_ITEM_QUERY = `*[_type == "serviceItem"]{
  "slug": slug.current,
  title,
  description,
  priceRange,
  timeline,
  "standard": pageContent.features.standardFeatures[]{ name },
  "optional": pageContent.features.optionalFeatures[]{ name, description, price }
}`

const OLD_TYPES = [
  "plannerWebsiteType",
  "plannerScopeOption",
  "plannerDesignStyle",
  "plannerFeature",
  "plannerTimelineOption",
  "plannerBudgetBand",
  "plannerService",
  "plannerAddon",
  "plannerDesignStyle",
  "plannerSizeTier",
]

async function run() {
  const items = await client.fetch(SERVICE_ITEM_QUERY)
  const services = []
  const addons = []

  for (const item of items) {
    if (!item.slug || EXCLUDE.has(item.slug)) continue
    const key = item.slug

    services.push({
      _id: `planner-service-${key}`,
      _type: "plannerService",
      key,
      title: item.title,
      description: item.description,
      icon: SLUG_ICON[key] || "Briefcase",
      basePrice: toPrice(item.priceRange),
      pageBased: PAGE_BASED.has(key),
      timeline: timelineLabel(item.timeline),
      included: (item.standard || [])
        .filter(s => s?.name)
        .map((s, i) => ({ _key: `inc${i}`, en: s.name.en, es: s.name.es })),
      slug: key,
      order: SLUG_ORDER[key] ?? 99,
    })

    ;(item.optional || []).forEach((opt, i) => {
      if (!opt?.name) return
      const addonKey = kebab(opt.name.en)
      addons.push({
        _id: `planner-addon-${key}-${addonKey}`,
        _type: "plannerAddon",
        key: addonKey,
        service: key,
        title: opt.name,
        description: opt.description || undefined,
        price: typeof opt.price === "number" ? opt.price : toPrice(opt.price),
        order: i + 1,
      })
    })
  }

  // Clear all prior planner option docs (old + current), keep config replaced.
  await client.delete({ query: `*[_type in [${OLD_TYPES.map(t => `"${t}"`).join(",")}]]` })

  const docs = [config, ...services, ...addons, ...designStyles, ...sizeTiers]
  const tx = client.transaction()
  docs.forEach(doc => tx.createOrReplace(doc))
  await tx.commit()

  console.log(
    `Seeded planner: 1 config, ${services.length} services, ${addons.length} add-ons, ${designStyles.length} design styles, ${sizeTiers.length} size tiers into ${dataset}.`,
  )
  console.log(
    "Page-based:",
    services.filter(s => s.pageBased).map(s => s.key).join(", "),
  )
  console.log("Services:", services.map(s => `${s.key} ($${s.basePrice})`).join(", "))
}

run().catch(err => {
  console.error("Seed failed:", err.message || err)
  process.exit(1)
})
