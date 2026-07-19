# GEO + SEO Audit Report — DR Web Studio

**Domain:** https://www.dr-webstudio.com
**Business:** DR Web Studio (James Karnes) — bilingual EN/ES web development agency, Punta Cana / Dominican Republic
**Business type:** Agency / Local-Service hybrid
**Report date:** 2026-06-23 — **Re-audit (live-verified, post-remediation)**
**Methodology:** GEO-first, SEO-supported. Baseline audit by 5 parallel analysis agents → remediation sprint → re-audit against the **live production site** plus a focused brand-authority web scan.

---

## Executive Summary

> **Composite GEO Score: 78 / 100 — "Good"** &nbsp;·&nbsp; up from **71** at baseline (+7)
> **Diagnosis: on-site work is done and verified live; the only real lever left is off-site reviews.**

This re-audit confirms — against the **live production site**, not just local code — that the
remediation shipped: every page serves one consistent, correct `LocalBusiness` entity (Punta Cana,
real email/phone), the location-page slug bug is gone, ~47 FAQ answers are now in the live HTML, and
the homepage stats are consistent. Structured Data is effectively maxed (96) and AI Citability is
strong (92).

Google Business Profile, Clutch, and Trustpilot are now **connected** and live in the site's entity
graph (`sameAs`) — which lifted Brand Authority from 26 to **38**. But those profiles are currently
**claimed-but-empty**: no indexed reviews, no organic search visibility. To AI engines that's
"entity exists," not "entity trusted." **Review volume is the single biggest remaining lever** — it,
plus a LinkedIn Company Page and a Wikidata entity, is what moves the composite into the low-80s
("Excellent").

---

## 1. Score Breakdown — baseline → now (live-verified)

| Category                   | Weight   | Baseline | Now    | Notes                                                                   |
| -------------------------- | -------- | -------- | ------ | ----------------------------------------------------------------------- |
| AI Citability & Visibility | 25%      | 85       | **92** | FAQ answers server-rendered & crawlable (verified live)                 |
| Brand Authority Signals    | 20%      | 26       | **38** | GBP + Clutch + Trustpilot connected in `sameAs`; no indexed reviews yet |
| Content Quality & E-E-A-T  | 20%      | 79       | **83** | Articles authored by James (Person); stats consistent                   |
| Technical Foundations      | 15%      | 91       | **91** | Strong; only the CSP header remains                                     |
| Structured Data            | 10%      | 82       | **96** | One consistent, correct entity graph site-wide (verified live)          |
| Platform Optimization      | 10%      | 66       | **78** | LocalBusiness everywhere + GBP local grounding                          |
| **Composite**              | **100%** | **71**   | **78** | **Good — on-site done; capped by off-site review volume**               |

### Per-platform readiness (AI search engines)

| Platform            | Baseline | Now | Notes                                                 |
| ------------------- | -------- | --- | ----------------------------------------------------- |
| Google AI Overviews | 78       | 86  | LocalBusiness + GBP grounding + crawlable FAQ answers |
| Google Gemini       | 71       | 79  | Consistent entity + founder Person node               |
| ChatGPT Search      | 62       | 69  | Clean entity; needs review corroboration              |
| Bing Copilot        | 54       | 58  | No Bing verification / IndexNow yet                   |
| Perplexity          | 45       | 52  | Still thin third-party footprint to cite              |

---

## 2. Fixed Since Baseline ✅ (verified on the live site)

- **[was Critical] Schema entity conflict.** Every page now serves one identical, correct
  `LocalBusiness #organization` (Punta Cana, james@dr-webstudio.com, +1 829-640-5433), code-generated
  from a single Sanity source of truth. Confirmed live on the homepage and location pages.
- **[was Critical] Location-page canonical-slug bug.** `/en/web-development-punta-cana` now uses its
  own EN slug throughout the schema (`@id`/`url`/breadcrumb). Confirmed live.
- **[was Critical] FAQ answers hidden from crawlers.** 47 answer paragraphs present in the live
  `/en/faqs` HTML.
- **[was Critical] Contradictory homepage stats.** Single-sourced (20+ clients / 50+ projects);
  hero and stats grid match.
- **[was High] Blog author was an Organization.** Articles now `BlogPosting` with James Karnes as
  the `Person` author + publisher + real dates.
- **Google Business Profile / Clutch / Trustpilot connected** in the org `sameAs` (GBP via canonical
  Maps CID URL).

---

## 3. Remaining Findings

Severity: **High** = meaningful authority/trust impact · **Medium** = best-practice gap · **Low** = polish.

### 🟠 High

**Off-site review volume (the #1 lever).** GBP, Clutch, and Trustpilot are connected but **empty** —
no indexed reviews, no organic visibility. Connected-but-empty corroborates _existence_, not _trust_.
Driving real reviews (GBP first) is what unlocks AI citation and moves Brand Authority out of the
Poor band. See Section 4.

**No LinkedIn Company Page / no Wikidata entity.** Only James's _personal_ LinkedIn exists; the brand
has no org-level social entity, and there's no Wikidata item (the top structured entity-recognition
signal for LLMs, and self-serve to create).

