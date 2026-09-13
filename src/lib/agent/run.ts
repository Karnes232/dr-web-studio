import "server-only"
import { Resend } from "resend"
import { runTurn, describeClaudeError } from "./claude"
import { renderKnowledge } from "./knowledge"
import { detectLocale } from "./locale"
import { getAgentKnowledge } from "@/sanity/queries/agent/agentKnowledge"
import { sendText, WINDOW_EXPIRED } from "@/lib/whatsapp/send"
import { waHref } from "@/lib/contact"
import {
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
      knowledgeBlock: renderKnowledge(knowledge),
      history,
      locale,
      waId: message.waId,
      profileName: message.profileName,
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
): Promise<void> {
  await markEscalated(conversation, reason)

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
        `Customer: ${message.profileName || "unknown"} (+${message.waId})`,
        `Reply:    ${waHref(message.waId)}`,
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
