# Stripe Payment Flow

## Overview

The site uses **Stripe Payment Intents** with a custom checkout UI (not Stripe Checkout hosted pages). The client enters their own payment amount, which suits custom project invoices.

**Stripe API version**: `2025-06-30.basil` (set in `src/lib/stripe.ts`; pin the same version on the dashboard webhook endpoint).

**The webhook is the source of truth.** The browser never sends an email and never decides that a payment succeeded. On `payment_intent.succeeded` the webhook records the payment in Supabase and sends the confirmation emails once. The success page reads the status from Stripe on the server.

---

## Flow

```
/[lang]/custom-payment            (server page: <main>, <h1>, card shell)
  └─ CheckoutFlow                 (client, step 1: name, email, amount)
       │  BotPoison solution on submit
       ├─ POST /api/create-payment-intent  -> { clientSecret }
       │
       └─ PaymentStep             (next/dynamic, ssr:false, step 2)
            └─ <Elements> + CheckoutForm -> stripe.confirmPayment(
                  return_url, redirect: "if_required")
                  succeeded | processing -> /[lang]/payment-success?payment_intent=pi_...

Stripe ──payment_intent.succeeded──> POST /api/webhooks/stripe
   verify signature (raw body) -> re-fetch PI (expand latest_charge)
   -> ours? (metadata.source) -> payments insert-if-absent
   -> customer email (claim -> send -> mark) -> owner email (claim -> send -> mark)
   any failure -> 500 -> Stripe retries

/[lang]/payment-success?payment_intent=pi_...   (server, dynamic)
   getPaymentSummary(id) -> 404 | paid | processing | not completed
```

---

## Files

| File                                                         | Role                                                                          |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `src/lib/stripe.ts`                                          | Server-side `Stripe` instance (`STRIPE_SECRET_KEY`)                           |
| `src/lib/stripe-client.ts`                                   | Client-side `loadStripe()` (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)             |
| `src/lib/payments/config.ts`                                 | Limits (`MIN_CENTS`, `MAX_CENTS`), `CURRENCY`, `PAYMENT_SOURCE`, fallbacks   |
| `src/lib/payments/validate.ts`                               | Pure: `parseCheckoutInput`, `readPaymentMetadata`, `isOurPayment`             |
| `src/lib/payments/format.ts`                                 | Pure: `formatMoney` (cents), `formatPaidAt` (America/Santo_Domingo)           |
| `src/lib/payments/store.ts`                                  | `payments` table: `recordSucceeded`, `claimEmail`, `markEmailSent` (throws)   |
| `src/lib/payments/emails.ts`                                 | `sendPaymentEmails`: claim, render, Resend with idempotency key, mark         |
| `src/lib/payments/summary.ts`                                | `getPaymentSummary(id)` for the success page (5 fields, no PII)               |
| `src/app/api/create-payment-intent/route.ts`                 | Validates, verifies BotPoison, creates the PaymentIntent                      |
| `src/app/api/webhooks/stripe/route.ts`                       | Records the payment and sends the emails                                      |
| `src/components/CheckoutComponents/CheckoutFlow.tsx`         | Step 1 form (client)                                                          |
| `src/components/CheckoutComponents/PaymentStep.tsx`          | Step 2 `<Elements>` + `CheckoutForm` (dynamic, no SSR)                        |
| `src/components/CheckoutComponents/CheckoutForm.tsx`         | `<PaymentElement>` + `confirmPayment`                                         |
| `src/components/CheckoutComponents/PaymentSucessContent.tsx` | Success page (Server Component, three states)                                |
| `src/emails/drwebstudioEmail.tsx`                            | English confirmation (also used for the owner notification)                   |
| `src/emails/PaymentConfirmationEmailSpanish.tsx`             | Spanish confirmation                                                          |
| `supabase/migrations/0010_payments.sql`                      | `payments` table (apply by hand in the Supabase SQL editor)                   |

Removed: `/api/payment-email` (it let anyone send a forged "Payment Confirmed" email) and `/api/payment-details/[id]` (leaked name and email by id).

---

## API Route Contracts

### `POST /api/create-payment-intent`

**Auth**: BotPoison. The solution goes in `_botpoison`.  
**Body**:

```json
{
  "amount": 15000,
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "lang": "en",
  "attemptId": "<uuid per form session>",
  "_botpoison": "<solution>"
}
```

