# GEO + SEO Audit Report — DR Web Studio

**Domain:** https://www.dr-webstudio.com
**Business:** DR Web Studio (James Karnes) — bilingual EN/ES web development agency, Punta Cana / Dominican Republic
**Business type:** Agency / Local-Service hybrid
**Audit date:** 2026-06-23
**Methodology:** GEO-first, SEO-supported. 5 parallel analysis agents (AI visibility, platform optimization, technical SEO, content/E-E-A-T, schema) + live-site fetches + source-code verification of every flagged issue.

---

## Executive Summary

> **Composite GEO Score: 71 / 100 — "Good"**
> **Diagnosis: world-class owned site, nearly invisible off-site.**

DR Web Studio has done the hard on-site work better than almost any small agency. The technical
foundation (91), AI citability (84), `llms.txt` (92), and structured data (82) are all near
best-in-class. The score is held back almost entirely by **off-site brand authority (26/100)** —
there is no Google Business Profile, no claimed Clutch/Trustpilot profile, no LinkedIn company page,
and no third-party corroboration — plus a small number of **fixable on-site bugs**, chiefly a
schema entity-graph conflict and an FAQ-rendering gap that hides ~47 high-intent answers from AI
crawlers.

The practical takeaway: the code fixes below extract maximum value from the traffic the site can
already reach, but the single biggest lever for actually appearing in AI answers ("best web
developer in Punta Cana") is building off-site authority — work only the owner can do (Section 5).

---

## 1. Score Breakdown

| Category | Weight | Score | Assessment |
|---|---|---|---|
| AI Citability & Visibility | 25% | **85** | Citability 84, crawler access 95, llms.txt 92. Only the FAQ SSR gap leaks. |
| Brand Authority Signals | 20% | **26** | The limiting factor. Discoverable by name, but not verifiable by AI. |
| Content Quality & E-E-A-T | 20% | **79** | Strong depth + full bilingual parity; missing bylines, testimonials, third-party proof. |
| Technical Foundations | 15% | **91** | Excellent SSR, hreflang, HSTS, mobile, URLs. Only CSP + sitemap-hreflang gaps. |
| Structured Data | 10% | **82** | Mature JSON-LD undermined by entity-graph inconsistencies. |
| Platform Optimization | 10% | **66** | Strong for Google AI Overviews & Gemini; weak Perplexity/Bing (off-site driven). |
| **Composite** | **100%** | **≈71** | **Good — capped by off-site authority.** |

### Per-platform readiness (AI search engines)

| Platform | Score | Status | Notes |
|---|---|---|---|
| Google AI Overviews | 78 | Good | Textbook answer-target H2s, FAQPage schema, LocalBusiness. Highest-value channel. |
| Google Gemini | 71 | Good | Strong founder entity + E-E-A-T signals. |
| ChatGPT Search | 62 | Fair | Bing-indexable; needs entity corroboration + IndexNow. |
| Bing Copilot | 54 | Fair | No Bing verification / IndexNow key detected. |
| Perplexity | 45 | Poor | Almost zero third-party footprint to cite. |

---

## 2. What's Already Excellent (keep doing this)

- **Server-side rendering** — fully prerendered Next.js 15 App Router; AI crawlers see complete content in initial HTML.
- **`llms.txt` + `llms-full.txt`** — present, bilingual, comprehensive. Rare and ahead of the curve.
- **hreflang** — correct `en` / `es` / `x-default` annotations in the HTML head, absolute URLs, matching canonicals. (Earlier "missing" flag was a false negative — Next.js emits camelCase `hrefLang`, which is spec-valid.)
- **Security** — HSTS with `preload`, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy all present.
- **Bilingual parity** — ES content is genuinely localized (not machine-translated) and often matches/exceeds EN depth. Excellent for the Spanish-first Dominican market.
- **Citation-ready content** — pricing tables, ROI figures, comparison tables, process timelines, named case results. Exactly the passage shapes ChatGPT/Claude/Perplexity/Gemini extract.
- **Mature JSON-LD** — `@graph` on every page type: LocalBusiness, WebSite+SearchAction, Person, BreadcrumbList, Service+OfferCatalog, AggregateRating, Article, FAQPage.

---

## 3. Findings

Severity legend: **Critical** = corrupts core signals / blocks AI access · **High** = meaningful authority or trust impact · **Medium** = best-practice gap · **Low** = polish.

### 🔴 Critical

**C1 — Schema entity-graph conflict (same `@id`, two different businesses).**
The `@id` `…/#organization` is reused site-wide but defined inconsistently:

| Property | Homepage | Service / Blog pages |
|---|---|---|
| `@type` | `LocalBusiness` | `Organization` |
| `addressLocality` | **Punta Cana** | **Santo Domingo** |
| `geo` | 18.5601, -68.3725 | 18.4861, -69.9312 |
| `sameAs` | Google, Trustpilot, Clutch | Instagram, LinkedIn |

Same `@id` means crawlers/AI treat these as one entity — and must reconcile a business that is
simultaneously in two cities with two disjoint profile sets. This is the highest-impact on-site issue.
**Root cause:** `scripts/seedLandingPages.ts` `localBusinessSchema()` (~lines 100-130) hardcodes
Santo Domingo for all landing pages; the homepage SEO doc was hand-entered in Sanity with Punta Cana.
Structured data is stored as raw JSON strings in Sanity `seo` documents — **no single source of truth**.

**C2 — Location-page schema points to the wrong slug.**
`/en/web-development-punta-cana` (canonical) emits JSON-LD whose `@id` / `url` / breadcrumb all point
to the Spanish slug `…/desarrollo-web-punta-cana`. The schema contradicts the page's own canonical.
Rendered verbatim at `src/app/(root)/[lang]/desarrollo-web-punta-cana/page.tsx` (~lines 81-86) from
the raw Sanity JSON, with no slug injection.

**C3 — FAQ answers are absent from server-rendered HTML (citability leak).**
`src/components/FaqsComponents/FaqsCategories.tsx` is a Client Component that conditionally renders
answers only on click (`{isQuestionActive && (…answer…)}`, ~line 100). So ~47 high-intent Q&A answers
are **not** in the initial HTML — AI crawlers and Google see only category headers and question counts.
The same hidden-answer pattern exists in 5 other FAQ blocks: `ContactFAQ.tsx`,
`IndividualServicePage/ServiceFAQ.tsx`, `PricingFAQ.tsx`, `LandingPageComponents/LandingFaq.tsx`,
`GuiaCompletaComponents/FAQAccordion.tsx`. (FAQPage JSON-LD does carry the answers, but the visible
text should be crawlable too.)

**C4 — Contradictory homepage trust stats.**
The Hero (`src/components/HeroComponent/HeroSection.tsx` ~line 105) hardcodes **"50+ Happy Clients"**,
while `src/components/TrustSignalsComponents/TrustSignals.tsx` (~lines 19-22) hardcodes
**"20+ Happy Clients"** and **"50+ Projects"** — on the same page. Conflicting facts damage trust and
give AI contradictory numbers to cite. Numbers are hardcoded in the components, not sourced from Sanity.

### 🟠 High

**H1 — Blog `Article.author` is an Organization, not a Person.**
The rich `#james-karnes` Person node exists but is never used as the author on the ~40 blog posts
(author is hand-pasted as `Organization` in `blogPost.seo.structuredData`). Major E-E-A-T miss.
Files: `src/sanity/queries/blog/blog.ts` (SEO query doesn't fetch author),
`src/app/(root)/[lang]/blog/[slug]/page.tsx` (renders raw JSON).

**H2 — No author bylines on blog/case-study content.**
Separate from schema: anonymous authorship across ~40 structurally-similar posts risks a
"mass-produced" perception. Add a visible byline + linked bio to transfer the founder's proven
expertise onto the content AI actually reads.

**H3 — No testimonials / reviews / named-client quotes anywhere on-site.**
Trustworthiness is the heaviest E-E-A-T dimension and the single biggest content gap for a
local-service business.

**H4 — Content-Security-Policy header missing in production.**
`next.config.ts` `securityHeaders` (~lines 124-157) defines HSTS / X-Frame-Options / etc. but **no
CSP**, despite CLAUDE.md claiming it is set. Verified absent on live responses.

### 🟡 Medium

- **M1 — Sitemap lacks `xhtml:link` hreflang alternates.** `src/app/sitemap.ts` (~lines 34-84) omits `alternates.languages`. `buildAlternates()` in `src/lib/urls.ts` already has reusable logic.
- **M2 — ES About page (~320 words) far thinner than EN (~800 words).** ES is the priority market — bring to parity.
- **M3 — `LocalBusiness` schema missing on location pages** (they carry only Service + FAQPage); `areaServed` typed inconsistently (objects vs strings). Reference the unified org node by `@id`.
- **M4 — No `speakable` schema** anywhere; publisher logo served via `/_next/image` proxy instead of the raw Sanity CDN URL.
- **M5 — Metadata polish:** homepage `<title>` is 62 chars (trim ≤60); meta description has trailing whitespace (`.trim()`). Files: `src/sanity/queries/seo.ts` + the Sanity doc.

### ⚪ Low

- Add a `Content-Signal:` directive to robots.txt (declares the open AI posture explicitly; future-proofing).
- Deepen `llms.txt` with topical sub-sections (`## Services`, `## Locations`, `## Guides`) and per-link descriptions; add an `## Optional` section for legal/utility pages.
- Add visible "Last updated" dates to posts (and refresh year-stamped content annually).
- Switch locale/non-www redirects from 307 → 308 (permanent).
- Use full ISO `foundingDate` (`2023-01-01`).
- Validate live Core Web Vitals via PSI/CrUX; confirm the large Sanity hero JPG (6000×4000 source) isn't hurting mobile LCP.
- Optionally block Bytespider in robots.txt (low citation value) — no downside either way.

---

## 4. Remediation Roadmap (prioritized 90-day plan)

> **Note:** This audit round produced the report only — no source files were modified. The phases
> below describe the recommended implementation work for a future round.

### Phase A — Schema entity integrity *(highest GEO leverage, ~1-2 days)*
1. Create one canonical org-node builder (e.g. `getOrganizationSchema()` in `src/lib/schema.ts` or `src/sanity/queries/seo.ts`) returning the `LocalBusiness` `#organization` node — Punta Cana address/geo, complete `sameAs`, typed `areaServed`, hours, founder ref. Inject it identically on every page; inner pages reference by `@id` only. Delete the divergent Santo Domingo `Organization` definitions. *(C1, M3)*
2. Regenerate landing-page schema in `scripts/seedLandingPages.ts` to use the canonical node and the **correct per-page slug** for `@id`/`url`/breadcrumb. *(C2)*
3. Re-run the seed/patch against Sanity to overwrite affected `seo.structuredData` fields; correct the hand-entered homepage SEO doc.
4. Blog author fix: fetch `author` in the blog SEO query and build `BlogPosting` schema server-side with `author: { @id: #james-karnes }`, `publisher: { @id: #organization }`, `image`, `datePublished`, `dateModified`. *(H1)*
5. Add `speakable` to FAQ/homepage/blog nodes; serve publisher logo from the raw Sanity CDN URL. *(M4)*

### Phase B — Crawlable FAQ + honest stats *(~half day)*
6. Render FAQ answer bodies into initial HTML (CSS-collapsed or `<details>`/`<summary>`, not `{isActive && …}`) across `FaqsCategories.tsx` and the 5 other FAQ components. Keep the FAQPage JSON-LD. *(C3)*
7. Reconcile homepage stats: pick one true number per metric so Hero and TrustSignals agree; ideally promote the numbers into the `trustSignals` Sanity schema/query for single-sourcing. *(C4)*

### Phase C — Technical quick wins *(~half day)*
8. Add a `Content-Security-Policy` entry to `securityHeaders` in `next.config.ts` (self + Sanity CDN, Vercel Analytics, Ahrefs, GTM/GA, Stripe). Ship `Content-Security-Policy-Report-Only` first, then enforce. *(H4)*
9. Add `alternates.languages` per entry in `src/app/sitemap.ts`, reusing `buildAlternates()`. *(M1)*
10. Trim title ≤60 chars and `.trim()` the meta description; optionally switch redirects to 308. *(M5)*

### Phase D — Content / E-E-A-T *(ongoing)*
11. Add a visible author byline + linked bio to every blog post / case study. *(H2)*
12. Add a Sanity-backed testimonials/reviews component with real named-client quotes; substantiate or soften unverified metrics ("100% satisfaction", "99.9% uptime", "24/7 support", "25+ websites"). *(H3)*
13. Expand `/es/sobre-mi` to ~800 words (EN parity). *(M2)*
14. Misc Low items: robots.txt `Content-Signal:`, llms.txt sub-structure, "Last updated" dates.

### Phase E — Off-site authority *(USER ACTION — see Section 5; biggest single score lever)*

---

## 5. Off-Site Authority — Checklist + Draft Assets

Brand authority (26/100) is the largest single drag on the composite score and the main reason the
site doesn't surface in AI answers despite excellent owned pages. None of this can be coded — it
requires claiming/creating profiles and earning third-party signals. Below is the action checklist
plus ready-to-use draft copy.

### 5.1 Action Checklist (in priority order)

- [ ] **Google Business Profile** — create & fully populate (Punta Cana, NAP matching site schema, services, photos). *Highest ROI; feeds Google AI Overviews + Gemini + local pack.*
- [ ] **Clutch profile** — claim, complete, and collect 3-5 verified client reviews.
- [ ] **Trustpilot** — create a business profile and request reviews.
- [ ] **LinkedIn Company Page** — create (separate from James's personal profile) and cross-link.
- [ ] **Wikidata item** — create a `DR Web Studio` entity (organization, founder, location, website) — the strongest cross-platform entity signal for ChatGPT/Gemini/Perplexity.
- [ ] **Bing Webmaster Tools** — verify the site; enable **IndexNow** (feeds Bing + ChatGPT search).
- [ ] **Community corroboration** — genuine, value-add participation (with brand attribution, no spam) in r/webdev, r/DominicanRepublic, r/PuntaCana, Quora, and DR/tourism business directories.
- [ ] **Wire it all into schema** — once profiles exist, add every URL to the org node's `sameAs` (Phase A, step 1).

### 5.2 Draft — Google Business Profile description

> **Short (≤250 chars):**
> DR Web Studio builds fast, custom websites for businesses in Punta Cana and across the Dominican Republic. Bilingual (English/Spanish) sites using modern technology — Next.js, Sanity CMS — built to load fast and grow your business.

> **Long:**
> DR Web Studio is a web development studio based in Punta Cana, Dominican Republic, founded by James Karnes. We design and build fast, modern, fully custom websites for tourism businesses, e-commerce stores, and local companies — in both English and Spanish. Unlike template builders, every site is hand-built with modern frameworks (Next.js, Sanity CMS, Tailwind CSS) for top performance, strong SEO, and long-term scalability. Services include custom business websites, landing pages, e-commerce stores, web applications, headless CMS development, website migrations, multilingual/international sites, API integrations, and ongoing maintenance. Serving Punta Cana, Santo Domingo, and the wider Dominican Republic, plus international clients.
>
> **Primary category:** Website Designer · **Additional:** Web Developer, Software Company
> **Service area:** Punta Cana, La Altagracia, Santo Domingo, Dominican Republic (+ remote/international)
> **Attributes:** Online appointments · Online estimates · Identifies as veteran/owner-led (as applicable) · Languages: English, Spanish

### 5.3 Draft — Clutch / LinkedIn Company Page copy

> **Tagline:** Custom, fast, bilingual websites — built in the Dominican Republic.
>
> **About:**
> DR Web Studio is a Punta Cana–based web development studio building high-performance, fully custom websites for Dominican and international businesses. We specialize in modern, multilingual (EN/ES) sites using Next.js and Sanity CMS — engineered to load fast, rank well, and convert visitors into customers. From tourism and hospitality to e-commerce and local services, we replace slow templates and WordPress builds with hand-crafted sites that scale.
>
> **Services:** Custom Business Websites · Landing Pages · E-commerce · Web Applications · Headless CMS · Website Migrations & Rebuilds · Multilingual/International Sites · API Integrations & Automation · Ongoing Maintenance & Support
>
> **Founded:** 2023 · **HQ:** Punta Cana, Dominican Republic · **Specialties:** Next.js, React, TypeScript, Sanity, Web Performance, SEO, E-commerce, Bilingual SEO

### 5.4 Draft — Review-request templates

> **English (email/WhatsApp):**
> Hi [Name], it was a pleasure building [project] with you. If you have two minutes, a short review would mean a lot and helps other Dominican business owners find us. You can leave one here: [Google review link] (or [Clutch link]). Thank you so much — James, DR Web Studio.

> **Español (correo/WhatsApp):**
> Hola [Nombre], fue un placer crear [proyecto] contigo. Si tienes dos minutos, una breve reseña significaría mucho y ayuda a otros negocios dominicanos a encontrarnos. Puedes dejarla aquí: [enlace de reseña de Google] (o [enlace de Clutch]). ¡Muchas gracias! — James, DR Web Studio.

### 5.5 Consolidated `sameAs` array (wire into the org node once profiles exist)

```json
"sameAs": [
  "https://www.linkedin.com/company/dr-web-studio",
  "https://www.linkedin.com/in/james-karnes/",
  "https://github.com/Karnes232",
  "https://www.instagram.com/drwebstudio",
  "https://clutch.co/profile/dr-web-studio",
  "https://www.trustpilot.com/review/dr-webstudio.com",
  "https://www.wikidata.org/wiki/QXXXXXXX",
  "https://www.facebook.com/drwebstudio",
  "[Google Business Profile / Maps share URL]"
]
```

*(Replace placeholders with the real URLs as each profile goes live. Keep personal LinkedIn + GitHub on the `Person` node; company/business profiles on the `Organization` node.)*

---

## 6. Next Steps

1. **Review this report** and decide which phases to implement.
2. **Start Phase E now** (off-site) — it's the biggest lever and runs in parallel with everything else. The draft assets in Section 5 are ready to publish.
3. **Approve a follow-up implementation round** for Phases A-C (high-confidence code fixes, ~2-3 days total) when ready.
4. Optional: run `/geo report-pdf` to render a styled client PDF of this report.

> **Bottom line:** Fixing the schema entity conflict (C1/C2), making FAQ answers crawlable (C3), and
> building Google Business Profile + Clutch reviews + a LinkedIn company page (Phase E) would move
> DR Web Studio from **71 ("Good")** toward **80+ ("Excellent")** — and, more importantly, convert
> its already-excellent owned pages into actual AI citations.

---

*Generated by the GEO-SEO Analysis tool · GEO-first, SEO-supported · 2026-06-23*
