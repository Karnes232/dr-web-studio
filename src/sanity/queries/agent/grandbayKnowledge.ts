import "server-only"
import { unstable_cache } from "next/cache"
import { createClient } from "@sanity/client"

/**
 * Grand Bay of the Sea's catalogue, read live from THEIR Sanity project.
 *
 * Their own dataset, not ours: prices change in their Studio and reach the
 * agent within the hour, with no copy to keep in sync. The dataset is public
 * (anonymous reads), so this client carries NO token — never `serverClient`,
 * which holds DR's SANITY_API_TOKEN and must not be sent to another project.
 *
 * English only. The agent replies in the customer's language whatever the
 * knowledge is written in, and one language means one cache entry for every
 * Grand Bay conversation instead of four.
 *
 * Byte stability is the cache key: every list is ordered explicitly with an
 * `_id` tie-break, and Portable Text is flattened with `pt::text` so styling
 * edits cannot change the bytes.
 *
 * Field names verified against their schema and live data (2026-10-16). If
 * they rename a type or field, the query returns nulls and the renderer omits
 * that part; if they make the dataset private, the fetch throws and every
 * turn escalates.
 */

const client = createClient({
  projectId: "33b6wn5r",
  dataset: "production",
  apiVersion: "2025-11-13",
  useCdn: true,
  perspective: "published",
})

export interface GbFaq {
  q: string | null
  a: string | null
}

export interface GbCourse {
  slug: string
  name: string
  title: string | null
  summary: string | null
  level: string | null
  /** USD per person. */
  price: number | null
  duration: string | null
  dives: string | null
  maxDepth: string | null
  extraInfo: string | null
  /** The course page's long-form write-up, flattened. */
  about: string | null
  faqs: GbFaq[] | null
}

export interface GbTrip {
  slug: string
  /** Also the key their booking calendar uses for departure days. */
  name: string
  title: string | null
  summary: string | null
  privateOnly: boolean
  /** USD per diver. */
  price: number | null
  /** USD per snorkeler or non-diving companion. */
  companionPrice: number | null
  /** USD, flat per booking. */
  deposit: number | null
  duration: string | null
  included: (string | null)[] | null
  itinerary: { step: string | null; detail: string | null }[] | null
  note: string | null
  faqs: GbFaq[] | null
}

export interface GbDiveSite {
  name: string
  slug: string | null
  meters: number | null
  feet: number | null
  level: string | null
  location: string | null
  summary: string | null
  description: string | null
  nearby: (string | null)[] | null
}

export interface GrandBayKnowledge {
  courses: GbCourse[]
  trips: GbTrip[]
  localDives: {
    twoTank: number | null
    fourTank: number | null
    deposit: number | null
    duration: string | null
    faqs: GbFaq[] | null
  } | null
  diveSites: GbDiveSite[]
  sharkDive: {
    name: string | null
    price: number | null
    deposit: number | null
    duration: string | null
    level: string | null
    maxDepth: string | null
    included: (string | null)[] | null
    faqs: GbFaq[] | null
  } | null
  fishing: {
    name: string | null
    price: number | null
    spectatorPrice: number | null
    privateCharter: number | null
    deposit: number | null
    duration: string | null
  } | null
  liveaboards: {
    intro: string | null
    silverBank: string | null
    whaleWatching: string | null
    stats: { value: string | null; label: string | null }[] | null
    faqs: GbFaq[] | null
  } | null
  generalFaqs: { page: string | null; faqs: GbFaq[] | null }[]
  contact: {
    hours: string | null
    hoursNote: string | null
    intro: string | null
  } | null
  cancellationPolicy: string | null
  /** The About Us page. */
  about: {
    story: string | null
    teamIntro: string | null
    team:
      | { name: string | null; role: string | null; bio: string | null }[]
      | null
    values: { title: string | null; body: string | null }[] | null
    stats: { value: string | null; label: string | null }[] | null
  } | null
  /** Marine life page: one entry per species. */
  species: { name: string | null; description: string | null }[]
  speciesIntro: string | null
  /** The "Scuba diving Punta Cana" guide page. */
  puntaCana: { body: string | null; faqs: GbFaq[] | null } | null
}

