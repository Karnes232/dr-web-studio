import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { sendPaymentEmails } from "@/lib/payments/emails"
import { recordSucceeded } from "@/lib/payments/store"
import { isOurPayment, readPaymentMetadata } from "@/lib/payments/validate"

export const runtime = "nodejs"

/**
 * The source of truth for "this customer paid".
 *
 * On `payment_intent.succeeded` we record the payment in Supabase and send the
 * confirmation emails, once, no matter how many times Stripe delivers the
 * event. Nothing in the browser can trigger an email any more.
 *
 * Order matters:
 *   1. verify the signature against the RAW body;
 *   2. ignore every other event type (200);
 *   3. re-fetch the PaymentIntent from Stripe: never trust the payload alone;
 *   4. skip payments this checkout did not create (200, no email);
 *   5. record (insert-if-absent), then email (claim -> send -> mark).
 * Steps 5 runs inline, not in after(): a failure must surface as a 5xx so
 * Stripe retries. Every step is idempotent, so a retry never double-sends.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 })
  }

  if (event.type !== "payment_intent.succeeded") {
    return NextResponse.json({ received: true })
  }

  const eventPi = event.data.object as Stripe.PaymentIntent
  try {
    const pi = await stripe.paymentIntents.retrieve(eventPi.id, {
      expand: ["latest_charge"],
    })

    if (pi.status !== "succeeded" || !isOurPayment(pi)) {
      return NextResponse.json({ received: true, ignored: true })
    }

    const meta = readPaymentMetadata(pi)
    const charge =
      pi.latest_charge && typeof pi.latest_charge === "object"
        ? pi.latest_charge
        : null
    const paidAt = new Date((charge?.created ?? event.created) * 1000)

    await recordSucceeded({
      paymentIntentId: pi.id,
      livemode: pi.livemode,
      amount: pi.amount,
      currency: pi.currency,
      customerName: meta.customerName,
      customerEmail: meta.customerEmail,
      locale: meta.lang,
      paidAt,
      lastEventId: event.id,
    })

    await sendPaymentEmails({
      paymentIntentId: pi.id,
      amount: pi.amount,
      currency: pi.currency,
      customerName: meta.customerName,
      customerEmail: meta.customerEmail,
      locale: meta.lang,
      paidAt,
      receiptUrl: charge?.receipt_url ?? undefined,
    })

    return NextResponse.json({ received: true })
  } catch (err) {
    // Ids and error text only: no customer name or email in logs.
    console.error(
      `Stripe webhook failed for ${eventPi.id} (event ${event.id}):`,
      err instanceof Error ? err.message : "unknown error",
    )
    return NextResponse.json({ error: "processing_failed" }, { status: 500 })
  }
}
