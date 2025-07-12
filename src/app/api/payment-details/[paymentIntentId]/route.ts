import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentIntentId: string }> },
) {
  try {
    const { paymentIntentId } = await params

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment Intent ID is required" },
        { status: 400 },
      )
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (!paymentIntent) {
      return NextResponse.json(
        { error: "Payment Intent not found" },
        { status: 404 },
      )
    }

    // Return only the necessary details for security
    const paymentDetails = {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      created: paymentIntent.created,
      description: paymentIntent.description,
      receipt_email: paymentIntent.receipt_email,
      metadata: paymentIntent.metadata,
    }

    return NextResponse.json({
      success: true,
      paymentIntent: paymentDetails,
    })
  } catch (error) {
    console.error("Error fetching payment details:", error)

    return NextResponse.json(
      { error: "Failed to fetch payment details" },
      { status: 500 },
    )
  }
}
