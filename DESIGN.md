---
name: DR Web Studio
description: Freelance web design & development portfolio and client site, bilingual (en/es), Dominican-market-first.
colors:
  ink: "#171717"
  canvas: "#ffffff"
  brand-orange: "#f97316"
  brand-orange-deep: "#ea580c"
  brand-yellow: "#eab308"
  brand-yellow-deep: "#ca8a04"
  signal-teal: "#14b8a6"
  signal-teal-deep: "#0d9488"
  slate-mist: "#f8fafc"
  slate-fog: "#f1f5f9"
  slate-muted: "#64748b"
  slate-ink: "#1e293b"
  slate-night: "#0f172a"
  hairline: "#e5e7eb"
  body-muted: "#4b5563"
  confirm: "#16a34a"
typography:
  display:
    fontFamily: "Crimson Pro, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  lg: "8px"
  xl: "12px"
  "2xl": "16px"
  full: "9999px"
spacing:
  card: "24px"
  card-lg: "32px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "linear-gradient(to right, {colors.brand-orange}, {colors.brand-yellow})"
    textColor: "{colors.ink}" # near-black ink (slate-950) — white fails WCAG AA on the yellow end
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "linear-gradient(to right, {colors.brand-orange-deep}, {colors.brand-yellow-deep})"
    textColor: "{colors.ink}"
  button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.brand-orange}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System: DR Web Studio

## 1. Overview

**Creative North Star: "The Proof of Craft"**

DR Web Studio sells web design and development, so the site itself is the single strongest case study in the portfolio. Every surface has one job: demonstrate the quality being sold. The system today is a competent, friendly, conversion-focused base built on Tailwind defaults: a white canvas, near-black ink, a warm orange-to-yellow gradient as the signature accent, teal as a secondary signal, Crimson Pro serif headlines over Inter body, and `rounded-xl` cards with a soft shadow lift on hover. It converts. It is also, honestly, close to the freelance-web-studio category default, which is exactly what this brand is moving away from.

This document captures the **real, current tokens** as a factual baseline, and steers them toward the brand's stated direction: **bold and modern, confident through restraint.** That means the gradient accent stays in the palette but stops being the only color move; the serif headline stays but starts carrying real hierarchy through scale and weight, not decoration; and the repeated icon-title-text card grid, the per-section uppercase eyebrow, and the gradient-text hero are treated as patterns to retire, not patterns to reuse. New work should look hand-built and intentional, never templated, sterile, loud, or cluttered.

**Key Characteristics:**

- White canvas, near-black ink; warmth carried by accent and type, not by a tinted background.
- One signature accent (orange→yellow), one secondary signal (teal). Used deliberately, not everywhere.
- Serif display (Crimson Pro) paired with humanist sans (Inter): contrast pairing, not two similar sans.
- Flat at rest, soft lift on interaction. Depth is a response to state, not decoration.
- Bilingual-safe: layouts, headlines, and labels must hold at Spanish copy lengths.

## 2. Colors

A warm, high-contrast palette: a neutral white-to-slate spine carrying one warm accent gradient and one cool secondary signal.

### Primary

- **Brand Orange** (`#f97316`): the signature accent and the start of the brand gradient. Anchors primary CTAs, hero highlight, key interactive emphasis. Deep variant **Brand Orange Deep** (`#ea580c`) is the hover/pressed state.
- **Brand Yellow** (`#eab308`): the end of the brand gradient (`orange → yellow`), used as a pair with Brand Orange on primary buttons, badges, and icon chips. Deep variant **Brand Yellow Deep** (`#ca8a04`) for hover.

### Secondary

- **Signal Teal** (`#14b8a6`): the cool counterweight to the warm gradient. Secondary CTAs, footer accents, occasional quote/marker emphasis. Deep variant **Signal Teal Deep** (`#0d9488`) for hover.

### Neutral

