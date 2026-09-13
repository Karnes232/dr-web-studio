import { after, NextRequest, NextResponse } from "next/server"
import { timingSafeEqual } from "crypto"
import { isValidKapsoSignature } from "@/lib/whatsapp/verify"
import { normalizeKapsoWebhook } from "@/lib/whatsapp/provider"
import { runAgent } from "@/lib/agent/run"
import {
  applyStatus,
  claimDelivery,
  isWindowOpen,
  recordInbound,
  resolveTenant,
  upsertConversation,
} from "@/lib/whatsapp/store"
import type { InboundMessage } from "@/lib/whatsapp/types"

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

function tokenMatches(token: string): boolean {
  // Trimmed: pasting into a hosting provider's env-var box readily picks up a
  // trailing newline, which would fail the compare with no visible cause.
  const expected = process.env.WHATSAPP_WEBHOOK_TOKEN?.trim()
  if (!expected) {
    console.error("whatsapp webhook: WHATSAPP_WEBHOOK_TOKEN is not set")
    return false
  }
  const a = Buffer.from(token.trim())
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

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

  const idempotencyKey =
    request.headers.get("x-idempotency-key") ??
    (event.kind === "message"
      ? `msg:${event.message.providerMessageId}`
      : `status:${event.status.providerMessageId}:${event.status.status}`)

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

    // A human has taken over; the agent must stay quiet. Checked before any
    // reply is composed.
    if (conversation.status !== "active") return

    if (!isWindowOpen({ last_inbound_at: message.timestamp.toISOString() })) {
      console.warn("whatsapp: window closed, skipping free-form reply")
      return
    }

    // Claude composes, sends, records the outbound row and meters the cost.
    // It handles its own failures — a broken model call escalates to a human
    // rather than leaving the customer in silence.
    await runAgent(tenant, conversation, message)
  } catch (error) {
    // Never throw out of `after()` — the response has already been sent and a
    // rejection here would be an unhandled promise, not a retry.
    console.error("whatsapp: handleInbound failed:", error)
  }
}
