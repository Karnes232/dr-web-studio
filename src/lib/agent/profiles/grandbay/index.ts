import { getGrandBayKnowledge } from "@/sanity/queries/agent/grandbayKnowledge"
import { waHref } from "@/lib/contact"
import type { AgentProfile } from "../types"
import { catalogue, renderGrandBayKnowledge } from "./knowledge"
import { grandBayPersona } from "./prompt"
import { GRANDBAY_TOOLS } from "./tools"

/**
 * Grand Bay of the Sea — PADI dive center, Punta Cana.
 *
 * Runs on a coexistence number: the chat lives in the WhatsApp Business app
 * on staff phones as well as on the Cloud API. Every handoff instruction
 * therefore says "reply in the chat" — never "use the inbox" — and the
 * assistant stops the moment staff do.
 */
export const grandbay: AgentProfile = {
  id: "grandbay",

  async loadKnowledge() {
    const kb = await getGrandBayKnowledge()
    const block = renderGrandBayKnowledge(kb)
    return {
      // One English block for every conversation language: one cache entry.
      block: () => block,
      catalogue: catalogue(kb),
    }
  },

  persona: grandBayPersona,
  tools: GRANDBAY_TOOLS,

  escalatedResult:
    "Escalated. Tell the customer briefly, in their language, that a member of the Grand Bay team will continue in this chat, then stop.",

  timezone: "America/Santo_Domingo",
  clockLabel: "Current local time in Punta Cana",

  resumedNote:
    "This conversation was handled by a person, or paused, and has been quiet for days. You are picking it back up. Greet them again briefly, say plainly that you are the dive center's virtual assistant (not a member of the team), and acknowledge the gap before continuing — do not pretend the pause did not happen.",

  // Says nothing about budgets — that is the business's concern. Promises
  // only what happens: the escalation email has gone, and staff answer in
  // this same chat.
  capReachedNotice(business, locale) {
    switch (locale) {
      case "es":
        return `¡Gracias por escribir a ${business}! En este momento no puedo responder automáticamente, pero alguien del equipo te contestará aquí mismo en breve.`
      case "de":
        return `Vielen Dank für Ihre Nachricht an ${business}! Ich kann gerade nicht automatisch antworten, aber jemand aus dem Team meldet sich in Kürze hier im Chat.`
      case "fr":
        return `Merci pour votre message à ${business} ! Je ne peux pas répondre automatiquement pour le moment, mais quelqu'un de l'équipe vous répondra ici très bientôt.`
      default:
        return `Thanks for messaging ${business}! I can't answer automatically right now, but someone from the team will reply here shortly.`
    }
  },

  leadLabels: {
    company: "Hotel:",
    service: "Activity:",
    timeline: "Dates:",
    notes: "Notes:",
    projectType: "Group:",
  },

  takeoverLines: tenant => [
    "The assistant is still answering this customer. To take over, reply in",
    `the chat on the ${tenant.business_name} WhatsApp${
      tenant.display_phone ? ` (${tenant.display_phone})` : ""
    } — on the phone or WhatsApp Web. The assistant stops as soon as you do.`,
  ],

  replyLines: (tenant, waId, byPhone) => [
    `Reply in the chat on the ${tenant.business_name} WhatsApp${
      tenant.display_phone ? ` (${tenant.display_phone})` : ""
    } — the conversation is already there, on the phone or WhatsApp Web.`,
    ...(byPhone
      ? [`Open it directly on the business phone: ${waHref(waId)}`]
      : [
          "  This customer uses a WhatsApp username and has no phone number:",
          "  find the chat by their name in the chat list.",
        ]),
  ],
}