- `amount` is a safe **integer in cents**, `100` to `1_000_000`. Floats and strings are rejected.
- A `currency` in the body is ignored. The server always charges `usd`.
- `lang` is `es` or `en` (default `es`). `attemptId` is optional.
- The intent gets `metadata: { source: "custom-payment", customerName, customerEmail, lang }` and **no `receipt_email`** (Stripe sends no receipt of its own; our email links Stripe's hosted `receipt_url`).
- With an `attemptId`, an idempotency key (hash of attempt, amount, email, name) makes a retry reuse one intent.

**Success** `200`: `{ "clientSecret": "pi_xxx_secret_xxx" }`  
**Errors**: `400` `{ error }` with `verification_required`, `invalid_request`, `amount_invalid`, `amount_min`, `amount_max`, `name_required`, `email_required`, `email_invalid`; `403` `verification_failed`; `500` `create_failed` (generic, no details). The client maps each code to a `checkout.error_*` translation.

---

### `POST /api/webhooks/stripe`

**Auth**: `Stripe-Signature` verified with `STRIPE_WEBHOOK_SECRET` against the **raw body** (`await request.text()`, never `request.json()`).  
**Subscribe the endpoint to `payment_intent.succeeded` only.** Any other type that arrives gets `200`.

Order:

1. Verify the signature. Bad or missing: `400`.
2. Ignore other event types: `200`.
3. Re-fetch the PaymentIntent with `expand: ["latest_charge"]`. Require `status === "succeeded"` and `metadata.source === "custom-payment"`; otherwise `200` and nothing else (a foreign payment on the same Stripe account gets no email).
4. `recordSucceeded`: insert into `payments` if absent.
5. `sendPaymentEmails`: customer (their locale, `replyTo` support, text part) then owner. Each is claim, send, mark.
6. Steps 4 and 5 run inline, not in `after()`. Any error (Supabase missing or failing, Resend error) returns `500 { error: "processing_failed" }` so Stripe retries. Logs carry ids and error text only.

The same event twice sends nothing the second time. Reordering these steps breaks idempotency.

---

## `payments` table (0010)

One row per **succeeded** PaymentIntent: `payment_intent_id` (pk), `livemode`, `amount` (int cents), `currency`, `customer_name`, `customer_email`, `locale`, `paid_at`, `last_event_id`, `tenant_id` (default `drwebstudio`), and `customer_email_claimed_at`, `customer_email_sent_at`, `owner_email_claimed_at`, `owner_email_sent_at`. RLS on, no policies (the server's secret key bypasses RLS). Test payments are stored with `livemode = false` in the same project.

Email idempotency, per kind:

1. **claim**: one atomic `UPDATE` setting `*_claimed_at = now()` where `*_sent_at is null` and the claim is null or older than 2 minutes (a lease). Zero rows updated means someone else has it or it is sent.
2. **send**: Resend with `idempotencyKey: payment/<pi>/<kind>`. A Resend error throws.
3. **mark**: set `*_sent_at`.

---

## Success page

`/[lang]/payment-success?payment_intent=pi_...` is dynamic. `getPaymentSummary` rejects ids not matching `^pi_[A-Za-z0-9]+$` without calling Stripe; a missing or foreign intent gives `notFound()`; other Stripe errors propagate. It returns only `{ id, amount, currency, status, created }`. States: `succeeded` (paid), `processing`, anything else ("No se hizo ningún cargo" with a try-again link). The client secret is not in the URL.

---

## Key Implementation Details

- **Money**: the UI rounds dollars to cents once (`Math.round(n * 100)`); the server accepts only integers and never converts.
- **Locale**: Elements get `locale: lang`; money and dates use `es-DO` / `en-US` with the `America/Santo_Domingo` time zone.
- **CLS**: the page shell and step 1 are server-rendered; only Stripe.js (step 2) loads client-side, behind a fixed-height skeleton.
- **Redirect methods**: `confirmPayment` passes `return_url` (the localized success path) and `redirect: "if_required"`. Redirect-based methods return with `payment_intent_client_secret` appended by Stripe; redact that parameter in GA4 (Admin, Data redaction).
- **Abuse**: BotPoison on creation plus a Vercel Firewall rate-limit rule on `POST /api/create-payment-intent` (about 10 per minute per IP). No in-code limiter.
- **Legacy**: the `webhookEvent` Sanity type is no longer written. Delete the QA docs, then the schema type, after deploy.

---

## Local Development (test mode only)

```bash
# CLI login may be the LIVE account: always pass --api-key with a TEST key.
stripe listen --api-key "$STRIPE_SECRET_KEY" --latest \
  --events payment_intent.succeeded \
  --forward-to localhost:3200/api/webhooks/stripe
```

Export the printed `whsec_...` as `STRIPE_WEBHOOK_SECRET`, run the app (use `PORT=3200`), and pay with `4242 4242 4242 4242`. Decline: `4000 0000 0000 0002`. 3DS: `4000 0027 6000 3184`. Replay an event with `stripe events resend <evt_id> --api-key ...` (it must send no second email).

---

## Environment Variables

See `.env.example` (names only).

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
BOTPOISON_SECRET_KEY=...        # verifies the checkout form
RESEND_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SECRET_KEY=...         # payments table; the webhook fails closed (500) without it
```
