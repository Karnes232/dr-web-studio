/**
 * Provider-neutral shapes.
 *
 * Nothing downstream of `provider.ts` should ever see a Kapso field name. The
 * send API is already a transparent proxy over Meta's Cloud API, so keeping the
 * inbound side normalised too means swapping transports is one file.
 */

export type MessageStatus = "sent" | "delivered" | "read" | "failed"

export interface InboundMessage {
  /** Meta's `wamid`. Stable across providers; our idempotency key. */
  providerMessageId: string
  /** The WhatsApp number the message came from. */
  waId: string
  /**
   * WhatsApp can now send identity without a phone number, so `waId` alone is
   * not always a safe user key.
   */
  businessScopedUserId?: string
  profileName?: string
  providerConversationId?: string
  isNewConversation: boolean
  /** The business number it arrived on — the tenant key. */
  phoneNumberId: string
  type: string
  text: string
  timestamp: Date
}

/**
 * An outbound message echoed back to us by the provider.
 *
 * Exists to answer one question: did *we* send this, or did a person? For a
 * reply typed in the provider's inbox Kapso cannot tell us — inbox and API
 * replies both report `origin: "cloud_api"` — so the answer is inferred from
 * whether we had already recorded the wamid ourselves. A message typed in the
 * WhatsApp Business app on a coexistence number is different: its sent event
 * carries `message.from` (the business number), which an API send does not,
 * and the normaliser marks it `origin: "business_app"`, which is definitive.
 *
 * It carries `text` because a human's words belong in the transcript; the
 * status path deliberately does not, which is why this is its own kind.
 */
export interface OutboundMessage {
  /**
   * Where Kapso says the message came from. Only `"business_app"` is acted on:
   * it can never be the agent's own send.
   */
  origin?: string
  providerMessageId: string
  /** The customer, as a phone number or a business-scoped user id. */
  waId?: string
  providerConversationId?: string
  /** The business number it was sent from — the tenant key. */
  phoneNumberId: string
  type: string
  text: string
  timestamp: Date
}

export interface StatusUpdate {
  providerMessageId: string
  phoneNumberId: string
  status: MessageStatus
  recipientId?: string
  /** Meta error code. 131047 = outside the 24-hour customer service window. */
  errorCode?: number
  errorMessage?: string
  timestamp: Date
}

export type NormalizedEvent =
  | { kind: "message"; message: InboundMessage }
  | { kind: "outbound"; message: OutboundMessage }
  | { kind: "status"; status: StatusUpdate }
  | { kind: "ignored"; reason: string }
