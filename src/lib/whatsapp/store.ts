import "server-only"
import { getSupabase } from "@/lib/supabase/serverClient"
import type { InboundMessage, StatusUpdate } from "./types"

/** Postgres unique-violation. A duplicate here is expected, not an error. */
const UNIQUE_VIOLATION = "23505"

export interface Tenant {
  tenant_id: string
  business_name: string
  active: boolean
  phone_number_id: string
  model: string
  default_locale: string
  locales: string[]
  system_prompt: string | null
  greeting: Record<string, string> | null
  escalation_email: string | null
  escalation_whatsapp: string | null
  cost_this_month_usd: number | null
  messages_this_month: number | null
  monthly_cost_cap_usd: number | null
}

export interface Conversation {
  id: string
  tenant_id: string
  wa_id: string
  locale: string | null
  status: "active" | "awaiting-human" | "handed-off" | "closed"
  last_inbound_at: string | null
  last_outbound_at: string | null
  turn_count: number
  cost_usd: number | null
}

/**
 * Claim a webhook delivery.
 *
 * Kapso retries at 10s and 40s on any non-200 and states that duplicate
 * delivery is expected, so every event type must be idempotent — not just
 * inbound messages. Inserting the delivery key first turns a redelivery into a
 * primary-key conflict, which also covers status events that carry no new
 * message id of their own.
 *
 * Returns false when this delivery has already been processed.
 */
export async function claimDelivery(
  idempotencyKey: string,
  event: string | null,
): Promise<boolean> {
  const supabase = getSupabase()
  if (!supabase) return true // not configured: do not block processing

  const { error } = await supabase
    .from("webhook_deliveries")
    .insert({ idempotency_key: idempotencyKey, event })

  if (error) {
    if (error.code === UNIQUE_VIOLATION) return false
    // Any other failure: log and let the message through rather than dropping
    // a real customer enquiry over a bookkeeping table.
    console.error("claimDelivery failed:", error)
  }
  return true
}

/** Resolve the tenant a message arrived for. Null means "not ours" — ack and drop. */
export async function resolveTenant(
  phoneNumberId: string,
): Promise<Tenant | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("phone_number_id", phoneNumberId)
    .eq("active", true)
    .maybeSingle()

  if (error) {
    console.error("resolveTenant failed:", error)
    return null
  }
  return (data as Tenant) ?? null
}

/** Find or create the conversation, and stamp `last_inbound_at`. */
export async function upsertConversation(
  tenant: Tenant,
  message: InboundMessage,
): Promise<Conversation | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const inboundAt = message.timestamp.toISOString()

  const { data, error } = await supabase
    .from("conversations")
    .upsert(
      {
        tenant_id: tenant.tenant_id,
        wa_id: message.waId,
        provider_conversation_id: message.providerConversationId,
        business_scoped_user_id: message.businessScopedUserId,
        profile_name: message.profileName,
        last_inbound_at: inboundAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "tenant_id,wa_id" },
    )
    .select("*")
    .single()

  if (error) {
    console.error("upsertConversation failed:", error)
    return null
  }
  return data as Conversation
}

/**
 * Store an inbound message.
 *
 * Returns false when the message was already stored — the unique constraint on
 * (tenant_id, provider_message_id) makes a redelivered `wamid` a no-op rather
 * than a duplicate transcript entry.
 */
export async function recordInbound(
  tenant: Tenant,
  conversation: Conversation,
  message: InboundMessage,
  raw: unknown,
): Promise<boolean> {
  const supabase = getSupabase()
  if (!supabase) return false

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversation.id,
    tenant_id: tenant.tenant_id,
    provider_message_id: message.providerMessageId,
    direction: "inbound",
    role: "user",
    type: message.type,
    body: message.text,
    sent_at: message.timestamp.toISOString(),
    raw,
  })

  if (error) {
    if (error.code === UNIQUE_VIOLATION) return false
    console.error("recordInbound failed:", error)
    return false
  }
  return true
}

