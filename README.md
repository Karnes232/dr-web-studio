# James Karnes — Portfolio & Freelance Website

A full-stack freelance web development portfolio built with Next.js 15, Sanity CMS, Stripe payments, and i18n support for English and Spanish.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| CMS | Sanity v3 (embedded Studio at `/studio`) |
| Payments | Stripe (Payment Intents + Webhooks) |
| Email | Resend + React Email |
| i18n | i18next (English / Spanish) |
| Animation | Motion |
| Monitoring | Sentry, Vercel Analytics |
| Deployment | Vercel |

## Features

- **Multilingual** — all routes prefixed with `/en` or `/es`; middleware auto-redirects to the fallback locale (`en`)
- **Sanity CMS** — content-managed home, services, blog, portfolio, pricing, FAQs, about, and legal pages
- **Stripe Checkout** — custom payment flow with payment intents, webhook handling, and a post-payment success page
- **Project Planner** — interactive form that submits a project brief and triggers an automated email
- **Contact Form** — spam-protected via BotPoison, emails sent with Resend
- **Blog** — CMS-driven posts with categories, authors, and slugs
- **SEO** — sitemap, robots.txt, per-page metadata, and a pillar-page content type
- **Sanity Studio** — embedded at `/studio`, not protected by locale middleware

## Project Structure

```
src/
├── app/
│   ├── (root)/[lang]/      # All public routes under locale prefix
│   │   ├── page.tsx        # Home
│   │   ├── about-me/
│   │   ├── blog/[slug]/
│   │   ├── contact/
│   │   ├── faqs/
│   │   ├── our-services/[slug]/
│   │   ├── portfolio/
│   │   ├── pricing/
│   │   ├── project-planner/
│   │   ├── custom-payment/
│   │   └── payment-success/
│   ├── api/                # API routes
│   │   ├── contact/
│   │   ├── create-payment-intent/
│   │   ├── payment-details/[paymentIntentId]/
│   │   ├── payment-email/
│   │   ├── project-planner/
│   │   └── webhooks/stripe/
│   └── studio/             # Embedded Sanity Studio
├── components/             # Feature-grouped UI components
├── i18n/                   # i18next config, locales (en/es)
├── sanity/                 # Sanity client, queries, schema types
└── lib/                    # Shared utilities
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Sanity](https://sanity.io) project
- A [Stripe](https://stripe.com) account
- A [Resend](https://resend.com) account
- A [Sentry](https://sentry.io) project (optional but configured)

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
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

# Sentry
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_SENTRY_DSN=

# BotPoison (spam protection)
NEXT_PUBLIC_BOTPOISON_PUBLIC_KEY=
```

### Run the development server

```bash
npm run dev          # Turbopack (faster)
npm run dev2         # Standard webpack
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/en` by default.

The Sanity Studio is available at [http://localhost:3000/studio](http://localhost:3000/studio).

## Available Scripts

```bash
npm run dev      # Development server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
npm run format   # Prettier (formats all JS/TS/JSON/CSS/MD)
```

## Stripe Webhooks (local dev)

To test webhooks locally, forward events with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret printed by the CLI into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

## Deployment

The project is deployed on Vercel. Set all environment variables listed above in the Vercel project dashboard. The Sentry auth token also needs to be available at build time for source map uploads.
