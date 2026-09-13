import "server-only"
import { Resend } from "resend"
import { runTurn, describeClaudeError } from "./claude"
import { renderKnowledge } from "./knowledge"
import { detectLocale } from "./locale"
import { claimsHandoff } from "./handoffClaim"
import { getLead } from "@/lib/leads/saveLead"
import { getAgentKnowledge } from "@/sanity/queries/agent/agentKnowledge"
import {
  isBusinessScopedUserId,
  sendText,
  WINDOW_EXPIRED,
} from "@/lib/whatsapp/send"
import { waHref } from "@/lib/contact"
import {
  linkLead,
  loadHistory,
  markEscalated,
  recordOutbound,
  recordTurn,
  type Conversation,
  type Tenant,
} from "@/lib/whatsapp/store"
import type { InboundMessage } from "@/lib/whatsapp/types"

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Where a human picks the conversation up.
 *
 * A Cloud API number is removed from the WhatsApp Business app, so there is no
 * phone to answer on — replying *as* the business means the provider's inbox.
 */
const AGENT_INBOX_URL = "https://inbox.kapso.ai"

/**
 * One inbound message → one reply.
 *
 * Called from inside `after()` in the webhook route, so it runs AFTER the 200
 * has gone back to Kapso. It must never throw: the response is already sent, so
 * a rejection here would be an unhandled promise rather than a retry.
 */
export async function runAgent(
  tenant: Tenant,
  conversation: Conversation,
  message: InboundMessage,
  opts: { resumed?: boolean } = {},
): Promise<void> {
  // Spend cap before anything costly. Degrades to a human handoff rather than
  // silently going over budget.
  const cap = tenant.monthly_cost_cap_usd
  if (cap != null && Number(tenant.cost_this_month_usd ?? 0) >= Number(cap)) {
    console.warn(`agent: monthly cost cap reached for ${tenant.tenant_id}`)
    await escalate(
      tenant,
      conversation,
      message,
      "monthly cost cap reached",
      [],
    )
    return
  }

  const locale =
    conversation.locale ??
    detectLocale(message.text, tenant.default_locale || "es")

  let turn
  try {
    const knowledge = await getAgentKnowledge()
    const history = await loadHistory(conversation)

    turn = await runTurn({
      tenant,
      conversation,
      knowledge,
      knowledgeBlock: renderKnowledge(knowledge, locale === "en" ? "en" : "es"),
      history,
      locale,
      waId: message.waId,
      profileName: message.profileName,
      resumed: opts.resumed,
    })
  } catch (error) {
    // A failed model call must not leave the customer in silence.
    console.error("agent: turn failed:", describeClaudeError(error))
    await escalate(
      tenant,
      conversation,
      message,
      `agent error: ${describeClaudeError(error)}`,
      [],
    )
    return
  }

  if (turn.reply) {
    const result = await sendText(
      tenant.phone_number_id,
      message.waId,
      turn.reply,
    )
    if (result.ok) {
      await recordOutbound(tenant, conversation, result.messageId, turn.reply, {
        inputTokens: turn.usage.inputTokens,
        outputTokens: turn.usage.outputTokens,
        cacheReadTokens: turn.usage.cacheReadTokens,
        cacheWriteTokens: turn.usage.cacheWriteTokens,
        costUsd: turn.usage.costUsd,
        apiCalls: turn.usage.apiCalls,
      })
    } else if (result.errorCode === WINDOW_EXPIRED) {
      // Outside the 24-hour service window only approved templates may be sent.
      console.warn("agent: 24h window closed, reply not delivered")
    } else {
      console.error(
        `agent: send failed (${result.errorCode ?? "no code"}): ${result.errorMessage}`,
      )
    }
  }

  // Link the lead to the conversation.
  //
  // This was imported and never called, so `conversations.lead_id` stayed null
  // forever — and `claude.ts` derives "No lead saved yet for this conversation"
  // from exactly that field. The model was therefore told on EVERY turn that no
  // lead existed and dutifully called save_lead every time, which is a second
  // full API request re-sending the whole cached prefix. It roughly doubled the
  // cost of every conversation. Only the unique index on leads.conversation_id
  // kept it from producing a row per turn.
  if (turn.leadId && !conversation.lead_id) {
    await linkLead(conversation, turn.leadId)
    // First save for this conversation — tell James. A successful saveLead is
    // otherwise completely silent: it only emails when the DB write *fails*,
    // so a lead that lands perfectly would sit unseen in Supabase.
    await notifyNewLead(tenant, conversation, message, turn.leadId)
  }

  await recordTurn(tenant, conversation, {
    locale,
    costUsd: turn.usage.costUsd,
  })

  console.log(
    `agent turn: ${turn.usage.apiCalls} call(s) / ${turn.usage.inputTokens} in / ` +
      `${turn.usage.outputTokens} out / ${turn.usage.cacheReadTokens} cache-read / ` +
      `${turn.usage.cacheWriteTokens} cache-write / $${turn.usage.costUsd.toFixed(4)}`,
  )

  if (turn.escalated) {
    await escalate(
      tenant,
      conversation,
      message,
      turn.escalated.reason,
      await loadHistory(conversation),
      turn.escalated.urgency,
    )
  } else if (turn.reply && claimsHandoff(turn.reply)) {
    // The model announced a handoff without calling escalate_to_human, leaving
    // a customer waiting on something that never happened. Tell James anyway.
    //
    // Deliberately does NOT stand the agent down: a false positive here would
    // silence a working agent, which is worse than the bug it guards against.
    // James is informed and can simply reply from the inbox, which the takeover
    // detection now picks up properly.
    console.warn(
      `agent: reply claims a handoff but escalate_to_human was not called ` +
        `(conversation ${conversation.id})`,
    )
    await escalate(
      tenant,
      conversation,
      message,
      "the agent TOLD the customer it was handing over, but never called " +
        "escalate_to_human — it may be waiting on you",
      await loadHistory(conversation),
      "high",
      { standDown: false },
    )
  }
}

