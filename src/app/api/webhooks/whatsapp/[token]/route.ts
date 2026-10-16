import { after, NextRequest, NextResponse } from "next/server"
import { isValidKapsoSignature } from "@/lib/whatsapp/verify"
import { tokenMatches } from "@/lib/whatsapp/webhookToken"
import {
  normalizeKapsoWebhook,
  ORIGIN_BUSINESS_APP,
} from "@/lib/whatsapp/provider"
import { runAgent } from "@/lib/agent/run"
import { countKapsoMessage } from "@/lib/agent/alerts"
import {
  applyStatus,
  claimTurn,
  claimDelivery,
  createHandedOffConversation,
  findConversation,
  haveSentMessage,
  isPaused,
  isWindowOpen,
  recordHumanOutbound,
  recordInbound,
  resolveTenant,
  resumeAfterMsFor,
  upsertConversation,
} from "@/lib/whatsapp/store"
import type { InboundMessage, OutboundMessage } from "@/lib/whatsapp/types"

/**
 * How long to wait before concluding that an outbound message we do not
 * recognise was typed by a human.
 *
 * Kapso fires `whatsapp.message.sent` from the same API call whose response is
 * still unwinding inside `sendText`, so the echo can beat our own
 * `recordOutbound` INSERT. Without this pause the agent would read its OWN
 * reply as a takeover and switch itself off — the worst thing this feature
 * could do. Re-checking after a delay turns that into standing down slightly
 * late, which costs nothing.
 */
const TAKEOVER_CONFIRM_MS = 12_000

/** A wamid recorded within this window of the echo is almost certainly ours. */
const RECENT_SEND_MS = 30_000

/**
 * An inbound message older than this is stored but never answered.
 *
 * Imported history is already dropped by origin; this is the backstop for
 * anything else old — a re-paired coexistence number re-syncing, or a delivery
 * Kapso held back. A reply an hour late to a message the staff may already
 * have handled on the phone does more harm than none.
 */
const STALE_INBOUND_MS = 60 * 60 * 1000

// The reply work happens after the response, so the function must outlive it.
export const maxDuration = 60
export const dynamic = "force-dynamic"

/**
 * Inbound WhatsApp webhook.
 *
 * The shape of this handler is dictated by one constraint: **Kapso requires a
 * 200 within 10 seconds**, then retries at 10s and 40s, three attempts total.
 * A Claude turn takes 2-10s, so doing the work inline would time out, trigger
 * redelivery, and send the customer the same reply two or three times. Verify,
 * dedupe, acknowledge, and only then work — inside `after()`.
 *
 * The `[token]` path segment is a second factor. Kapso signs the body but
 * includes no timestamp, so a captured request is replayable indefinitely and
 * no IP allowlist is published; an unguessable path keeps casual scanners off
 * the endpoint entirely. The HMAC is still the real check.
 */

