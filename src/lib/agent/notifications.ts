import { isBusinessScopedUserId } from "@/lib/whatsapp/send"
import type { LeadSummary } from "@/lib/leads/saveLead"
import type { Tenant } from "@/lib/whatsapp/store"
import type { AgentProfile } from "./profiles"

/**
 * The emails the agent sends a business, composed as plain data.
 *
 * Pure so they can be tested without Resend, and so a second business's
 * emails can be checked for the first one's name. Who sends them and where
 * replies go come from the tenant row; how to take a conversation over comes
 * from the profile, because it differs by setup — DR answers in the Kapso
 * inbox, a coexistence number is answered from the phone.
 */

/** Used when a tenant row sets no sender. DR's, unchanged. */
export const DEFAULT_FROM = "Dr Web Studio <james@dr-webstudio.com>"

export interface ComposedEmail {
  from: string
  to: string[]
  replyTo?: string
  subject: string
  text: string
}

function envelope(
  tenant: Pick<Tenant, "email_from" | "email_reply_to">,
  to: string,
): Pick<ComposedEmail, "from" | "to" | "replyTo"> {
  return {
    from: tenant.email_from || DEFAULT_FROM,
    to: [to],
    // Omitted rather than undefined, so DR's call is unchanged.
    ...(tenant.email_reply_to ? { replyTo: tenant.email_reply_to } : {}),
  }
}

export interface Customer {
  waId: string
  profileName?: string
}

export function newLeadEmail(args: {
  tenant: Tenant
  profile: AgentProfile
  customer: Customer
  lead: LeadSummary | null
}): ComposedEmail | null {
  const { tenant, profile, customer, lead } = args
  const to = tenant.escalation_email
  if (!to) return null

  const contact = isBusinessScopedUserId(customer.waId)
    ? `@${customer.waId} (WhatsApp username — no phone number)`
    : `+${customer.waId}`

  const line = (label: string, value?: string | null) =>
    value ? `${label.padEnd(10)}${value}` : ""

  const labels = profile.leadLabels

  return {
    ...envelope(tenant, to),
    subject: `New WhatsApp lead: ${lead?.name || customer.profileName || customer.waId}`,
    text: [
      "The WhatsApp agent saved a new lead.",
      "",
      line("Name:", lead?.name ?? customer.profileName),
      line("Contact:", contact),
      line("Email:", lead?.email),
      line(labels.company, lead?.company),
      line(labels.service, lead?.service_key),
      labels.projectType ? line(labels.projectType, lead?.project_type) : "",
      line(labels.timeline, lead?.timeline),
      line(labels.notes, lead?.message),
      "",
      ...profile.takeoverLines(tenant),
    ]
      .filter(Boolean)
      .join("\n"),
  }
}

export function escalationEmail(args: {
  tenant: Tenant
  profile: AgentProfile
  customer: Customer
  reason: string
  urgency: string
  history: { role: string; content: string }[]
}): ComposedEmail | null {
  const { tenant, profile, customer, reason, urgency, history } = args
  const to = tenant.escalation_email
  if (!to) return null

  // A username-only contact has a business-scoped user id where a phone number
  // would be. Rendering it as "+DO.1757134975438075" or as a wa.me link both
  // produce something that looks like a number and does not work.
  const byPhone = !isBusinessScopedUserId(customer.waId)
  const contact = byPhone ? `+${customer.waId}` : `@${customer.waId}`

  const transcript = history
    .map(h => `${h.role === "user" ? "Customer" : "Agent"}: ${h.content}`)
    .join("\n")

  return {
    ...envelope(tenant, to),
    subject: `WhatsApp handoff (${urgency}): ${customer.profileName || customer.waId}`,
    text: [
      `The WhatsApp agent handed a conversation over.`,
      "",
      `Reason:   ${reason}`,
      `Urgency:  ${urgency}`,
      `Customer: ${customer.profileName || "unknown"} (${contact})`,
      "",
      ...profile.replyLines(tenant, customer.waId, byPhone),
      "",
      "The agent has stopped replying to this conversation.",
      "",
      transcript ? `--- transcript ---\n${transcript}` : "",
    ].join("\n"),
  }
}

/**
 * The agent picked a quiet conversation back up: the business had been silent
 * past the tenant's resume window and the customer wrote again.
 *
 * Sent after the agent's reply so the email can show what it said. The chat
 * was a person's a moment ago, so they need to know it no longer is.
 */
export function resumedEmail(args: {
  tenant: Tenant
  profile: AgentProfile
  customer: Customer
  previousStatus: "handed-off" | "awaiting-human"
  customerText: string
  agentReply: string | null
}): ComposedEmail | null {
  const {
    tenant,
    profile,
    customer,
    previousStatus,
    customerText,
    agentReply,
  } = args
  const to = tenant.escalation_email
  if (!to) return null

  const byPhone = !isBusinessScopedUserId(customer.waId)
  const contact = byPhone ? `+${customer.waId}` : `@${customer.waId}`

  return {
    ...envelope(tenant, to),
    subject: `WhatsApp chat resumed: ${customer.profileName || customer.waId}`,
    text: [
      `${customer.profileName || "A customer"} wrote again, and the WhatsApp agent has picked the chat back up.`,
      previousStatus === "handed-off"
        ? "You had taken this chat over, and nobody had replied since."
        : "The agent had handed this chat to you, and nobody had replied since.",
      "",
      `Customer: ${customer.profileName || "unknown"} (${contact})`,
      "",
      `They wrote:\n${customerText}`,
      "",
      agentReply
        ? `The agent replied:\n${agentReply}`
        : "The agent did not send a reply.",
      "",
      ...profile.replyLines(tenant, customer.waId, byPhone),
      "",
      "Reply yourself and the agent stands down again.",
    ].join("\n"),
  }
}

/**
 * A customer wrote into a chat that is a person's to answer, after the
 * business had been quiet for an hour, and the agent is staying quiet.
 * Without this nothing tells anyone: the message just sits in the inbox.
 *
 * `resumesAt` is when the agent would take the chat back if nobody replies;
 * `null` when it never will. Returns null for a profile that does not want
 * these (`notifyWhileHuman`): its staff are notified by their own phones.
 */
export function waitingOnYouEmail(args: {
  tenant: Tenant
  profile: AgentProfile
  customer: Customer
  customerText: string
  resumesAt: Date | null
}): ComposedEmail | null {
  const { tenant, profile, customer, customerText, resumesAt } = args
  const to = tenant.escalation_email
  if (!to || !profile.notifyWhileHuman) return null

  const byPhone = !isBusinessScopedUserId(customer.waId)
  const contact = byPhone ? `+${customer.waId}` : `@${customer.waId}`

  const when = resumesAt
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: profile.timezone,
        dateStyle: "medium",
        timeStyle: "short",
      }).format(resumesAt)
    : null

  return {
    ...envelope(tenant, to),
    subject: `WhatsApp: ${customer.profileName || customer.waId} wrote — chat is yours`,
    text: [
      `${customer.profileName || "A customer"} wrote into a chat that is yours to answer. The agent is staying quiet.`,
      "",
      `Customer: ${customer.profileName || "unknown"} (${contact})`,
      "",
      `They wrote:\n${customerText}`,
      "",
      when
        ? `If nobody replies, the agent picks the chat back up from ${when} (${profile.timezone}), the next time they write.`
        : "The agent will not pick this chat back up on its own.",
      "Their message reopened the 24-hour window, so you can reply freely.",
      "",
      ...profile.replyLines(tenant, customer.waId, byPhone),
    ].join("\n"),
  }
}