/**
 * Tell James a new lead came in.
 *
 * Fires once per conversation, on the first successful save. Later refinements
 * stay silent — the agent updates the same lead as it learns more, and an email
 * per turn would train him to ignore them.
 */
async function notifyNewLead(
  tenant: Tenant,
  conversation: Conversation,
  message: InboundMessage,
  leadId: string,
): Promise<void> {
  try {
    const to = tenant.escalation_email
    if (!to) return

    const lead = await getLead(leadId)
    const contact = isBusinessScopedUserId(message.waId)
      ? `@${message.waId} (WhatsApp username — no phone number)`
      : `+${message.waId}`

    const line = (label: string, value?: string | null) =>
      value ? `${label.padEnd(10)}${value}` : ""

    await resend.emails.send({
      from: "Dr Web Studio <james@dr-webstudio.com>",
      to: [to],
      subject: `New WhatsApp lead: ${lead?.name || message.profileName || message.waId}`,
      text: [
        "The WhatsApp agent saved a new lead.",
        "",
        line("Name:", lead?.name ?? message.profileName),
        line("Contact:", contact),
        line("Email:", lead?.email),
        line("Company:", lead?.company),
        line("Service:", lead?.service_key),
        line("Timeline:", lead?.timeline),
        line("Notes:", lead?.message),
        "",
        "The agent is still handling this conversation. Reply in the inbox to",
        `take it over — it will stand down automatically: ${AGENT_INBOX_URL}`,
      ]
        .filter(Boolean)
        .join("\n"),
    })
  } catch (error) {
    // Never let a notification failure affect the conversation.
    console.error("agent: new-lead email failed:", error)
  }
}

/**
 * Hand off to James: stop the agent, then tell him.
 *
 * The status flip comes first and is checked at the top of the webhook handler,
 * so the agent goes quiet even if the email fails.
 */
async function escalate(
  tenant: Tenant,
  conversation: Conversation,
  message: InboundMessage,
  reason: string,
  history: { role: string; content: string }[],
  urgency = "normal",
  opts: { standDown?: boolean } = {},
): Promise<void> {
  // Standing down is the default. The one caller that passes false is the
  // safety net for a claimed-but-unperformed handoff, where a false positive
  // must not silence a working agent.
  if (opts.standDown !== false) await markEscalated(conversation, reason)

  // A username-only contact has a business-scoped user id where a phone number
  // would be. Rendering it as "+DO.1757134975438075" or as a wa.me link both
  // produce something that looks like a number and does not work.
  const byPhone = !isBusinessScopedUserId(message.waId)
  const contact = byPhone ? `+${message.waId}` : `@${message.waId}`

  try {
    const to = tenant.escalation_email
    if (!to) return

    const transcript = history
      .map(h => `${h.role === "user" ? "Customer" : "Agent"}: ${h.content}`)
      .join("\n")

    await resend.emails.send({
      from: "Dr Web Studio <james@dr-webstudio.com>",
      to: [to],
      subject: `WhatsApp handoff (${urgency}): ${message.profileName || message.waId}`,
      text: [
        `The WhatsApp agent handed a conversation over.`,
        "",
        `Reason:   ${reason}`,
        `Urgency:  ${urgency}`,
        `Customer: ${message.profileName || "unknown"} (${contact})`,
        "",
        `Reply as ${tenant.business_name}:  ${AGENT_INBOX_URL}`,
        ...(byPhone
          ? [
              `Reply from your own phone:  ${waHref(message.waId)}`,
              "  (that one reaches them from your personal number, not the",
              "   business number they have been talking to — prefer the inbox)",
            ]
          : [
              "  This contact has a WhatsApp username and no phone number, so",
              "  the inbox is the ONLY way to reach them. There is nothing to",
              "  open in your own WhatsApp.",
            ]),
        "",
        "The agent has stopped replying to this conversation.",
        "",
        transcript ? `--- transcript ---\n${transcript}` : "",
      ].join("\n"),
    })
  } catch (error) {
    console.error("agent: escalation email failed:", error)
  }
}
