# Stripe Payment Flow

## Overview

The site uses **Stripe Payment Intents** with a custom checkout UI (not Stripe Checkout hosted pages). The flow handles variable amounts — the client enters their own payment amount — making it suited for custom project invoices.

**Stripe API version**: `2025-06-30.basil` (set in `src/lib/stripe.ts`)

---

## Flow Diagram

```
/[lang]/custom-payment (page)
  └─ CheckoutContent (Client Component)
       │
       ├─ Step 1: Customer fills in name, email, and amount ($1–$10,000)
       │
       ├─ Step 2: POST /api/create-payment-intent
       │           └─ Returns { clientSecret }
       │
       ├─ Step 3: <Elements> mounts with clientSecret
       │           └─ <CheckoutForm> renders <PaymentElement>
       │
       ├─ Step 4: stripe.confirmPayment({ elements, redirect: "if_required" })
       │           └─ On success: paymentIntent.status === "succeeded"
       │
       ├─ Step 5: POST /api/payment-email
       │           └─ Sends confirmation email to client + james@dr-webstudio.com
       │
       └─ Step 6: router.push(/[lang]/payment-success?payment_intent=...&amount=...&...)
```

---

## Files

| File                                                         | Role                                                                   |
| ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `src/lib/stripe.ts`                                          | Server-side `Stripe` instance (uses `STRIPE_SECRET_KEY`)               |
| `src/lib/stripe-client.ts`                                   | Client-side `loadStripe()` (uses `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) |
| `src/app/api/create-payment-intent/route.ts`                 | Creates PaymentIntent, returns `clientSecret`                          |
| `src/app/api/payment-details/[paymentIntentId]/route.ts`     | Retrieves sanitised PaymentIntent details                              |
| `src/app/api/payment-email/route.ts`                         | Sends confirmation email via Resend                                    |
| `src/app/api/webhooks/stripe/route.ts`                       | Handles Stripe webhook events                                          |
| `src/components/CheckoutComponents/CheckoutContent.tsx`      | Full checkout UI (Client Component)                                    |
| `src/components/CheckoutComponents/CheckoutForm.tsx`         | Stripe `<PaymentElement>` + confirm logic                              |
| `src/components/CheckoutComponents/PaymentSucessContent.tsx` | Post-payment success UI                                                |

---

## API Route Contracts

### `POST /api/create-payment-intent`

**Auth**: none (public)  
**Body**:

```json
{
  "amount": 15000,
  "currency": "usd",
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com"
}
```

- `amount` is in **cents** (multiply dollars × 100 before sending)
- `currency` defaults to `"usd"` if omitted

**Response** `200`:

```json
{ "clientSecret": "pi_xxx_secret_xxx" }
```

---

### `GET /api/payment-details/[paymentIntentId]`

**Auth**: none (public, but returns only safe fields)  
**Response** `200`:

```json
{
  "success": true,
  "paymentIntent": {
    "id", "amount", "currency", "status",
    "created", "description", "receipt_email", "metadata"
  }
}
```

---

### `POST /api/payment-email`

**Auth**: none  
**Body**:

```json
{
  "clientName": "Jane Smith",
  "clientEmail": "jane@example.com",
  "paymentAmount": "15000",
  "transactionId": "pi_xxx",
  "lang": "en"
}
```

- `lang` selects the email template: `"es"` → `PaymentConfirmationEmailSpanish`, otherwise English template
- Sends to both `clientEmail` and `james@dr-webstudio.com`

---

### `POST /api/webhooks/stripe`

**Auth**: Stripe-Signature header verified with `STRIPE_WEBHOOK_SECRET`  
Handled events:

- `payment_intent.succeeded`
- `payment_intent.payment_failed`

All other event types are logged and ignored with `200 { received: true }`.  
If signature verification fails → `400 { error: "Invalid signature" }`.

**Important**: the raw request body must be read as text (not parsed JSON) before passing to `stripe.webhooks.constructEvent()`. This is already done correctly — do not change `await request.text()` to `request.json()`.

---

## Key Implementation Details

- **Amount conversion**: The UI input is in dollars (e.g. `"150.00"`), converted to cents with `Math.round(numericAmount * 100)` before calling the API. Do not change this — Stripe always expects integer cents.
- **Locale-aware Stripe Elements**: `<Elements>` is initialised with `locale: lang` so the card UI appears in the user's language.
- **No redirect flow**: `stripe.confirmPayment` uses `redirect: "if_required"` — for card payments this avoids a full page redirect and lets the app handle success inline.
- **Email is fire-and-forget**: The payment email call in `CheckoutForm` does not block the redirect if it fails.
- **Webhook vs client-side**: The webhook handler is wired up but currently only logs events. The authoritative payment confirmation to the client is sent from `CheckoutForm` client-side after `confirmPayment` succeeds, not from the webhook.

---

## Local Development

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the printed signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`. Restart the dev server after changing env vars.

---

## Environment Variables

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
