import type {
  GbFaq,
  GrandBayKnowledge,
} from "@/sanity/queries/agent/grandbayKnowledge"
import type { CatalogueEntry } from "../types"

/**
 * Grand Bay of the Sea's knowledge block: system[1], the cached prefix.
 *
 * Pure and deterministic — the same input must produce the same bytes, or
 * every conversation pays a cache write. No dates, no locale-dependent
 * formatting, nothing read from the environment.
 *
 * Prices and deposits are rendered as their own labelled lines, because FAQ
 * prose in the CMS can lag behind the price fields (live example: a Bayahibe
 * answer says Advanced Open Water is "$400" while the course is $449). The
 * persona tells the model the labelled lines win.
 */

export const SITE = "https://www.grandbay-puntacana.com"

/**
 * Facts that live in Grand Bay's site CODE, not their CMS, copied here.
 * If they change these in code, this copy goes stale — re-check on any change
 * to their `business.ts`, booking popups or tour date picker.
 */
const HOUSE_FACTS = `## Business
Name: Grand Bay of the Sea (PADI dive center #27147)
Address: Carretera Cabeza de Toro, Punta Cana, La Altagracia, Dominican Republic
Map: https://maps.app.goo.gl/tAB86MjFxiF7Hefj7
Email: grandbayofthesea@gmail.com
Phone (voice calls): +1 829-723-9338
Website: ${SITE}
Areas served: Punta Cana, Bávaro, Cap Cana
Dive instruction is given in English, Spanish and French. There are no German-speaking instructors.

## How booking works
- Every activity is booked on its own page with "Book Now": the customer pays a deposit online through PayPal (card or PayPal account), and pays the balance on the day.
- Courses: the online deposit is half of one person's course price, shown per course below.
- Trips, local dives, the shark dive and fishing: a flat deposit per booking, shown below.
- To ask without paying, the customer can use the contact page (${SITE}/contact); the team confirms the spot and sends a deposit link.
- Pages exist in English (no prefix), Spanish (/es), German (/de) and French (/fr). Example: ${SITE}/de/courses/openwater
- Departure days for the day trips (from the booking calendar): Catalina Island — Monday, Wednesday, Friday. Bayahibe — Tuesday, Thursday. Saona Island — Monday, Friday. Shark dive — every day.`

/** "$1,250" — fixed format, independent of the runtime's locale data. */
export function usd(n: number): string {
  const [whole, cents] = n.toFixed(2).split(".")
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return `$${grouped}${cents === "00" ? "" : `.${cents}`} USD`
}

const line = (label: string, value: string | number | null | undefined) =>
  value === null || value === undefined || value === ""
    ? ""
    : `${label}: ${value}`

function faqBlock(faqs: GbFaq[] | null | undefined): string {
  const items = (faqs ?? []).filter(f => f.q?.trim() && f.a?.trim())
  if (!items.length) return ""
  return [
    "FAQs:",
    ...items.map(f => `Q ${f.q!.trim()}\nA ${f.a!.trim()}`),
  ].join("\n")
}

const join = (...parts: string[]) => parts.filter(Boolean).join("\n")

