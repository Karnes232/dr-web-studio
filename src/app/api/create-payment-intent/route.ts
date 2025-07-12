import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const {
      amount,
      currency = "usd",
      customerName,
      customerEmail,
    } = await request.json()

    // Create the payment intent with customer information
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      // Add customer information
      receipt_email: customerEmail,
      description: `Payment from ${customerName}`,
      metadata: {
        customer_name: customerName,
        customer_email: customerEmail,
      },
      // Optional: Create or use existing customer
      // customer: customerId, // You can create a customer first if needed
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { error: "Error creating payment intent" },
      { status: 500 },
    )
  }
}
