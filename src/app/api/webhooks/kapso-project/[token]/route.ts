import { NextRequest, NextResponse } from "next/server"
import { isValidKapsoSignature } from "@/lib/whatsapp/verify"
import { tokenMatches } from "@/lib/whatsapp/webhookToken"
import { normalizeKapsoProjectEvent } from "@/lib/whatsapp/provider"
import { claimDelivery, findTenantByPhoneNumberId } from "@/lib/whatsapp/store"
import { sendConnectionAlert } from "@/lib/agent/alerts"

export const dynamic = "force-dynamic"

/**
 * Kapso PROJECT webhook: a WhatsApp number's connection changed.
 *
 * Separate from the message webhook because Kapso sends these only to
 * project-level webhooks, and because each client's Kapso account generates
 * its own signing secret (project webhooks do not accept a supplied one). The
 * message route keeps its single KAPSO_WEBHOOK_SECRET untouched.
 *
 * Every configured `KAPSO_PROJECT_WEBHOOK_SECRET*` is tried, since the tenant
 * is only known after parsing. The secret that verified must then be the one
 * the number's tenant names — otherwise one client's Kapso account could send
 * alerts about another client's number.
 *
 * Nothing here changes what the agent does: a disconnected number simply stops
 * delivering messages. The point is that someone finds out.
 */

const SECRET_NAME = /^KAPSO_PROJECT_WEBHOOK_SECRET(_[A-Z0-9]+)?$/

function verifiedSecretName(
  raw: string,
  signature: string | null,
): string | null {
  for (const [name, value] of Object.entries(process.env)) {
    if (!SECRET_NAME.test(name) || !value?.trim()) continue
    if (isValidKapsoSignature(raw, signature, value.trim())) return name
  }
  return null
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

  const secretName = verifiedSecretName(
    raw,
    request.headers.get("x-webhook-signature"),
  )
  if (!secretName) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = normalizeKapsoProjectEvent(
    body,
    request.headers.get("x-webhook-event"),
  )
  if (parsed.kind === "ignored") {
    // A 200 — anything else earns a redelivery of something we will ignore.
    console.warn("kapso project webhook ignored:", parsed.reason)
    return NextResponse.json({ received: true, ignored: parsed.reason })
  }
  const { event } = parsed

  const tenant = await findTenantByPhoneNumberId(event.phoneNumberId)
  if (!tenant) {
    console.warn(
      `kapso project webhook: no tenant for phone_number_id ${event.phoneNumberId}`,
    )
    return NextResponse.json({ received: true, ignored: "unknown number" })
  }

  const expected =
    tenant.kapso_project_secret_env ?? "KAPSO_PROJECT_WEBHOOK_SECRET"
  if (secretName !== expected) {
    console.error(
      `kapso project webhook: ${event.phoneNumberId} belongs to ` +
        `${tenant.tenant_id} (${expected}) but was signed with ${secretName}`,
    )
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  // Kapso retries on any non-200; one email per event, not per delivery.
  const key =
    request.headers.get("x-idempotency-key") ??
    `conn:${event.eventId ?? `${event.event}:${event.phoneNumberId}:${event.occurredAt ?? ""}`}`
  if (!(await claimDelivery(key, `whatsapp.phone_number.${event.event}`))) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  console.warn(
    `kapso project webhook: ${tenant.tenant_id} ${event.event}` +
      (event.reason ? ` (${event.reason})` : ""),
  )
  await sendConnectionAlert(tenant, event)

  return NextResponse.json({ received: true })
}
