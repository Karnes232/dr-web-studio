import "server-only"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { isOurPayment } from "./validate"

/** The only fields the success page may see. No name, email or metadata. */
export interface PaymentSummary {
  id: string
  /** Integer cents. */
  amount: number
  currency: string
  status: Stripe.PaymentIntent.Status
  /** Unix seconds. */
  created: number
}

const PI_ID = /^pi_[A-Za-z0-9]+$/

/**
 * Look up a payment for the success page. Null means "show a 404": the id is
 * malformed, Stripe has no such intent, or it is not one of ours. Anything
 * else (network, auth, rate limit) is re-thrown so the page errors instead of
 * telling a paying customer their payment does not exist.
 */
export async function getPaymentSummary(
  id: string | undefined,
): Promise<PaymentSummary | null> {
  if (!id || !PI_ID.test(id)) return null

  let pi: Stripe.PaymentIntent
  try {
    pi = await stripe.paymentIntents.retrieve(id)
  } catch (err) {
    const e = err as { code?: string; statusCode?: number }
    if (e?.code === "resource_missing" || e?.statusCode === 404) return null
    throw err
  }

  if (!isOurPayment(pi)) return null

  return {
    id: pi.id,
    amount: pi.amount,
    currency: pi.currency,
    status: pi.status,
    created: pi.created,
  }
}
