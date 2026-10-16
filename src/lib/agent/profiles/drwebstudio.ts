import { getAgentKnowledge } from "@/sanity/queries/agent/agentKnowledge"
import { renderKnowledge } from "../knowledge"
import { systemPersona } from "../prompt"
import { TOOLS } from "../tools"
import type { AgentProfile } from "./types"
import type { Tenant } from "@/lib/whatsapp/store"
import { waHref } from "@/lib/contact"

/**
 * DR Web Studio — the original agent, wrapped without changing a byte.
 *
 * Every function here delegates to the code that built DR's prompt before
 * profiles existed (`prompt.ts`, `knowledge.ts`, `tools.ts`), and the strings
 * are the ones that code used inline. `drwebstudio.golden.test.ts` holds the
 * result to the snapshots recorded before this refactor: DR must not pay a
 * cache write for Grand Bay's arrival.
 */
export const drwebstudio: AgentProfile = {
  id: "drwebstudio",

  async loadKnowledge() {
    const kb = await getAgentKnowledge()
    return {
      // One locale per request: both together cost ~60% more prefix for no
      // gain (measured), and English is the only alternative to Spanish.
      block: locale => renderKnowledge(kb, locale === "en" ? "en" : "es"),
      catalogue: kb.plannerServices.map(p => ({
        key: p.key,
        label: p.title.en,
      })),
    }
  },

  persona: systemPersona,
  tools: TOOLS,

  escalatedResult:
    "Escalated. Tell the customer briefly that James will pick this up, then stop.",

  timezone: "America/Santo_Domingo",
  clockLabel: "Current local time in the Dominican Republic",

  resumedNote:
    "This conversation was handled by a person, or paused, and has been quiet for days. You are picking it back up. Greet them again briefly, say plainly that you are the assistant (not James) helping them, and acknowledge the gap before continuing — do not pretend the pause did not happen.",

  // Deliberately says nothing about budgets or limits — that is the business's
  // problem, not the customer's. It promises only what actually happens next:
  // the escalation email is sent, so a human really has been told.
  capReachedNotice(business, locale) {
    return locale === "en"
      ? `Thanks for your message! I can't answer automatically right now, but I've passed it to the ${business} team and someone will get back to you shortly.`
      : `¡Gracias por escribirnos! En este momento no puedo responderte automáticamente, pero ya le pasé tu mensaje al equipo de ${business} y te contestan en breve.`
  },

  leadLabels: {
    company: "Company:",
    service: "Service:",
    timeline: "Timeline:",
    notes: "Notes:",
  },

  // DR's number is a Cloud API number, removed from the WhatsApp Business
  // app, so there is no phone to answer on — replying *as* the business means
  // the provider's inbox.
  takeoverLines: tenant => [
    "The agent is still handling this conversation. Reply in the inbox to",
    `take it over — it will stand down automatically: ${inboxUrl(tenant)}`,
  ],

  replyLines: (tenant, waId, byPhone) => [
    `Reply as ${tenant.business_name}:  ${inboxUrl(tenant)}`,
    ...(byPhone
      ? [
          `Reply from your own phone:  ${waHref(waId)}`,
          "  (that one reaches them from your personal number, not the",
          "   business number they have been talking to — prefer the inbox)",
        ]
      : [
          "  This contact has a WhatsApp username and no phone number, so",
          "  the inbox is the ONLY way to reach them. There is nothing to",
          "  open in your own WhatsApp.",
        ]),
  ],
}

function inboxUrl(tenant: Tenant): string {
  return tenant.inbox_url || "https://inbox.kapso.ai"
}