export async function recordOutbound(
  tenant: Tenant,
  conversation: Conversation,
  providerMessageId: string,
  body: string,
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  const now = new Date().toISOString()

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversation.id,
    tenant_id: tenant.tenant_id,
    provider_message_id: providerMessageId,
    direction: "outbound",
    role: "assistant",
    type: "text",
    body,
    status: "sent",
    sent_at: now,
  })
  if (error && error.code !== UNIQUE_VIOLATION) {
    console.error("recordOutbound failed:", error)
  }

  await supabase
    .from("conversations")
    .update({ last_outbound_at: now, updated_at: now })
    .eq("id", conversation.id)
}

/** Apply a delivery-status webhook to the outbound row it describes. */
export async function applyStatus(status: StatusUpdate): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  const { error } = await supabase
    .from("messages")
    .update({
      status: status.status,
      error_code: status.errorCode ?? null,
      error_message: status.errorMessage ?? null,
    })
    .eq("provider_message_id", status.providerMessageId)

  if (error) console.error("applyStatus failed:", error)
}

/**
 * Is the 24-hour customer service window open?
 *
 * Neither Meta nor Kapso exposes this as a flag, so the app computes it from
 * the last inbound message. Outside the window only approved templates can be
 * sent; a free-form send fails with error 131047.
 */
export function isWindowOpen(
  conversation: Pick<Conversation, "last_inbound_at">,
  now = new Date(),
): boolean {
  if (!conversation.last_inbound_at) return false
  const last = new Date(conversation.last_inbound_at).getTime()
  return now.getTime() - last < 24 * 60 * 60 * 1000
}

/**
 * Recent turns for the model, oldest first.
 *
 * Capped rather than unbounded: every turn re-sends the whole history, so an
 * uncapped transcript grows the per-turn cost without bound. Rows beyond the
 * cap stay in the database — they are just not replayed to the model.
 */
export async function loadHistory(
  conversation: Conversation,
  limit = 40,
): Promise<{ role: "user" | "assistant"; content: string }[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("messages")
    .select("direction, body, created_at")
    .eq("conversation_id", conversation.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("loadHistory failed:", error)
    return []
  }

  return (data ?? [])
    .reverse()
    .filter(m => typeof m.body === "string" && m.body.trim())
    .map(m => ({
      role:
        m.direction === "inbound" ? ("user" as const) : ("assistant" as const),
      content: m.body as string,
    }))
}

/** Hand the conversation to a human. The agent stops replying after this. */
export async function markEscalated(
  conversation: Conversation,
  reason: string,
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return
  const { error } = await supabase
    .from("conversations")
    .update({
      status: "awaiting-human",
      escalated_at: new Date().toISOString(),
      escalation_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversation.id)
  if (error) console.error("markEscalated failed:", error)
}

/**
 * Record what the turn cost and learned.
 *
 * `cost_usd` and `messages_this_month` are the meter: built now even though
 * nothing enforces a cap yet, because retrofitting cost accounting after a
 * surprise bill is the classic mistake.
 */
export async function recordTurn(
  tenant: Tenant,
  conversation: Conversation,
  opts: { locale?: string; costUsd: number },
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  const { error } = await supabase
    .from("conversations")
    .update({
      turn_count: conversation.turn_count + 1,
      cost_usd: Number(
        (Number(conversation.cost_usd ?? 0) + opts.costUsd).toFixed(4),
      ),
      ...(opts.locale && !conversation.locale ? { locale: opts.locale } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversation.id)
  if (error) console.error("recordTurn failed:", error)

  const { error: tErr } = await supabase
    .from("tenants")
    .update({
      cost_this_month_usd: Number(
        (Number(tenant.cost_this_month_usd ?? 0) + opts.costUsd).toFixed(4),
      ),
      messages_this_month: (tenant.messages_this_month ?? 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("tenant_id", tenant.tenant_id)
  if (tErr) console.error("recordTurn (tenant) failed:", tErr)
}
