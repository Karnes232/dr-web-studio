import "server-only"
import { Resend } from "resend"
import { runTurn, describeClaudeError } from "./claude"
import { detectLocale } from "./locale"
import { claimsHandoff } from "./handoffClaim"
import { countKapsoMessage, noteSendResult } from "./alerts"
import { getLead } from "@/lib/leads/saveLead"
import { profileFor } from "./profiles"
import { drwebstudio } from "./profiles/drwebstudio"
import {
  escalationEmail,
  newLeadEmail,
  resumedEmail,
  waitingOnYouEmail,
} from "./notifications"
import { sendText, WINDOW_EXPIRED } from "@/lib/whatsapp/send"
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
  const locale =
    conversation.locale ??
    detectLocale(message.text, tenant.default_locale || "es", tenant.locales)

  const profile = profileFor(tenant)
  if (!profile) {
    // A misconfigured row must not get another business's persona and prices.
    await escalate(
      tenant,
      conversation,
      message,
      `misconfigured tenant: unknown agent_profile "${tenant.agent_profile}"`,
      [],
    )
    return
  }

  // Spend cap before anything costly. Degrades to a human handoff rather than
  // silently going over budget.
  const cap = tenant.monthly_cost_cap_usd
  if (cap != null && Number(tenant.cost_this_month_usd ?? 0) >= Number(cap)) {
    console.warn(`agent: monthly cost cap reached for ${tenant.tenant_id}`)

    // Say SOMETHING. The cap firing used to leave the customer in total
    // silence: no reply, no explanation, and `claimTurn` then blocked the
    // conversation for five days. For a paying tenant that is their lead
    // sitting unanswered with no idea anything went wrong. Sent before the
    // escalation so the customer hears back even if the email fails.
    const notice = await sendText(
      tenant.phone_number_id,
      message.waId,
      profile.capReachedNotice(tenant.business_name, locale),
      { apiKeyEnv: tenant.kapso_api_key_env },
    )
    if (notice.ok) await countKapsoMessage(tenant)

    await escalate(
      tenant,
      conversation,
      message,
      "monthly cost cap reached",
      [],
    )
    return
  }

  let turn
  try {
    const knowledge = await profile.loadKnowledge()
    const history = await loadHistory(conversation)

    turn = await runTurn({
      tenant,
      conversation,
      profile,
      knowledgeBlock: knowledge.block(locale),
      catalogue: knowledge.catalogue,
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

  let delivered = false
  if (turn.reply) {
    const result = await sendText(
      tenant.phone_number_id,
      message.waId,
      turn.reply,
      { apiKeyEnv: tenant.kapso_api_key_env },
    )
    if (result.ok) {
      delivered = true
      // First, before anything else: the takeover check races this write.
      await recordOutbound(tenant, conversation, result.messageId, turn.reply, {
        inputTokens: turn.usage.inputTokens,
        outputTokens: turn.usage.outputTokens,
        cacheReadTokens: turn.usage.cacheReadTokens,
        cacheWriteTokens: turn.usage.cacheWriteTokens,
        costUsd: turn.usage.costUsd,
        apiCalls: turn.usage.apiCalls,
      })
      await countKapsoMessage(tenant)
    } else if (result.errorCode === WINDOW_EXPIRED) {
      // Outside the 24-hour service window only approved templates may be sent.
      console.warn("agent: 24h window closed, reply not delivered")
    } else {
      console.error(
        `agent: send failed (${result.errorCode ?? "no code"}): ${result.errorMessage}`,
      )
    }

    // The breaker: repeated failures pause the agent so it stops paying for
    // replies nobody receives. Kapso gives no reliable "out of messages" code,
    // so it counts failures rather than reading them.
    await noteSendResult(tenant, result)
  }

  // The chat was a person's until this message; tell them it no longer is.
  // `conversation` is the row as read before `claimTurn` reactivated it, so
  // its status is still the paused one.
  if (
    opts.resumed &&
    (conversation.status === "handed-off" ||
      conversation.status === "awaiting-human")
  ) {
    await notifyResumed(
      tenant,
      conversation.status,
      message,
      delivered ? turn.reply : null,
    )
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
    const email = newLeadEmail({
      tenant,
      profile: profileFor(tenant) ?? drwebstudio,
      customer: message,
      lead: await getLead(leadId),
    })
    if (email) await resend.emails.send(email)
  } catch (error) {
    // Never let a notification failure affect the conversation.
    console.error("agent: new-lead email failed:", error)
  }
}

/** Tell the business the agent took a paused chat back. */
async function notifyResumed(
  tenant: Tenant,
  previousStatus: "handed-off" | "awaiting-human",
  message: InboundMessage,
  agentReply: string | null,
): Promise<void> {
  try {
    const email = resumedEmail({
      tenant,
      profile: profileFor(tenant) ?? drwebstudio,
      customer: message,
      previousStatus,
      customerText: message.text,
      agentReply,
    })
    if (email) await resend.emails.send(email)
  } catch (error) {
    // Never let a notification failure affect the conversation.
    console.error("agent: resumed email failed:", error)
  }
}

/**
 * Tell the business a customer wrote into a chat that is theirs to answer.
 *
 * Called from the webhook when the agent stays quiet. The caller decides
 * whether this message deserves an email (the first since the last reply,
 * on a profile that wants them); this only composes and sends.
 */
export async function notifyWaitingOnYou(
  tenant: Tenant,
  message: InboundMessage,
  resumesAt: Date | null,
): Promise<void> {
  try {
    const email = waitingOnYouEmail({
      tenant,
      profile: profileFor(tenant) ?? drwebstudio,
      customer: message,
      customerText: message.text,
      resumesAt,
    })
    if (email) await resend.emails.send(email)
  } catch (error) {
    console.error("agent: waiting-on-you email failed:", error)
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

  try {
    const email = escalationEmail({
      tenant,
      // A tenant whose profile is unknown still gets told — in DR's wording,
      // which is better than no email at all.
      profile: profileFor(tenant) ?? drwebstudio,
      customer: message,
      reason,
      urgency,
      history,
    })
    if (email) await resend.emails.send(email)
  } catch (error) {
    console.error("agent: escalation email failed:", error)
  }
}
