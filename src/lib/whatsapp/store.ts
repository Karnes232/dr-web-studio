import "server-only"
import { getSupabase } from "@/lib/supabase/serverClient"
import type { InboundMessage, OutboundMessage, StatusUpdate } from "./types"

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
  lead_id: string | null
}

/**
 * How long the business must stay silent before the agent picks a handed-off or
 * escalated conversation back up.
 *
 * Measured from `last_outbound_at` — the last time *the business* said
 * anything, agent or human — not from `last_inbound_at`, which
 * `upsertConversation` has already stamped with the message being handled by
 * the time anything reads it, and is therefore always "now".
 */
export const RESUME_AFTER_MS = 5 * 24 * 60 * 60 * 1000

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

export interface OutboundUsage {
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
  costUsd: number
  apiCalls: number
}

export async function recordOutbound(
  tenant: Tenant,
  conversation: Conversation,
  providerMessageId: string,
  body: string,
  usage?: OutboundUsage,
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
    ...(usage
      ? {
          input_tokens: usage.inputTokens,
          output_tokens: usage.outputTokens,
          cache_read_tokens: usage.cacheReadTokens,
          cache_write_tokens: usage.cacheWriteTokens,
          cost_usd: Number(usage.costUsd.toFixed(6)),
          api_calls: usage.apiCalls,
        }
      : {}),
  })
  if (error && error.code !== UNIQUE_VIOLATION) {
    console.error("recordOutbound failed:", error)
  }

  await supabase
    .from("conversations")
    .update({ last_outbound_at: now, updated_at: now })
    .eq("id", conversation.id)
}

/**
 * Have we already recorded this outbound message ourselves?
 *
 * This is the whole basis of takeover detection. Kapso reports every outbound
 * message as `origin: "cloud_api"` whether the agent's API call or a person
 * typing in the inbox produced it, so the only thing that distinguishes them is
 * whether `recordOutbound` had already written the wamid.
 *
 * Scoped by tenant so the lookup uses the (tenant_id, provider_message_id)
 * unique index rather than scanning.
 */
export async function haveSentMessage(
  tenant: Tenant,
  providerMessageId: string,
): Promise<boolean> {
  const supabase = getSupabase()
  if (!supabase) return true // not configured: assume ours, never stand down

  const { data, error } = await supabase
    .from("messages")
    .select("id")
    .eq("tenant_id", tenant.tenant_id)
    .eq("provider_message_id", providerMessageId)
    .maybeSingle()

  if (error) {
    // Fail SAFE, not open: a lookup failure must not be read as "a human sent
    // this", or a transient Supabase error would silence the agent.
    console.error("haveSentMessage failed:", error)
    return true
  }
  return !!data
}

/** Find an existing conversation by the customer's id. Never creates one. */
export async function findConversation(
  tenant: Tenant,
  waId: string,
): Promise<Conversation | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("tenant_id", tenant.tenant_id)
    .eq("wa_id", waId)
    .maybeSingle()

  if (error) {
    console.error("findConversation failed:", error)
    return null
  }
  return (data as Conversation) ?? null
}

/**
 * Store a message a person typed in the provider's inbox, and stand the agent
 * down.
 *
 * `role` stays `'assistant'`: from the model's point of view the business said
 * this, and `loadHistory` must replay it as such. Authorship lives in its own
 * column because `role` is CHECK-constrained to user|assistant|system, and a
 * violation there is swallowed silently by the insert's error branch.
 */
export async function recordHumanOutbound(
  tenant: Tenant,
  conversation: Conversation,
  message: OutboundMessage,
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return

  const sentAt = message.timestamp.toISOString()
  const now = new Date().toISOString()

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversation.id,
    tenant_id: tenant.tenant_id,
    provider_message_id: message.providerMessageId,
    direction: "outbound",
    role: "assistant",
    authored_by: "human",
    type: message.type,
    body: message.text,
    status: "sent",
    sent_at: sentAt,
  })
  if (error && error.code !== UNIQUE_VIOLATION) {
    console.error("recordHumanOutbound failed:", error)
  }

  const { error: cErr } = await supabase
    .from("conversations")
    .update({
      status: "handed-off",
      handed_off_at: now,
      last_outbound_at: sentAt,
      updated_at: now,
    })
    .eq("id", conversation.id)
  if (cErr) console.error("recordHumanOutbound (conversation) failed:", cErr)
}

/**
 * The pure half of {@link claimTurn}: may the agent answer, and does the
 * conversation need reactivating first?
 *
 * Separated so the idle rule — the part most easily got wrong — is testable
 * without a database, the same way `isWindowOpen` is.
 *
 * Idleness is measured from `last_outbound_at` deliberately.
 * `upsertConversation` stamps `last_inbound_at` with the message currently
 * being handled before anything reads the row, so that field is always "now"
 * and cannot express "how long has this been quiet". `last_outbound_at` means
 * "the last time the business said anything" — agent or human, since
 * `recordHumanOutbound` maintains it too — which is the intended semantic.
 *
 * A conversation that was handed off before ever receiving a reply has a null
 * `last_outbound_at`; treating that as epoch means it is immediately eligible,
 * which is right — nobody is mid-exchange with the customer.
 */
export function turnDecision(
  conversation: Pick<Conversation, "status" | "last_outbound_at">,
  now = new Date(),
): { allowed: boolean; resumed: boolean; reactivate: boolean } {
  if (conversation.status === "active") {
    return { allowed: true, resumed: false, reactivate: false }
  }
  if (conversation.status === "closed") {
    return { allowed: false, resumed: false, reactivate: false }
  }

  const last = conversation.last_outbound_at
    ? new Date(conversation.last_outbound_at).getTime()
    : 0
  if (now.getTime() - last < RESUME_AFTER_MS) {
    return { allowed: false, resumed: false, reactivate: false }
  }
  return { allowed: true, resumed: true, reactivate: true }
}

/**
 * May the agent answer this conversation?
 *
 * Replaces a bare `status !== "active"` early-return. A conversation the agent
 * escalated, or that a human took over, comes back automatically once the
 * business has been silent for {@link RESUME_AFTER_MS} — otherwise a customer
 * who returns weeks later is met with permanent silence, which is what the
 * original one-way `markEscalated` produced.
 *
 * Returns `{ allowed, resumed }`; `resumed` tells the caller to have the agent
 * re-introduce itself, since its usual "disclose on the first reply" rule
 * cannot fire when there is already history.
 */
export async function claimTurn(
  conversation: Conversation,
  now = new Date(),
): Promise<{ allowed: boolean; resumed: boolean }> {
  const decision = turnDecision(conversation, now)
  if (!decision.reactivate) return decision

  const supabase = getSupabase()
  if (!supabase) return { allowed: false, resumed: false }

  const { error } = await supabase
    .from("conversations")
    .update({ status: "active", updated_at: now.toISOString() })
    .eq("id", conversation.id)

  if (error) {
    // Could not reclaim it — stay quiet rather than answer over a human.
    console.error("claimTurn failed:", error)
    return { allowed: false, resumed: false }
  }

  console.log(
    `agent: resuming ${conversation.id} after ${conversation.status}, ` +
      `business silent since ${conversation.last_outbound_at ?? "never"}`,
  )
  return { allowed: true, resumed: true }
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

/** Link the conversation to the lead row it created, so later saves update it. */
export async function linkLead(
  conversation: Conversation,
  leadId: string,
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return
  const { error } = await supabase
    .from("conversations")
    .update({ lead_id: leadId, updated_at: new Date().toISOString() })
    .eq("id", conversation.id)
  if (error) console.error("linkLead failed:", error)
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
