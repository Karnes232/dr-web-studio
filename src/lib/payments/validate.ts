import type Stripe from "stripe"
import { clampString } from "@/lib/botpoison-verify"
import {
  DEFAULT_LOCALE,
  LOCALES,
  MAX_CENTS,
  MIN_CENTS,
  PAYMENT_SOURCE,
  type PaymentLocale,
} from "./config"

/** Error codes the client maps to translated messages (`checkout.error_*`). */
export type CheckoutErrorCode =
  | "amount_invalid"
  | "amount_min"
  | "amount_max"
  | "name_required"
  | "email_required"
  | "email_invalid"

export interface CheckoutInput {
  /** Integer cents. */
  amount: number
  customerName: string
  customerEmail: string
  lang: PaymentLocale
  attemptId?: string
}

export type ParseResult =
  | { ok: true; value: CheckoutInput }
  | { ok: false; code: CheckoutErrorCode }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ATTEMPT_ID_RE = /^[A-Za-z0-9-]{8,64}$/

export function isLocale(value: unknown): value is PaymentLocale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  )
}

/**
 * Validate the create-payment-intent body. The amount must already be integer
 * cents: the server never rounds a float into money. A `currency` field in the
 * body is ignored on purpose; the route always charges in USD.
 */
export function parseCheckoutInput(body: unknown): ParseResult {
  const b = (body && typeof body === "object" ? body : {}) as Record<
    string,
    unknown
  >

  const amount = b.amount
  if (typeof amount !== "number" || !Number.isSafeInteger(amount)) {
    return { ok: false, code: "amount_invalid" }
  }
  if (amount < MIN_CENTS) return { ok: false, code: "amount_min" }
  if (amount > MAX_CENTS) return { ok: false, code: "amount_max" }

  const customerName = clampString(b.customerName, 100)
  if (!customerName) return { ok: false, code: "name_required" }

  const customerEmail = clampString(b.customerEmail, 254)
  if (!customerEmail) return { ok: false, code: "email_required" }
  if (!EMAIL_RE.test(customerEmail)) return { ok: false, code: "email_invalid" }

  const lang = isLocale(b.lang) ? b.lang : DEFAULT_LOCALE
  const attemptId =
    typeof b.attemptId === "string" && ATTEMPT_ID_RE.test(b.attemptId)
      ? b.attemptId
      : undefined

  return {
    ok: true,
    value: { amount, customerName, customerEmail, lang, attemptId },
  }
}

export interface PaymentMetadata {
  customerName: string
  customerEmail: string
  lang: PaymentLocale
}

/** Read back what the create route stamped on the PaymentIntent. */
export function readPaymentMetadata(
  pi: Pick<Stripe.PaymentIntent, "metadata">,
): PaymentMetadata {
  const m = pi.metadata ?? {}
  return {
    customerName: clampString(m.customerName, 100),
    customerEmail: clampString(m.customerEmail, 254),
    lang: isLocale(m.lang) ? m.lang : DEFAULT_LOCALE,
  }
}

/** Is this a PaymentIntent the custom-payment checkout created? */
export function isOurPayment(
  pi: Pick<Stripe.PaymentIntent, "metadata">,
): boolean {
  return pi.metadata?.source === PAYMENT_SOURCE
}
