# CLAUDE.md — James Portfolio / DR Web Studio

## Project Overview

Freelance web development portfolio and client-facing site for **DR Web Studio** (James Karnes).  
Live domain: `https://www.dr-webstudio.com`

Full-stack Next.js 15 app with:

- Sanity v3 as headless CMS (Studio embedded at `/studio`)
- Stripe payment processing
- Resend transactional email
- English / Spanish i18n
- Vercel Analytics

---

## Tech Stack

| Concern         | Tool                                |
| --------------- | ----------------------------------- |
| Framework       | Next.js 15, App Router, Turbopack   |
| Language        | TypeScript (strict)                 |
| Styling         | Tailwind CSS v4 + CSS variables     |
| CMS             | Sanity v3 (`next-sanity`)           |
| Payments        | Stripe (Payment Intents + Webhooks) |
| Email           | Resend + React Email                |
| i18n            | `next-intl` (es default + en)       |
| Spam protection | BotPoison                           |
| Icons           | `lucide-react`, `react-icons`       |
| Carousel        | Swiper                              |
| Monitoring      | Vercel Analytics                    |
| Deployment      | Vercel                              |
| Formatting      | Prettier                            |
| Linting         | ESLint (Next.js config)             |

---

## Key Conventions

### TypeScript

- Strict mode enabled. All props should be typed.
- Prefer `interface` for component props, `type` for unions/aliases.
- Path alias `@/` maps to `src/`.

### Components

- Components are grouped by **feature/page** inside `src/components/` — not by type (no global `ui/` folder).
- Server Components are the default. Add `"use client"` only when needed (event handlers, hooks, browser APIs).
- Each page's components live in a dedicated folder: `BlogComponents/`, `CheckoutComponents/`, etc.

### Styling

- Tailwind CSS v4. No `cn()` utility — use template literals directly.
- Font variables: `--font-inter` (body), `--font-crimson-pro` (serif headings).
- Gradient classes used dynamically from Sanity data — kept in the Tailwind `safelist` in `tailwind.config.ts`.
- Color tokens `background` / `foreground` map to CSS variables.

### Data Fetching

- All Sanity data is fetched in Server Components using `client.fetch()` from `@/sanity/lib/client`.
- Queries live in `src/sanity/queries/<section>/` — one file per query.
- Use `Promise.all([...])` when a page needs multiple queries in parallel.
- SEO metadata is fetched via `getSEO()` / `getSeoSchema()` inside `generateMetadata()` on every page.

### i18n

- Two locales. **`es` is the `defaultLocale`** (the Dominican market is the primary audience); `en` is the secondary locale. Configured in `src/i18n/routing.ts` — that file is the single source of truth.
- All public routes are prefixed: `/{lang}/...` (`localePrefix: "always"`). URL segments themselves are localised via the `pathnames` map in `routing.ts` (e.g. `/contact` → `/es/contacto`, `/pricing` → `/es/precios`).
- Translations live in `src/i18n/locales/{en,es}/translation.json`, loaded by `src/i18n/request.ts`. Missing keys render the key itself, silently.
- In Server Components, `await getTranslations()` from `next-intl/server`.
- In Client Components, `useTranslations()` and `useLocale()` from `next-intl`. `src/i18n/useLocale.ts` is a project-specific wrapper adding `getLocalizedPath` / `getServiceHref` / `getBlogHref`.
- Sanity fields store localised strings as `{ en: "...", es: "..." }` objects — access with `field[lang]`.
- Bare `/` returns a **308** to `/es` for crawlers (no `NEXT_LOCALE` cookie, absent/wildcard `Accept-Language`) and a **307** to the negotiated locale for real browsers. This asymmetry is deliberate — see `src/middleware.ts` and `.claude/i18n.md`. Do not "fix" it.
- See `.claude/i18n.md` for the full architecture.

### Routing

- Route group `(root)` wraps all public pages. Each page is at `src/app/(root)/[lang]/<page>/page.tsx`.
- Middleware passes the detected locale via the `x-locale` response header; root layout reads it to set `<html lang>`.
- `/studio` and static files (`/sitemap.xml`, `/robots.txt`) bypass locale middleware.

### API Routes

All under `src/app/api/`:

- `contact/` — contact form → Resend email (BotPoison verified)
- `create-payment-intent/` — creates Stripe PaymentIntent
- `payment-details/[paymentIntentId]/` — retrieves payment info post-checkout
- `payment-email/` — sends payment confirmation email
- `project-planner/` — submits project brief → Resend email
- `webhooks/stripe/` — handles Stripe webhook events (signature verified)

### Email Templates

React Email templates in `src/emails/`. Rendered server-side via `@react-email/render` then sent through Resend.

### Sanity Studio

- Embedded at `/studio` (not locale-prefixed, bypasses middleware).
- Config: `sanity.config.ts` (root). Plugins: `structureTool`, `media`, `visionTool`.
- Custom studio structure in `src/sanity/structure.ts`.
- Schema types in `src/sanity/schemaTypes/<section>/`.

### Security

- Security headers set in `next.config.ts` (HSTS, X-Frame-Options, CSP etc.).
- Stripe webhooks verified with `STRIPE_WEBHOOK_SECRET`.
- Contact/project-planner forms use BotPoison for spam protection.
- `SANITY_API_TOKEN` is server-only (never `NEXT_PUBLIC_`).

---

## Environment Variables

```
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# BotPoison
NEXT_PUBLIC_BOTPOISON_PUBLIC_KEY=
```

---

## Common Tasks

### Add a new page

1. Create `src/app/(root)/[lang]/<page-name>/page.tsx`.
2. Add Sanity schema types under `src/sanity/schemaTypes/<page-name>/`.
3. Add GROQ queries under `src/sanity/queries/<page-name>/`.
4. Add components under `src/components/<PageName>Components/`.
5. Add the page to the Studio structure in `src/sanity/structure.ts`.
6. Add translations to both `src/i18n/locales/en/translation.json` and `es/translation.json`.
7. Add the route to `src/app/sitemap.ts`.

### Add a new translation key

Edit both `src/i18n/locales/en/translation.json` and `src/i18n/locales/es/translation.json` simultaneously.

### Add a new Sanity schema type

1. Create the schema file in `src/sanity/schemaTypes/<section>/`.
2. Export it from `src/sanity/schemaTypes/index.ts`.
3. If it needs a studio section, update `src/sanity/structure.ts`.

### Run Stripe webhooks locally

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the printed signing secret into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### Format code

```bash
npm run format
```

---

## File Reference

- `file-structure.md` — annotated directory tree
- `sanity.md` — Sanity schema catalogue and GROQ patterns
- `i18n.md` — i18n architecture and usage patterns
- `stripe.md` — Stripe payment flow, API contracts, and implementation details
- `seo.md` — SEO architecture, generateMetadata pattern, JSON-LD, hreflang
- `api-routes.md` — all API route contracts, security, and shared utilities
