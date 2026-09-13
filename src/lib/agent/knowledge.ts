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
 *  2. **Both locales in one block.** Cache reads are ~10x cheaper than fresh
 *     input, so carrying English and Spanish together costs almost nothing and
 *     means one prefix (higher hit rate) plus the ability to answer an English
 *     question about Spanish-only copy.
 *
 * Type-only imports on purpose: this module must stay free of runtime Sanity
 * imports so it can be unit-tested without env vars. The caller does
 * `renderKnowledge(await getAgentKnowledge())`.
 */

const pair = (l: Localized | null | undefined): string =>
  l ? `EN: ${l.en}\nES: ${l.es}` : ""

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

function renderQA(items: AgentQA[], heading: string): string {
  if (!items.length) return ""
  const body = items
    .map(
      q =>
        `Q(en) ${q.question.en}\nA(en) ${q.answer.en}\nQ(es) ${q.question.es}\nA(es) ${q.answer.es}`,
    )
    .join("\n\n")
  return `\n## ${heading}\n\n${body}\n`
}

export function renderKnowledge(kb: AgentKnowledge): string {
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
          `### ${p.title.en} / ${p.title.es} — ${price}`,
          pair(p.description),
          inc.length
            ? `Includes: ${inc.map(f => `${f.text.en} / ${f.text.es}`).join("; ")}`
            : "",
          // `included: false` means the package does NOT have this. Labelled
          // explicitly so the agent can never present it as part of the deal.
          exc.length
            ? `NOT included: ${exc.map(f => `${f.text.en} / ${f.text.es}`).join("; ")}`
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
        return `### ${s.title.en} / ${s.title.es}${bits.length ? ` — ${bits.join(", ")}` : ""}\n${pair(s.description)}`
      })
      .join("\n\n")
    out.push(`\n## Services\n\n${body}\n`)
  }

  // --- Planner services (backs the list_services tool) ----------------------
  if (kb.plannerServices.length) {
    const body = kb.plannerServices
      .map(p => {
        const inc = (p.included ?? []).map(i => i.en).join("; ")
        return [
          `- key=${p.key} | ${p.title.en} / ${p.title.es} | base $${p.basePrice} | ${p.timeline.en}${p.pageBased ? " | priced per page" : ""}`,
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
  out.push(renderQA([...kb.faqs, ...kb.contactFaqs, ...catQs], "FAQ"))

  return out.filter(Boolean).join("\n")
}