/** Long CMS prose: trimmed, no runs of blank lines or trailing spaces. */
const prose = (text: string | null | undefined) =>
  (text ?? "")
    .split("\n")
    .map(l => l.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()

/**
 * People on their About page the agent must not mention. James built their
 * site and is listed as "Web & Bookings": named in the prompt, the agent
 * would offer to pass customers to him, and he is DR Web Studio, not the
 * dive center. Handoffs go to "the Grand Bay team".
 */
const HIDDEN_TEAM = /james karnes/i

export function catalogue(kb: GrandBayKnowledge): CatalogueEntry[] {
  const out: CatalogueEntry[] = []
  for (const c of kb.courses ?? []) {
    if (c.slug) out.push({ key: `course:${c.slug}`, label: c.name })
  }
  for (const t of kb.trips ?? []) {
    if (t.slug) out.push({ key: `trip:${t.slug}`, label: t.name })
  }
  if (kb.localDives) out.push({ key: "local-dives", label: "Local dives" })
  if (kb.sharkDive) out.push({ key: "shark-dive", label: "Shark dive" })
  if (kb.fishing) out.push({ key: "fishing", label: "Fishing" })
  if (kb.liveaboards) out.push({ key: "liveaboard", label: "Liveaboard" })
  return out
}

export function renderGrandBayKnowledge(kb: GrandBayKnowledge): string {
  const out: string[] = [
    "# GRAND BAY OF THE SEA — KNOWLEDGE BASE",
    "",
    HOUSE_FACTS,
  ]

  if (kb.contact) {
    out.push(
      "",
      join(
        line("Opening hours", kb.contact.hours),
        kb.contact.hoursNote ?? "",
        kb.contact.intro ?? "",
      ),
    )
  }

  // ---- Catalogue: the only valid service_key values ------------------------
  const cat = catalogue(kb)
  out.push(
    "",
    "## Catalogue (service_key values for save_lead)",
    ...cat.map(c => `- ${c.key} — ${c.label}`),
  )

  // ---- Courses ---------------------------------------------------------------
  if (kb.courses?.length) {
    out.push("", "## PADI courses")
    for (const c of kb.courses) {
      out.push(
        "",
        `### ${c.name} (service_key course:${c.slug})`,
        join(
          c.summary ?? "",
          line("Price", c.price != null ? `${usd(c.price)} per person` : ""),
          line(
            "Online deposit to reserve",
            c.price != null ? usd(c.price / 2) : "",
          ),
          line("Level", c.level),
          line("Duration", c.duration),
          line("Dives", c.dives),
          line("Maximum depth", c.maxDepth),
          line("Note", c.extraInfo),
          `Book: ${SITE}/courses/${c.slug}`,
          c.about?.trim() ? `About this course:\n${prose(c.about)}` : "",
          faqBlock(c.faqs),
        ),
      )
    }
  }

  // ---- Day trips -------------------------------------------------------------
  if (kb.trips?.length) {
    out.push("", "## Dive day trips")
    for (const t of kb.trips) {
      out.push(
        "",
        `### ${t.name} (service_key trip:${t.slug})`,
        join(
          t.privateOnly
            ? "PRIVATE CHARTER ONLY. The total depends on the group — escalate for any price beyond the per-person rates below."
            : "",
          t.summary ?? "",
          line("Price", t.price != null ? `${usd(t.price)} per diver` : ""),
          line(
            "Snorkeler or non-diving companion",
            t.companionPrice != null
              ? `${usd(t.companionPrice)} per person`
              : "",
          ),
          line(
            "Online deposit to reserve",
            t.deposit != null ? `${usd(t.deposit)} per booking` : "",
          ),
          line("Schedule", t.duration),
          line(
            "Included",
            (t.included ?? []).filter(Boolean).join("; ") || null,
          ),
          (t.itinerary ?? []).length
            ? [
                "The day:",
                ...(t.itinerary ?? [])
                  .filter(s => s.step)
                  .map(s => `- ${s.step}${s.detail ? `: ${s.detail}` : ""}`),
              ].join("\n")
            : "",
          line("Note", t.note),
          `Book: ${SITE}/trips/${t.slug}`,
          faqBlock(t.faqs),
        ),
      )
    }
  }

  // ---- Local dives -----------------------------------------------------------
  if (kb.localDives) {
    const l = kb.localDives
    out.push(
      "",
      "## Local dives from Punta Cana (service_key local-dives)",
      join(
        "For certified divers.",
        line(
          "Two-tank dive",
          l.twoTank != null ? `${usd(l.twoTank)} per diver` : "",
        ),
        line(
          "Four-tank package",
          l.fourTank != null ? `${usd(l.fourTank)} per diver` : "",
        ),
        line(
          "Online deposit to reserve",
          l.deposit != null ? `${usd(l.deposit)} per booking` : "",
        ),
        line("Duration", l.duration),
        `Book: ${SITE}/sites`,
        faqBlock(l.faqs),
      ),
    )
  }

  if (kb.diveSites?.length) {
    out.push(
      "",
      "## Dive sites",
      ...kb.diveSites.map(s => {
        const depth =
          s.meters != null
            ? ` — ${s.meters} m${s.feet != null ? ` / ${s.feet} ft` : ""}`
            : ""
        const meta = [s.level, s.location].filter(Boolean).join(", ")
        const nearby = (s.nearby ?? []).filter(Boolean).join(", ")
        return join(
          `- ${s.name}${depth}${meta ? ` (${meta})` : ""}${
            s.summary ? `: ${s.summary}` : ""
          }`,
          s.description?.trim() ? `  ${prose(s.description)}` : "",
          nearby ? `  Nearby sites: ${nearby}` : "",
        )
      }),
    )
  }

  // ---- Marine life -----------------------------------------------------------
  const species = (kb.species ?? []).filter(s => s.name)
  if (species.length) {
    out.push(
      "",
      "## Marine life seen on their dives",
      prose(kb.speciesIntro),
      ...species.map(
        s => `- ${s.name}${s.description ? `: ${prose(s.description)}` : ""}`,
      ),
    )
  }

  // ---- Shark dive ------------------------------------------------------------
  if (kb.sharkDive) {
    const s = kb.sharkDive
    out.push(
      "",
      `## ${s.name ?? "Shark dive"} (service_key shark-dive)`,
      join(
        line("Price", s.price != null ? `${usd(s.price)} per diver` : ""),
        line(
          "Online deposit to reserve",
          s.deposit != null ? `${usd(s.deposit)} per booking` : "",
        ),
        line("Level", s.level),
        line(
          "Requirements",
          (s.included ?? []).filter(Boolean).join("; ") || null,
        ),
        line("Duration", s.duration),
        line("Maximum depth", s.maxDepth),
        `Book: ${SITE}/shark-dive-punta-cana`,
        faqBlock(s.faqs),
      ),
    )
  }

  // ---- Fishing ---------------------------------------------------------------
  if (kb.fishing) {
    const f = kb.fishing
    out.push(
      "",
      `## ${f.name ?? "Fishing"} (service_key fishing)`,
      join(
        line(
          "Shared charter",
          f.price != null ? `${usd(f.price)} per person fishing` : "",
        ),
        line(
          "Spectator (not fishing)",
          f.spectatorPrice != null ? `${usd(f.spectatorPrice)} per person` : "",
        ),
        line(
          "Private charter (whole boat)",
          f.privateCharter != null ? usd(f.privateCharter) : "",
        ),
        line(
          "Online deposit to reserve",
          f.deposit != null ? `${usd(f.deposit)} per booking` : "",
        ),
        line("Duration", f.duration),
        `Book: ${SITE}/fishing-punta-cana`,
      ),
    )
  }

  // ---- Liveaboards -----------------------------------------------------------
  if (kb.liveaboards) {
    const l = kb.liveaboards
    out.push(
      "",
      "## Liveaboard expeditions (service_key liveaboard)",
      join(
        "NO PRICES OR DATES ARE PUBLISHED for liveaboards. Never state or estimate one — escalate any price or availability question.",
        (l.stats ?? [])
          .filter(s => s.value && s.label)
          .map(s => `${s.label}: ${s.value}`)
          .join("\n"),
        l.intro ?? "",
        l.silverBank ? `Silver Bank expedition: ${l.silverBank}` : "",
        l.whaleWatching ? `Whale-watching adventure: ${l.whaleWatching}` : "",
        `Info: ${SITE}/liveaboard-dominican-republic`,
        faqBlock(l.faqs),
      ),
    )
  }

  // ---- General FAQs ----------------------------------------------------------
  for (const g of kb.generalFaqs ?? []) {
    const block = faqBlock(g.faqs)
    if (block) out.push("", `## General questions (${g.page ?? "site"})`, block)
  }

  // ---- Scuba diving in Punta Cana (guide page) -------------------------------
  if (kb.puntaCana) {
    const body = prose(kb.puntaCana.body)
    const faqs = faqBlock(kb.puntaCana.faqs)
    if (body || faqs) {
      out.push(
        "",
        "## Scuba diving in Punta Cana (general guide)",
        join(body, faqs),
      )
    }
  }

  // ---- About the dive center ---------------------------------------------------
  if (kb.about) {
    const a = kb.about
    const team = (a.team ?? []).filter(m => m.name && !HIDDEN_TEAM.test(m.name))
    out.push(
      "",
      "## About Grand Bay of the Sea",
      join(
        (a.stats ?? [])
          .filter(s => s.value && s.label)
          .map(s => `${s.label!.trim()}: ${s.value!.trim()}`)
          .join("\n"),
        prose(a.story),
        team.length
          ? [
              "The team:",
              prose(a.teamIntro),
              ...team.map(
                m =>
                  `- ${m.name!.trim()}${m.role?.trim() ? `, ${m.role.trim()}` : ""}${
                    m.bio?.trim() ? `: ${prose(m.bio)}` : ""
                  }`,
              ),
            ]
              .filter(Boolean)
              .join("\n")
          : "",
        (a.values ?? []).filter(v => v.title).length
          ? [
              "What they value:",
              ...(a.values ?? [])
                .filter(v => v.title)
                .map(
                  v =>
                    `- ${v.title!.trim()}${v.body ? `: ${prose(v.body)}` : ""}`,
                ),
            ].join("\n")
          : "",
      ),
    )
  }

  // ---- Cancellation policy ---------------------------------------------------
  if (kb.cancellationPolicy?.trim()) {
    out.push(
      "",
      "## Cancellation policy",
      kb.cancellationPolicy.trim(),
      `Full terms: ${SITE}/terms-and-conditions`,
    )
  }

  return out.join("\n") + "\n"
}