- **Ink** (`#171717`): primary text on light surfaces.
- **Canvas** (`#ffffff`): the default page and card background.
- **Slate Ink** (`#1e293b`) / **Slate Night** (`#0f172a`): headings and dark sections / overlays.
- **Slate Muted** (`#64748b`): de-emphasized text, captions, metadata. Verify >=4.5:1 before using on tinted backgrounds.
- **Slate Mist** (`#f8fafc`) / **Slate Fog** (`#f1f5f9`): alternating section backgrounds, subtle surfaces.
- **Hairline** (`#e5e7eb`): card borders and dividers.
- **Body Muted** (`#4b5563`): standard body copy when softer than Ink is wanted (passes AA on white).

### Tertiary / Status

- **Confirm** (`#16a34a`): success states, checkmarks, feature ticks. Reserved for genuine confirmation, not decoration.

### Named Rules

**The Earned Accent Rule.** The orange→yellow gradient is the brand's loudest move, so it is rationed. It belongs on the primary action and one or two genuine moments per screen, never as the default treatment for every card, icon, and heading. When everything is gradient, nothing is.

**The Warmth-From-Type Rule.** Warmth comes from the accent and the serif display, never from tinting the canvas. The background stays a true white (`#ffffff`); cream/sand/beige backgrounds are prohibited.

## 3. Typography

**Display Font:** Crimson Pro (with Georgia, serif fallback)
**Body Font:** Inter (with system-ui, sans-serif fallback)

**Character:** A genuine contrast pairing: a warm, high-contrast transitional serif for headlines against a neutral humanist sans for everything else. The serif gives the "made by someone with taste" signal; Inter keeps body copy plain and legible. Avoid letting Crimson Pro creep into UI labels or body, that flattens the contrast that makes the pairing work.

### Hierarchy

- **Display** (Crimson Pro, 700, `clamp(2.25rem, 5vw, 3rem)`, line-height 1.1, letter-spacing -0.02em): page and section headlines (`text-4xl md:text-5xl font-bold` today). Use `text-wrap: balance`.
- **Title** (Inter, 600, ~1.25rem): card titles, sub-section headings.
- **Body** (Inter, 400, 1rem, line-height ~1.65): paragraphs and descriptions. Cap measure at 65–75ch; use `text-wrap: pretty` on long prose.
- **Label** (Inter, 500, 0.75rem, letter-spacing 0.08em): small metadata, badges. Uppercase allowed only here and only for <=4-word labels.

### Named Rules

**The Hierarchy-By-Scale Rule.** Establish hierarchy with size and weight contrast (>=1.25 ratio between steps), not with color or all-caps. Headings earn attention by being bigger and heavier, not by shouting in uppercase.

**The No-Eyebrow-Reflex Rule.** A tiny uppercase tracked label above every section is the category tell this brand rejects. A kicker is allowed as a rare, deliberate device, never as the default scaffold on each section.

## 4. Elevation

The system is flat at rest and lifts on interaction. Surfaces sit directly on the canvas or on a tonal slate background (`#f8fafc` / `#f1f5f9`); depth is a response to state (hover, focus, active), not a permanent decoration. The current shadow ladder is Tailwind's defaults, used softly.

### Shadow Vocabulary

- **Resting card** (`box-shadow: 0 1px 3px rgba(15,23,42,.08), 0 1px 2px rgba(15,23,42,.04)`): the default `shadow-sm`/`shadow` on cards. Keep subtle; tint toward slate, never pure black.
- **Lift on hover** (`box-shadow: 0 10px 25px rgba(15,23,42,.10)`): the `shadow-lg`→`shadow-xl` transition on interactive cards, paired with a small `translateY(-2px)`.
- **Overlay** (`box-shadow: 0 20px 40px rgba(15,23,42,.16)`): modals and dialogs only.

### Named Rules

**The Flat-By-Default Rule.** Cards are flat at rest. Shadow appears as feedback on hover/focus, then settles back. Never pair a 1px border with a wide (>=16px) soft drop shadow on the same element; pick one.

## 5. Components

### Buttons

