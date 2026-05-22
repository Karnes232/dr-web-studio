import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import { serverClient } from "@/sanity/lib/serverClient"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get("stripe-signature")

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const docId = `webhookEvent.${event.id}`
  try {
    await serverClient.create({
      _id: docId,
      _type: "webhookEvent",
      eventId: event.id,
      type: event.type,
      receivedAt: new Date().toISOString(),
    })
  } catch {
    // _id collision means we've already processed this event — safe to return 200.
    return NextResponse.json({ received: true, duplicate: true })
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object
      console.log("Payment succeeded:", paymentIntent.id)
      break
    }
    case "payment_intent.payment_failed": {
      const failedPayment = event.data.object
      console.log("Payment failed:", failedPayment.id)
      break
    }
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
