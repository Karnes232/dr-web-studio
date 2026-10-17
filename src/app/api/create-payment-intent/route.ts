import { createHash } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { verifyBotpoisonSolution } from "@/lib/botpoison-verify"
import { CURRENCY, PAYMENT_SOURCE } from "@/lib/payments/config"
import { parseCheckoutInput } from "@/lib/payments/validate"

export const runtime = "nodejs"

/**
 * Creates the PaymentIntent for the custom-payment checkout.
 *
 * The server owns the money: amount is validated integer cents, the currency
 * is always USD whatever the body says, and no `receipt_email` is set so
 * Stripe sends no receipt of its own. The confirmation email comes from the
 * webhook (see /api/webhooks/stripe).
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 })
  }

  const solution = typeof body?._botpoison === "string" ? body._botpoison : ""
  if (!solution) {
    return NextResponse.json(
      { error: "verification_required" },
      { status: 400 },
    )
  }

  let verified = false
  try {
    verified = await verifyBotpoisonSolution(solution)
  } catch (err) {
    console.error("BotPoison verification request failed", err)
  }
  if (!verified) {
    return NextResponse.json({ error: "verification_failed" }, { status: 403 })
  }

  const parsed = parseCheckoutInput(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.code }, { status: 400 })
  }
  const { amount, customerName, customerEmail, lang, attemptId } = parsed.value

  try {
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency: CURRENCY,
        automatic_payment_methods: { enabled: true },
        description: `Custom payment from ${customerName}`,
        metadata: {
          source: PAYMENT_SOURCE,
          customerName,
          customerEmail,
          lang,
        },
      },
      attemptId
        ? {
            // The same form session retrying the same details reuses one
            // PaymentIntent instead of leaving orphans behind.
            idempotencyKey: createHash("sha256")
              .update(
                [attemptId, amount, customerEmail, customerName].join("|"),
              )
              .digest("hex"),
          }
        : undefined,
    )

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error(
      "Error creating payment intent:",
      error instanceof Error ? error.name : "unknown",
    )
    return NextResponse.json({ error: "create_failed" }, { status: 500 })
  }
}
