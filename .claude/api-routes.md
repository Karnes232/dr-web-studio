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

**Security**: BotPoison (`_botpoison` in the body). Missing token `400`, failed check `403`.

**Body**: `{ amount, customerName, customerEmail, lang, attemptId?, _botpoison }`

- `amount`: integer cents, 100 to 1,000,000. Anything else is `400`.
- Any `currency` in the body is ignored; the PaymentIntent is always `usd`.
- No `receipt_email` is set (our webhook email is the receipt).

**Success** `200`: `{ "clientSecret": "pi_xxx_secret_xxx" }`  
**Errors**: `400` / `403` / `500` as `{ "error": "<code>" }` (generic, no details). Codes are listed in `.claude/stripe.md`.

---

### `POST /api/webhooks/stripe`

Receives `payment_intent.succeeded` (the only event the endpoint is subscribed to) and sends the payment emails.

**Security**: `stripe-signature` verified with `STRIPE_WEBHOOK_SECRET` against the raw body. Bad or missing signature: `400`.

**Behaviour**: re-fetches the PaymentIntent, ignores payments without `metadata.source = "custom-payment"` (`200`), inserts into Supabase `payments` if absent, then sends the customer and owner emails once each (claim, send with Resend idempotency key, mark sent). Any failure is `500 { "error": "processing_failed" }` and Stripe retries; duplicates send nothing. Full detail in `.claude/stripe.md`.

**Local testing**: see `.claude/stripe.md` (use `--api-key` with a test key).

Removed routes: `/api/payment-email` and `/api/payment-details/[id]`.

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
