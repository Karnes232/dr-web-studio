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
