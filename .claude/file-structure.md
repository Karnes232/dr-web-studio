# File Structure

```
james-portfolio/
├── .claude/                          # Claude Code project documentation
│   ├── CLAUDE.md                     # Main project guide (start here)
│   ├── file-structure.md             # This file
│   ├── sanity.md                     # Sanity schemas & GROQ patterns
│   └── i18n.md                       # i18n architecture & usage
│
├── public/                           # Static assets served at root
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout: fonts, analytics scripts, <html lang>
│   │   ├── globals.css               # Global styles, CSS variables
│   │   ├── sitemap.ts                # Dynamic XML sitemap
│   │   ├── robots.ts                 # robots.txt rules
│   │   ├── manifest.json             # PWA manifest
│   │   ├── not-found.tsx             # 404 page
│   │   ├── global-error.tsx          # Global error boundary (Sentry)
│   │   │
│   │   ├── (root)/                   # Route group for all public pages
│   │   │   ├── layout.tsx            # Shared layout: Navbar + Footer (fetches logo, company info)
│   │   │   └── [lang]/               # Locale-prefixed routes (en | es)
│   │   │       ├── layout.tsx        # Injects I18nProvider + Navbar + Footer data
│   │   │       ├── page.tsx          # Home page
│   │   │       ├── about-me/
│   │   │       ├── blog/
│   │   │       │   ├── page.tsx      # Blog listing
│   │   │       │   └── [slug]/       # Individual blog post
│   │   │       ├── contact/
│   │   │       ├── faqs/
│   │   │       ├── our-services/
│   │   │       │   ├── page.tsx      # Services listing
│   │   │       │   └── [slug]/       # Individual service page
│   │   │       ├── portfolio/
│   │   │       ├── pricing/
│   │   │       ├── project-planner/
│   │   │       ├── custom-payment/   # Custom Stripe checkout page
│   │   │       ├── payment-success/  # Post-payment confirmation
│   │   │       ├── privacy-policy/
│   │   │       ├── terms-of-service/
│   │   │       └── guia-completa-desarrollo-web-moderno-negocios/  # SEO pillar page
│   │   │
│   │   ├── api/
│   │   │   ├── contact/route.ts               # Contact form → Resend
│   │   │   ├── project-planner/route.ts       # Project brief → Resend
│   │   │   ├── create-payment-intent/route.ts # Create Stripe PaymentIntent
│   │   │   ├── payment-details/
│   │   │   │   └── [paymentIntentId]/route.ts # Retrieve payment after success
│   │   │   ├── payment-email/route.ts         # Send payment confirmation email
│   │   │   └── webhooks/stripe/route.ts       # Stripe webhook handler
│   │   │
│   │   └── studio/                   # Embedded Sanity Studio (bypasses middleware)
│   │
│   ├── components/                   # UI components grouped by feature/page
│   │   ├── Layout/
│   │   │   ├── HeaderComponents/     # Navbar
│   │   │   └── FooterComponents/     # Footer
│   │   ├── HeroComponent/            # Home hero section
│   │   ├── ServicesOverview/         # Quick services overview (home page)
│   │   ├── TrustSignalsComponents/   # Testimonials, client logos
│   │   ├── AboutUsSectionComponents/ # About Me page sections
│   │   ├── BlogComponents/           # Blog listing + individual post
│   │   ├── CheckoutComponents/       # Stripe checkout flow
│   │   ├── ContactPageComponents/    # Contact form + info
│   │   ├── FaqsComponents/           # FAQ page
│   │   ├── GuiaCompletaComponents/   # SEO pillar page
│   │   ├── IndividualServicePage/    # Single service detail page
│   │   ├── PortfolioComponents/      # Portfolio grid + project detail modal
│   │   ├── PricingPageComponents/    # Pricing cards
│   │   ├── projectPlannerComponents/ # Multi-step project brief form
│   │   ├── ServicesComponents/       # Services listing page
│   │   ├── SanitySvg/                # SVG rendered from Sanity data
│   │   └── LanguageSwitcher.tsx      # EN / ES toggle
│   │
│   ├── sanity/
│   │   ├── env.ts                    # projectId, dataset, apiVersion
│   │   ├── lib/
│   │   │   ├── client.ts             # createClient (CDN, read-only)
│   │   │   ├── live.ts               # defineLive → sanityFetch + SanityLive
│   │   │   ├── image.ts              # imageUrlBuilder helper
│   │   │   └── blogImageUrls.ts      # Portable Text image URL builder
│   │   ├── queries/                  # GROQ queries, one file per concern
│   │   │   ├── seo.ts                # getSEO(), getSeoSchema()
│   │   │   ├── pillarPage.ts
│   │   │   ├── about-me/
│   │   │   ├── blog/
│   │   │   ├── contact/
│   │   │   ├── faqs/
│   │   │   ├── home/
│   │   │   ├── layout/
│   │   │   ├── legal/
│   │   │   ├── payment/
│   │   │   ├── portfolio/
│   │   │   ├── pricing/
│   │   │   ├── project-planner/
│   │   │   └── services/
│   │   ├── schemaTypes/              # Sanity schema definitions
│   │   │   ├── index.ts              # Exports all schema types
│   │   │   ├── seo/
│   │   │   ├── layout/               # generalLayout, stats
│   │   │   ├── home/                 # Hero, services, testimonials, trust signals
│   │   │   ├── about-me/
│   │   │   ├── blog/                 # blogPost, author, blogCategory, blogHeader
│   │   │   ├── contact/
│   │   │   ├── faqs/
│   │   │   ├── legal/
│   │   │   ├── payment/              # customPayment, paymentSuccess
│   │   │   ├── pillar-page/
│   │   │   ├── portfolio/            # project, portfolioHeader
│   │   │   ├── pricing/
│   │   │   ├── project-planner/      # websiteType, timeline, budget, features, …
│   │   │   └── services/             # Service, serviceItem, category, …
│   │   └── structure.ts              # Custom Studio sidebar structure
│   │
│   ├── i18n/
│   │   ├── settings.ts               # languages = ["en", "es"], fallbackLng = "en"
│   │   ├── index.ts                  # getTranslation(lang) for Server Components
│   │   ├── client.ts                 # i18next client-side init
│   │   ├── I18nContext.tsx           # <I18nProvider> for client tree
│   │   ├── useTranslations.ts        # Hook for Client Components
│   │   ├── useLocale.ts              # Hook to read current locale
│   │   └── locales/
│   │       ├── en/translation.json
│   │       └── es/translation.json
│   │
│   ├── emails/                       # React Email templates
│   │   ├── ContactFormEmail.tsx
│   │   ├── drwebstudioEmail.tsx
│   │   ├── PaymentConfirmationEmailSpanish.tsx
│   │   └── ProjectPlannerSubmissionEmail.tsx
│   │
│   ├── lib/
│   │   ├── stripe.ts                 # Server-side Stripe instance
│   │   ├── stripe-client.ts          # Client-side Stripe loader
│   │   ├── botpoison-verify.ts       # BotPoison server-side verification
│   │   └── fonts.ts                  # Font variable exports
│   │
│   ├── types/
│   │   └── form.ts                   # Shared form type definitions
│   │
│   ├── middleware.ts                 # Locale detection + redirect logic
│   └── instrumentation.ts            # Sentry server instrumentation
│
├── sanity.config.ts                  # Sanity Studio config (plugins, schema, basePath)
├── sanity.cli.ts                     # Sanity CLI config
├── next.config.ts                    # Next.js config (Sentry, security headers, images)
├── tailwind.config.ts                # Tailwind (safelist for dynamic gradient classes)
├── tsconfig.json                     # TypeScript config
├── eslint.config.mjs                 # ESLint config
├── postcss.config.mjs                # PostCSS config
├── .prettierrc                       # Prettier rules
├── .env.local                        # Local secrets (git-ignored)
└── README.md                         # Project overview and setup guide
```