**H4 — Content-Security-Policy header missing.** `next.config.ts` sets HSTS / X-Frame-Options / etc.
but no CSP — the only remaining technical-foundations gap. Add it (Report-Only first, then enforce).

### 🟡 Medium

- **M1 — Sitemap hreflang.** Add per-URL `xhtml:link` alternates for the EN/ES pages in `src/app/sitemap.ts`.
- **M2 — Spanish About-page depth.** `/es/sobre-mi` (~320 words) is much thinner than EN (~800). ES is the priority market.
- **M5 — Metadata polish.** Homepage `<title>` is 64 chars (trim ≤60); strip trailing whitespace from the meta description.
- **M4 — `speakable` schema.** Add to FAQ/homepage/article nodes for voice & AI answer eligibility.
- **Niche directories.** Get listed _inside_ the directories DR-niche AI answers already cite (e.g. TechBehemoths "Web Design Punta Cana", Clutch "DR web developers") — currently the brand is adjacent to, not in, those lists.

### ⚪ Low

- `Content-Signal:` directive in robots.txt; deepen `llms.txt` (topical sub-sections + per-link descriptions);
  visible "Last updated" dates on posts; 307→308 redirects; validate live Core Web Vitals (hero image vs mobile LCP);
  remove the now-unused Sanity `seo.structuredData` fields; light community footprint (GitHub org, authentic forum participation).

---

## 4. Off-Site Authority — the path from 78 → low-80s

Brand Authority (38/100) is the only category materially holding the score down, and it's all
off-site. The site is already wired so any new profile URL added to the `generalLayout` CMS singleton
flows into the `#organization` `sameAs` on every page automatically.

### 4.1 Action Checklist (priority order)

- [x] **Google Business Profile** — claimed & connected in schema (canonical Maps URL).
- [x] **Clutch** — profile claimed & connected in `sameAs`.
- [x] **Trustpilot** — profile claimed & connected in `sameAs`.
- [ ] **Reviews (highest impact).** Drive 5–10 genuine client reviews — **Google Business Profile
      first** (best local-AI yield), then Clutch, then Trustpilot. This is what converts the
      connected profiles from "exists" to "trusted" and gets them indexed/surfaced.
- [ ] **LinkedIn Company Page** — create (separate from personal); add its URL to
      `generalLayout.socialLinks.linkedinCompany`.
- [ ] **Wikidata** — create a `DR Web Studio` item (org, founder James Karnes, Punta Cana, website,
      links to GBP/Clutch/LinkedIn); add to `sameAs`.
- [ ] **Bing Webmaster Tools** — verify + enable IndexNow (feeds Bing + ChatGPT search).
- [ ] **Niche directory listings** — TechBehemoths / Clutch DR ranking pages.
- [ ] **Light community footprint** — GitHub org link-back; authentic r/webdev / DR business participation.

### 4.2 Draft — review-request templates (use to drive 4.1's reviews)

> **English:** Hi [Name], it was a pleasure building [project] with you. If you have two minutes, a
> short Google review would mean a lot and helps other Dominican business owners find us: [GBP review
>
> > link]. Thank you — James, DR Web Studio.

> **Español:** Hola [Nombre], fue un placer crear [proyecto] contigo. Si tienes dos minutos, una
> breve reseña en Google significaría mucho y ayuda a otros negocios dominicanos a encontrarnos: [enlace
>
> > de reseña de GBP]. ¡Muchas gracias! — James, DR Web Studio.

### 4.3 Current `sameAs` (live in schema)

```json
"sameAs": [
  "https://maps.google.com/?cid=15778091063495627666",   // Google Business Profile (HTTP 200)
  "https://www.trustpilot.com/review/dr-webstudio.com",
  "https://clutch.co/profile/dr-web-studio"
]
```

_Add `linkedinCompany` and a Wikidata URL to `generalLayout` as those go live — they propagate site-wide automatically._

---

## 5. Recommended Next Steps

1. **Off-site sprint (your actions — biggest mover):** drive GBP reviews, create the LinkedIn Company
   Page and a Wikidata item. This is what lifts the composite into the low-80s.
2. **Technical quick wins (code, ~½ day):** CSP header + sitemap hreflang + metadata trims (H4/M1/M5).
3. **Content:** bring `/es/sobre-mi` to EN parity; add `speakable` + "Last updated" dates.

> **Bottom line:** The on-site engineering is finished and verified in production — DR Web Studio
> presents a clean, consistent, fully-crawlable entity with its review profiles connected. The
> remaining distance to "Excellent" is almost entirely **reviews and off-site entity presence**, not
> code.

---

_Generated by the GEO-SEO Analysis tool · GEO-first, SEO-supported · 2026-06-23 (re-audit, live-verified)_
