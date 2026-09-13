import type {
  AgentKnowledge,
  AgentQA,
  Localized,
} from "@/sanity/queries/agent/agentKnowledge"

/**
 * Renders the Sanity knowledge base into the cached system-prompt block.
 *
 * Two hard rules:
 *
 *  1. **Deterministic.** No timestamps, no `Date`, no unordered iteration. The
 *     byte-stability of this string IS the prompt cache hit rate — anything
 *     that varies per request silently turns a $0.008 turn into a $0.10 one.
 *  2. **One locale per block.** Carrying both languages looked nearly free on
 *     the theory that cache reads are ~10x cheaper than fresh input — but the
 *     first live conversation showed the cache *write* dominates at sparse
 *     traffic: 22,474 tokens cost $0.1405 to write and only $0.011 to read, and
 *     a business getting a few chats a day rarely gets two inside one TTL. So
 *     prefix size is the lever, and a conversation only ever needs one
 *     language. Two cache entries, each half the size.
 *
 * Type-only imports on purpose: this module must stay free of runtime Sanity
 * imports so it can be unit-tested without env vars. The caller does
 * `renderKnowledge(await getAgentKnowledge())`.
 */

type Lang = "en" | "es" | "both"

const one = (l: Localized | null | undefined, lang: Lang): string =>
  !l ? "" : lang === "both" ? `${l.en} / ${l.es}` : (l[lang] ?? l.en)

const pair = (l: Localized | null | undefined, lang: Lang): string =>
  !l ? "" : lang === "both" ? `EN: ${l.en}\nES: ${l.es}` : (l[lang] ?? l.en)

/** CMS stores bare numbers with no symbol — "400", "1,250". */
const money = (raw: string | null | undefined): string => {
  if (!raw) return ""
  const t = raw.trim()
  return /^[\d.,]/.test(t) ? `$${t}` : t
}

/** CMS stores bare ranges with no unit — "2-3", but also "Ongoing". */
const weeks = (raw: string | null | undefined): string => {
  if (!raw) return ""
  const t = raw.trim()
  return /^\d/.test(t) ? `${t} weeks` : t
}

function renderQA(items: AgentQA[], heading: string, lang: Lang): string {
  if (!items.length) return ""
  const body = items
    .map(q =>
      lang === "both"
        ? `Q(en) ${q.question.en}\nA(en) ${q.answer.en}\nQ(es) ${q.question.es}\nA(es) ${q.answer.es}`
        : `Q ${q.question[lang] ?? q.question.en}\nA ${q.answer[lang] ?? q.answer.en}`,
    )
    .join("\n\n")
  return `\n## ${heading}\n\n${body}\n`
}

export function renderKnowledge(
  kb: AgentKnowledge,
  lang: Lang = "both",
): string {
  const out: string[] = ["# DR WEB STUDIO — KNOWLEDGE BASE"]

  // --- Contact -------------------------------------------------------------
  const l = kb.layout
  if (l) {
    const where = [
      l.address?.addressLocality,
      l.address?.addressRegion,
      l.address?.addressCountry,
    ]
      .filter(Boolean)
      .join(", ")
    const hours = (l.openingHours ?? [])
      .map(h => `${h.dayOfWeek.join("/")} ${h.opens}-${h.closes}`)
      .join("; ")
    out.push(
      [
        "\n## Business",
        `Name: ${l.companyName ?? "DR Web Studio"}`,
        l.email ? `Email: ${l.email}` : "",
        l.telephone ? `Phone/WhatsApp: +${l.telephone}` : "",
        where ? `Location: ${where}` : "",
        hours ? `Opening hours (America/Santo_Domingo): ${hours}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
  }

  // --- Packages ------------------------------------------------------------
  // These are the public pricing-page prices and may be quoted verbatim.
  if (kb.packages.length) {
    const body = kb.packages
      .map(p => {
        const price = `${money(p.price)}${p.pricePeriod ? p.pricePeriod.en : ""}`
        const inc = (p.features ?? []).filter(f => f.included)
        const exc = (p.features ?? []).filter(f => !f.included)
        return [
          `### ${one(p.title, lang)} — ${price}`,
          pair(p.description, lang),
          inc.length
            ? `Includes: ${inc.map(f => one(f.text, lang)).join("; ")}`
            : "",
          // `included: false` means the package does NOT have this. Labelled
          // explicitly so the agent can never present it as part of the deal.
          exc.length
            ? `NOT included: ${exc.map(f => one(f.text, lang)).join("; ")}`
            : "",
        ]
          .filter(Boolean)
          .join("\n")
      })
      .join("\n\n")
    out.push(
      `\n## Published packages (public prices — safe to state exactly)\n\n${body}\n`,
    )
  }

  // --- Services ------------------------------------------------------------
  if (kb.services.length) {
    const body = kb.services
      .map(s => {
        const bits = [
          s.priceRange ? `from ${money(s.priceRange)}` : "",
          s.timeline ? weeks(s.timeline) : "",
        ].filter(Boolean)
        return `### ${one(s.title, lang)}${bits.length ? ` — ${bits.join(", ")}` : ""}\n${pair(s.description, lang)}`
      })
      .join("\n\n")
    out.push(`\n## Services\n\n${body}\n`)
  }

  // --- Planner services (backs the list_services tool) ----------------------
  if (kb.plannerServices.length) {
    const body = kb.plannerServices
      .map(p => {
        const inc = (p.included ?? []).map(i => one(i, lang)).join("; ")
        return [
          `- key=${p.key} | ${one(p.title, lang)} | base $${p.basePrice} | ${one(p.timeline, lang)}${p.pageBased ? " | priced per page" : ""}`,
          inc ? `  includes: ${inc}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      })
      .join("\n")
    out.push(
      `\n## Service catalogue (starting prices — a real project is quoted after a call)\n\n${body}\n`,
    )
  }

  // --- FAQs ----------------------------------------------------------------
  // Three separate Sanity types, flattened: the agent has no reason to know
  // they're modelled apart.
  const catQs = kb.faqCategories.flatMap(c => c.questions ?? [])
  out.push(renderQA([...kb.faqs, ...kb.contactFaqs, ...catQs], "FAQ", lang))

  return out.filter(Boolean).join("\n")
}