/**
 * Meta's subscription handshake. Kapso does not use it, but going direct to
 * Meta's Cloud API later needs it and it costs almost nothing to keep here.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  if (!tokenMatches(token)) {
    return new NextResponse("Not found", { status: 404 })
  }

  const url = new URL(request.url)
  const mode = url.searchParams.get("hub.mode")
  const verifyToken = url.searchParams.get("hub.verify_token")
  const challenge = url.searchParams.get("hub.challenge")

  if (
    mode === "subscribe" &&
    verifyToken &&
    verifyToken === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    // Must be echoed as plain text, not JSON.
    return new NextResponse(challenge ?? "", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    })
  }

  return new NextResponse("Forbidden", { status: 403 })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  if (!tokenMatches(token)) {
    return new NextResponse("Not found", { status: 404 })
  }

  // Raw body first, always — the signature covers these exact bytes.
  const raw = await request.text()

  const secret = process.env.KAPSO_WEBHOOK_SECRET?.trim()
  if (!secret) {
    console.error("whatsapp webhook: KAPSO_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Not configured" }, { status: 500 })
  }

  if (
    !isValidKapsoSignature(
      raw,
      request.headers.get("x-webhook-signature"),
      secret,
    )
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const event = normalizeKapsoWebhook(
    body,
    request.headers.get("x-webhook-event"),
  )

  if (event.kind === "ignored") {
    // A 200 — anything else earns a redelivery of something we will ignore again.
    console.warn("whatsapp webhook ignored:", event.reason)
    return NextResponse.json({ received: true, ignored: event.reason })
  }

  // Each kind gets its own prefix. A `whatsapp.message.sent` event and a
  // delivery receipt whose latest status is "sent" would otherwise generate the
  // same key, and `claimDelivery` would swallow whichever arrived second.
  //
  // A Business App echo is keyed on its wamid alone, ignoring the delivery
  // header: Kapso does not promise whether it arrives on `received`, `sent`, or
  // both, and the per-delivery header would let the same message through twice.
  const idempotencyKey =
    event.kind === "outbound" && event.message.origin === ORIGIN_BUSINESS_APP
      ? `sent:${event.message.providerMessageId}`
      : (request.headers.get("x-idempotency-key") ??
        (event.kind === "message"
          ? `msg:${event.message.providerMessageId}`
          : event.kind === "outbound"
            ? `sent:${event.message.providerMessageId}`
            : `status:${event.status.providerMessageId}:${event.status.status}`))

  if (
    !(await claimDelivery(
      idempotencyKey,
      request.headers.get("x-webhook-event"),
    ))
  ) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  if (event.kind === "status") {
    // Cheap enough to do inline.
    await applyStatus(event.status)
    return NextResponse.json({ received: true })
  }

  if (event.kind === "outbound") {
    // Needs a database round-trip and possibly a pause; acknowledge first.
    after(() => handleOutbound(event.message))
    return NextResponse.json({ received: true })
  }

  // Acknowledge now; reply after the response is on its way.
  after(() => handleInbound(event.message, body))

  return NextResponse.json({ received: true })
}

async function handleInbound(message: InboundMessage, raw: unknown) {
  try {
    const tenant = await resolveTenant(message.phoneNumberId)
    if (!tenant) {
      console.warn(
        `whatsapp: no active tenant for phone_number_id ${message.phoneNumberId}`,
      )
      return
    }

    const conversation = await upsertConversation(tenant, message)
    if (!conversation) return

    const isNew = await recordInbound(tenant, conversation, message, raw)
    if (!isNew) return // already processed this wamid
    await countKapsoMessage(tenant)

    const age = Date.now() - message.timestamp.getTime()
    if (age > STALE_INBOUND_MS) {
      console.warn(
        `whatsapp: inbound ${message.providerMessageId} is ` +
          `${Math.round(age / 60_000)} min old, stored but not answered`,
      )
      return
    }

    // A human has taken over, or the agent escalated. Either way it stays
    // quiet — unless the business has been silent long enough that the
    // conversation is fair game again, in which case `claimTurn` reactivates it
    // and tells us to re-introduce the assistant. Per tenant, a chat a person
    // spoke in may never come back (see `resume_after_hours`).
    const turn = await claimTurn(
      conversation,
      new Date(),
      resumeAfterMsFor(tenant),
    )
    if (!turn.allowed) return

    if (!isWindowOpen({ last_inbound_at: message.timestamp.toISOString() })) {
      console.warn("whatsapp: window closed, skipping free-form reply")
      return
    }

    // Replies have been failing; don't pay Claude for more that won't arrive.
    // Staff still see the message on the phone or in the inbox.
    if (isPaused(tenant)) {
      console.warn(
        `whatsapp: ${tenant.tenant_id} paused until ${tenant.paused_until}, not answering`,
      )
      return
    }

    // Claude composes, sends, records the outbound row and meters the cost.
    // It handles its own failures — a broken model call escalates to a human
    // rather than leaving the customer in silence.
    await runAgent(tenant, conversation, message, {
      resumed: turn.resumed,
    })
  } catch (error) {
    // Never throw out of `after()` — the response has already been sent and a
    // rejection here would be an unhandled promise, not a retry.
    console.error("whatsapp: handleInbound failed:", error)
  }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

/**
 * An outbound message echoed back by the provider.
 *
 * If we recorded it, it is the agent's own reply and there is nothing to do.
 * If we did not, a person typed it — in the inbox, or in the WhatsApp Business
 * app on a coexistence number — so store it to keep the transcript complete,
 * and stand the agent down.
 *
 * For an inbox reply the two checks either side of a pause are the safety
 * mechanism: see {@link TAKEOVER_CONFIRM_MS}. A Business App echo skips them —
 * the agent cannot send from the app, so it is never ours, and standing down
 * immediately matters more there: staff and agent are on the same thread.
 */
async function handleOutbound(message: OutboundMessage) {
  try {
    const tenant = await resolveTenant(message.phoneNumberId)
    if (!tenant) return

    const fromBusinessApp = message.origin === ORIGIN_BUSINESS_APP

    if (!fromBusinessApp) {
      if (await haveSentMessage(tenant, message.providerMessageId)) return

      // Not ours *yet*. Give our own write time to land before concluding.
      await sleep(TAKEOVER_CONFIRM_MS)
      if (await haveSentMessage(tenant, message.providerMessageId)) return
    }

    if (!message.waId) {
      console.warn("whatsapp: outbound echo with no recipient, ignoring")
      return
    }
    const waId = message.waId

    let conversation = await findConversation(tenant, waId)

    if (!conversation) {
      // A person started this chat; the agent has never been part of it. Make
      // the row now, already handed off, or the other side's reply would be
      // answered by the assistant.
      conversation = await createHandedOffConversation(tenant, {
        ...message,
        waId,
      })
      if (!conversation) return
      console.log(
        `whatsapp: person-started chat ${conversation.id}, agent stays out`,
      )
    } else if (!fromBusinessApp) {
      // Last guard against the case where `recordOutbound` never wrote the row
      // at all — it swallows insert errors, and is skipped entirely when a send
      // fails. A reply we sent seconds ago must not read as someone else's.
      const lastOut = conversation.last_outbound_at
        ? new Date(conversation.last_outbound_at).getTime()
        : 0
      if (Date.now() - lastOut < RECENT_SEND_MS) {
        console.warn(
          `whatsapp: unrecognised outbound ${message.providerMessageId} but we ` +
            `sent moments ago — treating as ours, not a takeover`,
        )
        return
      }
    }

    console.log(`whatsapp: human takeover on conversation ${conversation.id}`)
    await recordHumanOutbound(tenant, conversation, message)
    await countKapsoMessage(tenant)
  } catch (error) {
    console.error("whatsapp: handleOutbound failed:", error)
  }
}