- **Shape:** gently rounded, `rounded-lg` (8px). Pills (`rounded-full`) reserved for tags/badges.
- **Primary:** the brand gradient `linear-gradient(to right, #f97316, #eab308)`, **near-black ink label (`text-slate-950`)**, `padding: 12px 24px`. The single highest-emphasis action on a screen. Ink (not white) because white text fails WCAG AA on the bright yellow end (~1.9:1); dark ink hits 7–10:1 and keeps the gradient vivid.
- **Hover / Focus:** gradient deepens to `#ea580c → #ca8a04`; subtle `scale`/lift. Provide a visible `:focus-visible` ring (do not rely on scale alone). Honor `prefers-reduced-motion`.
- **Outline / Secondary:** 2px `orange-600` border, `orange-700` text on white, inverts to orange fill + ink text on hover. Teal secondary uses `teal-700` + white (white passes on `teal-700`, not on `teal-500/600`).
- **Label:** verb + object ("Get a quote", "Start your project"), never "OK"/"Submit". Must fit one line at desktop in both en and es.

### Cards / Containers

- **Corner Style:** `rounded-xl` (12px) standard; `rounded-2xl` (16px) for large feature cards and modals. Never exceed 16px on a card.
- **Background:** Canvas (`#ffffff`); section wrappers alternate onto Slate Mist/Fog.
- **Shadow Strategy:** flat at rest, lift on hover (see Elevation).
- **Border:** 1px Hairline (`#e5e7eb`) when separation is needed.
- **Internal Padding:** 24px (`card`), 32px (`card-lg`) for prominent cards.

### Inputs / Fields

- **Style:** 1px Hairline border, white background, `rounded-lg` (8px), label above the field, helper below.
- **Focus:** visible focus ring in Brand Orange or Signal Teal at >=3:1 against the field.
- **Error / Disabled:** error text below the field in an accessible red; never placeholder-as-label.

### Navigation

- **Style:** single-line top nav, Inter, height <=80px. Default ink links, hover shifts toward Brand Orange. Active state is a weight or underline change, not a colored dot.
- **Mobile:** collapse to a hamburger before items wrap; never a two-line desktop nav.

### Signature: The Brand Gradient Chip

Small `rounded-lg` icon containers filled with a light tint of the brand gradient (`from-orange-100 to-yellow-100`) holding a single line icon. Useful, but per the Earned Accent Rule, do not place one on every list item.

## 6. Do's and Don'ts

### Do:

- **Do** keep the canvas a true white (`#ffffff`) and carry warmth through the accent and Crimson Pro display type.
- **Do** ration the orange→yellow gradient: primary action plus one or two real moments per screen.
- **Do** build hierarchy from scale and weight (>=1.25 step ratio), with `text-wrap: balance` on headings.
- **Do** keep cards flat at rest and let shadow appear as hover/focus feedback only.
- **Do** verify body text >=4.5:1 and large text >=3:1, and re-check at Spanish copy lengths (es runs longer).
- **Do** give every animation a `prefers-reduced-motion` alternative.

### Don't:

- **Don't** ship the generic SaaS/Squarespace/Wix-template look: identical icon-title-text card grids repeated down the page, gradient CTAs as the only color move, or a tiny uppercase tracked eyebrow above every section. (PRODUCT.md anti-reference.)
- **Don't** go corporate and sterile: cold faceless agency layouts, stock photography, zero personality. (PRODUCT.md anti-reference.)
- **Don't** go loud and flashy: over-animation, neon, gimmicky effects that distract from the work. (PRODUCT.md anti-reference.)
- **Don't** go cluttered and busy: too much on screen, weak hierarchy, everything competing for attention. (PRODUCT.md anti-reference.)
- **Don't** use gradient text (`background-clip: text`) on headlines; use a single solid color and earn emphasis with weight/size.
- **Don't** use a tinted cream/sand/beige body background.
- **Don't** round cards past 16px, or pair a 1px border with a >=16px soft drop shadow on the same element.
- **Don't** use em dashes in copy; use commas, colons, or periods.
- **Don't** set Crimson Pro on body or UI labels; the serif is for display only.
