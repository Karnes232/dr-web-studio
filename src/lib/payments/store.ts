import "server-only"
import { getSupabase } from "@/lib/supabase/serverClient"
import type { PaymentLocale } from "./config"

/**
 * The `payments` table (supabase/migrations/0010_payments.sql).
 *
 * Unlike the WhatsApp dedup in lib/whatsapp/store.ts, which lets a message
 * through when bookkeeping fails, every function here FAILS CLOSED: it throws.
 * The Stripe webhook turns a throw into a 500, and Stripe retries. Dropping a
 * paid customer's confirmation is worse than being asked twice.
 */

export type EmailKind = "customer" | "owner"

/** How long a claim blocks other deliveries before it may be taken over. */
export const CLAIM_LEASE_MS = 2 * 60 * 1000

export interface PaymentRecord {
  paymentIntentId: string
  livemode: boolean
  /** Integer cents. */
  amount: number
  currency: string
  customerName: string
  customerEmail: string
  locale: PaymentLocale
  paidAt: Date
  lastEventId: string
}

function requireSupabase() {
  const supabase = getSupabase()
  if (!supabase) throw new Error("Supabase is not configured")
  return supabase
}

/** Insert the payment; a repeat delivery is a silent no-op. */
export async function recordSucceeded(record: PaymentRecord): Promise<void> {
  const supabase = requireSupabase()
  const { error } = await supabase.from("payments").upsert(
    {
      payment_intent_id: record.paymentIntentId,
      livemode: record.livemode,
      amount: record.amount,
      currency: record.currency,
      customer_name: record.customerName,
      customer_email: record.customerEmail,
      locale: record.locale,
      paid_at: record.paidAt.toISOString(),
      last_event_id: record.lastEventId,
    },
    { onConflict: "payment_intent_id", ignoreDuplicates: true },
  )
  if (error) throw new Error(`recordSucceeded failed: ${error.code ?? ""}`)
}

/**
 * Take the lease to send one email. True means "you send it"; false means it
 * is already sent, or another delivery is sending it right now. One atomic
 * UPDATE, so two concurrent deliveries cannot both win.
 */
export async function claimEmail(
  paymentIntentId: string,
  kind: EmailKind,
  now: Date = new Date(),
): Promise<boolean> {
  const supabase = requireSupabase()
  const claimed = `${kind}_email_claimed_at`
  const sent = `${kind}_email_sent_at`
  const expired = new Date(now.getTime() - CLAIM_LEASE_MS).toISOString()

  const { data, error } = await supabase
    .from("payments")
    .update({ [claimed]: now.toISOString() })
    .eq("payment_intent_id", paymentIntentId)
    .is(sent, null)
    .or(`${claimed}.is.null,${claimed}.lt.${expired}`)
    .select("payment_intent_id")

  if (error) throw new Error(`claimEmail failed: ${error.code ?? ""}`)
  return (data?.length ?? 0) > 0
}

/** Record that the email went out. Call only after Resend accepted it. */
export async function markEmailSent(
  paymentIntentId: string,
  kind: EmailKind,
  now: Date = new Date(),
): Promise<void> {
  const supabase = requireSupabase()
  const { error } = await supabase
    .from("payments")
    .update({ [`${kind}_email_sent_at`]: now.toISOString() })
    .eq("payment_intent_id", paymentIntentId)
  if (error) throw new Error(`markEmailSent failed: ${error.code ?? ""}`)
}
