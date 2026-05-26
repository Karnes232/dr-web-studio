# API Routes

All routes are under `src/app/api/`. None require authentication headers from the client — security is enforced per-route (BotPoison token, Stripe signature).

---

## Route Reference

### `POST /api/contact`

Handles the contact form submission.

**Security**: BotPoison token required in body (`_botpoison` field).  
**Input limits**: name/email/company/phone/projectType/budget/timeline → 500 chars max; message → 10,000 chars max.

**Body**:

```json
{
  "_botpoison": "<solution-token>",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "message": "Hello...",
  "company": "Acme", // optional
  "phone": "+1 555 0000", // optional
  "projectType": "E-commerce", // optional
  "budget": "$5,000", // optional
  "timeline": "3 months" // optional
}
```

**Success** `200`: `{ "message": "Sent" }`  
**Errors**: `400` (missing required fields / bad email / missing BotPoison token), `403` (BotPoison verification failed), `500` (Resend error)

**Side effects**: Sends email to address stored in `generalLayout.email` Sanity document (falls back to `james@dr-webstudio.com`). `replyTo` is set to the submitter's email.  
**Template**: `src/emails/ContactFormEmail.tsx`

---

### `POST /api/project-planner`

Handles multi-step project brief form submission.

**Security**: BotPoison token required.  
**Input limits**: most string fields → 500 chars; message → 10,000 chars; features/languages arrays → 40 items max; pages → 1–500.

**Body**:

```json
{
  "_botpoison": "<solution-token>",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "websiteType": "E-commerce",
  "pages": 10,
  "designStyle": "Modern",
  "features": ["Blog", "Contact Form"],
  "budget": "$5,000–$10,000",
  "timeline": "3 months",
  "contentStatus": "Have content ready",
  "languages": ["en", "es"],
  "company": "Acme", // optional
  "phone": "...", // optional
  "message": "..." // optional
}
```

Note: `projectType` is accepted as an alias for `websiteType` for backwards compatibility.

**Success** `200`: `{ "message": "Sent" }`  
**Errors**: `400` (required fields missing / invalid pages value / empty features or languages arrays), `403` (BotPoison failed), `500` (Resend error)

**Side effects**: Sends email to `generalLayout.email` (fallback: `james@dr-webstudio.com`). `replyTo` is set to submitter's email.  
**Template**: `src/emails/ProjectPlannerSubmissionEmail.tsx`

---

### `POST /api/create-payment-intent`

Creates a Stripe PaymentIntent for the custom checkout.

**Security**: none — public endpoint. Amount is validated client-side ($1–$10,000) before calling this route.

**Body**:

```json
{
  "amount": 15000,
  "currency": "usd",
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com"
}
```

- `amount` must be in **cents** (integer)
- `currency` defaults to `"usd"`

**Success** `200`: `{ "clientSecret": "pi_xxx_secret_xxx" }`  
**Error** `500`: Stripe error

---

### `GET /api/payment-details/[paymentIntentId]`

Retrieves a PaymentIntent from Stripe by ID. Used on the payment-success page to display confirmation details.

**Security**: none — only safe fields are returned (no sensitive payment method details).

**Response** `200`:

```json
{
  "success": true,
  "paymentIntent": {
    "id": "pi_xxx",
    "amount": 15000,
    "currency": "usd",
    "status": "succeeded",
    "created": 1700000000,
    "description": "Payment from Jane Smith",
    "receipt_email": "jane@example.com",
    "metadata": {
      "customer_name": "Jane Smith",
      "customer_email": "jane@example.com"
    }
  }
}
```

---

### `POST /api/payment-email`

Sends a payment confirmation email to the client and to `james@dr-webstudio.com`.

**Security**: none — called client-side immediately after `stripe.confirmPayment` succeeds.

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

- `lang: "es"` → Spanish template; any other value → English template
- `paymentAmount` is the raw cents string as received from Stripe

**Success** `200`: `{ "message": "Email sent", "data": { ...resendResponse } }`  
**Templates**: `src/emails/drwebstudioEmail.tsx` (EN), `src/emails/PaymentConfirmationEmailSpanish.tsx` (ES)

---

### `POST /api/webhooks/stripe`

Receives Stripe webhook events.

**Security**: `stripe-signature` header verified with `STRIPE_WEBHOOK_SECRET`. Body must be read as raw text — never parse as JSON before passing to `constructEvent`.

**Handled events**:
| Event | Current behaviour |
|---|---|
| `payment_intent.succeeded` | Logs payment ID |
| `payment_intent.payment_failed` | Logs payment ID |
| All others | Logged and ignored |

**Response**: always `200 { received: true }` on success; `400 { error: "Invalid signature" }` on signature failure.

**Local testing**:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Shared Utilities

### BotPoison verification (`src/lib/botpoison-verify.ts`)

Used by `/api/contact` and `/api/project-planner`.

```ts
verifyBotpoisonSolution(solution: string): Promise<boolean>
```

Calls `https://api.botpoison.com/verify` with `BOTPOISON_SECRET_KEY`. Returns `false` if the env var is missing or the API returns a non-OK response. Routes return `403` when this returns false.

Note: the public key (`NEXT_PUBLIC_BOTPOISON_PUBLIC_KEY`) is used client-side by `@botpoison/browser` to generate the solution token. The secret key (`BOTPOISON_SECRET_KEY`) is server-only and verifies the token.

```ts
clampString(value: unknown, max: number): string
```

Trims and truncates any input string. All user-supplied strings pass through this before use — prevents oversized payloads from reaching Resend or being stored.

---

## Email Infrastructure

All emails are sent via **Resend** using React Email templates rendered server-side with `@react-email/render`.

- Sender address: `Dr Web Studio <james@dr-webstudio.com>`
- Recipient for internal copies: `james@dr-webstudio.com` (or `generalLayout.email` from Sanity)
- `RESEND_API_KEY` is required at runtime (server-only)