const FAQS = `"faqs": faqs[]{ "q": question.en, "a": pt::text(answer.en) }`

/** Several Portable Text fields as one plain-text body, blank-line separated. */
const ptJoin = (...fields: string[]) =>
  `array::join([${fields.map(f => `pt::text(${f}.en)`).join(", ")}], "\\n\\n")`

export const grandBayKnowledgeQuery = `{
  "courses": *[_type == "individualCourse"] | order(order asc, _id asc) {
    "slug": slug.current, "name": course, "title": title.en,
    "summary": cardDescription.en, "level": level.en, "price": padiPrice,
    "duration": duration.en, "dives": dives.en, "maxDepth": maxDepth.en,
    "extraInfo": extraInfo.en,
    "about": ${ptJoin("paragraph1", "paragraph2", "paragraph3", "paragraph4", "paragraph5", "paragraph6")},
    ${FAQS}
  },
  "trips": *[_type == "trips"] | order(price asc, _id asc) {
    "slug": slug.current, "name": page, "title": title.en,
    "summary": cardDescription.en, "privateOnly": coalesce(privateOnly, false),
    "price": price, "companionPrice": spectatorSnorkel, "deposit": depositPrice,
    "duration": duration.en, "included": extras[].en,
    "itinerary": tripDaySteps[]{ "step": stepTitle.en, "detail": stepBody.en },
    "note": tripDayNote.en,
    ${FAQS}
  },
  "localDives": *[_type == "sites"][0] {
    "twoTank": twoTankDive, "fourTank": fourTankPackage, "deposit": depositPrice,
    "duration": duration.en,
    ${FAQS}
  },
  "diveSites": *[_type == "diveSite"] | order(meters asc, name asc, _id asc) {
    name, "slug": slug.current, meters, feet, level, location,
    "summary": cardDescription.en, "description": description.en,
    "nearby": nearbySites[]->name
  },
  "sharkDive": *[_type == "sharkDive"][0] {
    "name": page, "price": price, "deposit": depositPrice, "duration": duration.en,
    "level": level.en, "maxDepth": maxDepth.en, "included": extras[].en,
    ${FAQS}
  },
  "fishing": *[_type == "fishing"][0] {
    "name": page, "price": price, "spectatorPrice": spectatorPrice,
    "privateCharter": privateCharter, "deposit": depositPrice, "duration": duration
  },
  "liveaboards": *[_type == "liveaboards"][0] {
    "intro": pt::text(paragraph1.en),
    "silverBank": pt::text(silverBankExpeditionParagraph.en),
    "whaleWatching": pt::text(whaleWatchingAdventureParagraph.en),
    "stats": stats[]{ "value": value.en, "label": label.en },
    ${FAQS}
  },
  "generalFaqs": *[_type == "faqs"] | order(page asc, _id asc) {
    page, ${FAQS}
  },
  "contact": *[_type == "contact"][0] {
    "hours": hoursValue.en, "hoursNote": hoursDesc.en, "intro": heroSubtitle.en
  },
  "cancellationPolicy": pt::text(*[_type == "cancellationPolicy"][0].content.en),
  "about": *[_type == "aboutUs"][0] {
    "story": pt::text(storyBody.en), "teamIntro": teamIntro.en,
    "team": teamMembers[]{ name, "role": role.en, "bio": bio.en },
    "values": values[]{ "title": title.en, "body": body.en },
    "stats": stats[]{ "value": value.en, "label": label.en }
  },
  "species": *[_type == "fishes"] | order(name.en asc, _id asc) {
    "name": name.en, "description": description.en
  },
  "speciesIntro": pt::text(*[_type == "speciesPageContent"][0].content.en),
  "puntaCana": *[_type == "scubaDivingPuntaCana"][0] {
    "body": ${ptJoin("paragraph1", "paragraph2", "paragraph3")},
    ${FAQS}
  }
}`

export const getGrandBayKnowledge = unstable_cache(
  async (): Promise<GrandBayKnowledge> =>
    client.fetch<GrandBayKnowledge>(grandBayKnowledgeQuery),
  ["agent-knowledge", "grandbay"],
  { revalidate: 3600, tags: ["agentKnowledge:grandbay"] },
)
