import type { MessageStatus, NormalizedEvent } from "./types"

/** Kapso's event header for an outbound message leaving the business number. */
export const EVENT_MESSAGE_SENT = "whatsapp.message.sent"
export const EVENT_MESSAGE_RECEIVED = "whatsapp.message.received"

/**
 * Normalise a Kapso webhook body into provider-neutral shapes.
 *
 * Kapso payload quirks this absorbs:
 *  - the sender's profile name lives on `conversation.contact_name`, NOT on
 *    `message` (Meta puts it at `contacts[0].profile.name`);
 *  - `message.timestamp` is a STRING of Unix seconds;
 *  - status events reuse the same `wamid` as the outbound message they describe
 *    and carry a CUMULATIVE `statuses[]` array — on `delivered` you receive the
 *    `sent` entry again — so the last entry is the current state;
 *  - batched delivery changes the body shape entirely;
 *  - **the sender may have no phone number at all.** WhatsApp usernames mean an
 *    inbound message can identify its sender only by `username` and a
 *    business-scoped user id (`DO.1757134975438075`). Sandbox numbers still
 *    send plain digits, so this shape appears the moment you move to a real
 *    number — see `senderOf` below.
 */

type Json = Record<string, unknown>

const asObj = (v: unknown): Json | undefined =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Json) : undefined

const asStr = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v : undefined

/** Kapso sends Unix seconds as a string; tolerate numbers and ISO too. */
function toDate(value: unknown): Date {
  if (typeof value === "number") return new Date(value * 1000)
  if (typeof value === "string") {
    if (/^\d+$/.test(value)) return new Date(Number(value) * 1000)
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return new Date()
}

const STATUSES: MessageStatus[] = ["sent", "delivered", "read", "failed"]

export function normalizeKapsoWebhook(
  body: unknown,
  eventHeader?: string | null,
): NormalizedEvent {
  const root = asObj(body)
  if (!root) return { kind: "ignored", reason: "body is not an object" }

  // Buffering is off by default and should stay off — the batched shape is
  // `{ type, batch: true, data: [...] }`, which nothing downstream expects.
  if (root.batch === true) {
    return { kind: "ignored", reason: "batched delivery is not supported" }
  }

  const message = asObj(root.message)
  if (!message) return { kind: "ignored", reason: "no message on payload" }

  const conversation = asObj(root.conversation) ?? {}
  const kapso = asObj(message.kapso) ?? {}

  const phoneNumberId =
    asStr(root.phone_number_id) ?? asStr(conversation.phone_number_id)
  if (!phoneNumberId) {
    return { kind: "ignored", reason: "no phone_number_id (tenant key)" }
  }

  const providerMessageId = asStr(message.id)
  if (!providerMessageId) {
    return { kind: "ignored", reason: "no message id" }
  }

  // Prefer the explicit event header; fall back to the direction Kapso stamps
  // on the message, then to field shape.
  const event = asStr(eventHeader)
  const direction = asStr(kapso.direction)
  const statuses = Array.isArray(kapso.statuses) ? kapso.statuses : undefined

  // An outbound message echoed back to us. This has to be caught BEFORE the
  // status test below, which is a deny-list of one string and would otherwise
  // claim it on all three clauses — and the status path has nowhere to put the
  // text, so the words would be parsed out and thrown away.
  //
  // Only the explicit header counts. A delivery receipt for an earlier message
  // also has `direction: "outbound"`, and treating those as fresh messages
  // would replay the same text on every `delivered` and `read`.
  if (event === EVENT_MESSAGE_SENT) {
    // Kapso's documented outbound example puts the body in `message.text.body`;
    // our own inbound payloads use `kapso.content`. Read both — neither is
    // guaranteed and an empty body must not masquerade as a real reply.
    const sentText =
      asStr(asObj(message.text)?.body) ?? asStr(kapso.content) ?? ""
    if (!sentText) {
      return { kind: "ignored", reason: "outbound message with no text" }
    }

    return {
      kind: "outbound",
      message: {
        providerMessageId,
        waId:
          asStr(message.to) ??
          asStr(conversation.phone_number) ??
          asStr(conversation.business_scoped_user_id),
        providerConversationId: asStr(conversation.id),
        phoneNumberId,
        type: asStr(message.type) ?? "text",
        text: sentText,
        timestamp: toDate(message.timestamp),
      },
    }
  }

  const isStatus =
    (event && event !== EVENT_MESSAGE_RECEIVED) ||
    direction === "outbound" ||
    !!statuses

  if (isStatus) {
    // Cumulative array — the last entry is the current state.
    const latest = asObj(statuses?.[statuses.length - 1])
    const raw = asStr(latest?.status) ?? asStr(kapso.status)
    const status = STATUSES.find(s => s === raw)
    if (!status) {
      return {
        kind: "ignored",
        reason: `unrecognised status: ${raw ?? "none"}`,
      }
    }

    const error = asObj((latest?.errors as unknown[] | undefined)?.[0])

    return {
      kind: "status",
      status: {
        providerMessageId: asStr(latest?.id) ?? providerMessageId,
        phoneNumberId,
        status,
        recipientId: asStr(latest?.recipient_id) ?? asStr(message.to),
        errorCode:
          typeof error?.code === "number" ? (error.code as number) : undefined,
        errorMessage: asStr(error?.message) ?? asStr(error?.title),
        timestamp: toDate(latest?.timestamp ?? message.timestamp),
      },
    }
  }

  // A phone number when we have one, otherwise the business-scoped user id.
  // Both are stable per (business, user), so either works as the conversation
  // key — but they are NOT interchangeable when sending, which is why the
  // BSUID shape has to survive into `waId` rather than being flattened away.
  const phone = asStr(message.from) ?? asStr(conversation.phone_number)
  const bsuid =
    asStr(message.from_user_id) ?? asStr(conversation.business_scoped_user_id)

  const waId = phone ?? bsuid
  if (!waId) return { kind: "ignored", reason: "no sender" }

  const text = asStr(asObj(message.text)?.body) ?? asStr(kapso.content) ?? ""

  return {
    kind: "message",
    message: {
      providerMessageId,
      waId,
      businessScopedUserId: bsuid,
      // Kapso puts the profile name on the conversation, not the message.
      // A username-only contact has no `contact_name`, but the username is a
      // real name the person chose — better than showing a raw id.
      profileName:
        asStr(conversation.contact_name) ?? asStr(conversation.username),
      providerConversationId: asStr(conversation.id),
      isNewConversation: root.is_new_conversation === true,
      phoneNumberId,
      type: asStr(message.type) ?? "unknown",
      text,
      timestamp: toDate(message.timestamp),
    },
  }
}
