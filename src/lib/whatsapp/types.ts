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
  | { kind: "status"; status: StatusUpdate }
  | { kind: "ignored"; reason: string }
