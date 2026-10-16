import "server-only"
import { Resend } from "resend"
import {
  bumpKapsoMeter,
  recordSendResult,
  type Tenant,
} from "@/lib/whatsapp/store"
import { WINDOW_EXPIRED, type SendResult } from "@/lib/whatsapp/send"
import type { ConnectionEvent } from "@/lib/whatsapp/provider"

/**
 * Operational alerts: the line itself is in trouble, as opposed to a customer
 * needing a person (that is `escalate` in run.ts).
 *
 * They go to James, who runs the agent, and to the tenant's escalation
 * address, because on a coexistence number the business can act too (open
 * WhatsApp on the main phone, upgrade the Kapso plan). Nothing here may throw
 * into a webhook or a turn.
 */

const resend = new Resend(process.env.RESEND_API_KEY)

/** The operator. Every alert reaches him whatever the tenant row says. */
export const OPS_EMAIL = "james@dr-webstudio.com"
const FROM = "Dr Web Studio <james@dr-webstudio.com>"

export function alertRecipients(tenant: Pick<Tenant, "escalation_email">) {
  return [
    ...new Set([OPS_EMAIL, tenant.escalation_email].filter(Boolean)),
  ] as string[]
}

export async function sendOpsAlert(
  tenant: Tenant,
  subject: string,
  lines: string[],
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM,
      to: alertRecipients(tenant),
      subject: `[${tenant.business_name}] ${subject}`,
      text: lines.join("\n"),
    })
  } catch (error) {
    console.error(`alerts: "${subject}" email failed:`, error)
  }
}

/** One message Kapso bills against the plan. Warns once, at 80%. */
export async function countKapsoMessage(tenant: Tenant): Promise<void> {
  try {
    const meter = await bumpKapsoMeter(tenant)
    if (!meter?.crossed) return
    await sendOpsAlert(tenant, "WhatsApp plan at 80% this month", [
      `${meter.messages} of ${meter.allowance} Kapso messages used this month.`,
      "",
      "Kapso counts every message in and out, including the ones staff send",
      "from the WhatsApp Business app. When the allowance runs out, Kapso may",
      "stop passing messages to the assistant until the month resets, and the",
      "assistant goes quiet. Staff still receive every message on the phone.",
      "",
      "To avoid that, upgrade the Kapso plan (Billing in the Kapso dashboard).",
    ])
  } catch (error) {
    console.error("alerts: countKapsoMessage failed:", error)
  }
}

/**
 * Feed one send into the breaker. Window-expired failures are normal (the
 * customer went quiet for 24h) and say nothing about the line, so they are
 * left out entirely — neither a failure nor a success.
 */
export async function noteSendResult(
  tenant: Tenant,
  result: SendResult,
): Promise<void> {
  try {
    if (!result.ok && result.errorCode === WINDOW_EXPIRED) return
    // A success with no streak to clear is the common case; skip the write.
    if (result.ok && !tenant.send_failures && !tenant.paused_until) return
    const state = await recordSendResult(tenant, result.ok)
    if (result.ok || !state?.tripped) return

    await sendOpsAlert(tenant, "WhatsApp assistant paused: replies failing", [
      `${state.failures} replies in a row failed to send, so the assistant is`,
      `paused until ${state.paused_until ?? "further notice"} (no AI cost while paused).`,
      "After that it tries again on the next message.",
      "",
      "Likely causes: the Kapso plan's monthly messages are used up, the Kapso",
      "API key was revoked, or the number disconnected. Staff still receive",
      "every message on the phone.",
      "",
      "Last failure, as Kapso returned it:",
      `  HTTP status: ${result.httpStatus ?? "no response"}`,
      `  Error code:  ${result.errorCode ?? "none"}`,
      `  Message:     ${result.errorMessage}`,
      `  Body:        ${result.rawBody ?? "(none)"}`,
    ])
  } catch (error) {
    console.error("alerts: noteSendResult failed:", error)
  }
}

const CONNECTION_REASONS: Record<string, string> = {
  primary_inactivity:
    "The main phone has not opened WhatsApp for about 14 days. Open WhatsApp on that phone.",
  companion_inactivity:
    "A linked device (such as WhatsApp Web) was inactive for about 30 days.",
}

/** One email per connection event. Never throws. */
export async function sendConnectionAlert(
  tenant: Tenant,
  event: ConnectionEvent,
): Promise<void> {
  const facts = [
    `Event:    ${event.event}${event.sourceEvent ? ` (${event.sourceEvent})` : ""}`,
    event.reason ? `Reason:   ${event.reason}` : "",
    event.initiatedBy ? `By:       ${event.initiatedBy}` : "",
    event.occurredAt ? `When:     ${event.occurredAt}` : "",
    `Number:   phone_number_id ${event.phoneNumberId}`,
  ].filter(Boolean)

  if (event.event === "reconnected") {
    await sendOpsAlert(tenant, "WhatsApp assistant reconnected", [
      "The WhatsApp number is connected to Kapso again, so the assistant is",
      "answering new customers again.",
      "",
      ...facts,
    ])
    return
  }

  const hint = event.reason ? CONNECTION_REASONS[event.reason] : undefined
  await sendOpsAlert(tenant, "WhatsApp assistant is OFFLINE", [
    "The WhatsApp number is no longer connected to Kapso, so the assistant",
    "cannot see or answer messages. Staff still receive every message in the",
    "WhatsApp Business app on the phone — answer customers from there.",
    "",
    ...(hint ? [hint, ""] : []),
    "To restore it: open WhatsApp on the main phone; if it stays",
    "disconnected, reconnect the number in the Kapso dashboard (Connected",
    "numbers → reconnect). Linked devices such as WhatsApp Web may need to be",
    "linked again afterwards.",
    "",
    ...facts,
  ])
}
