# Add "AI WhatsApp Assistant" as a DR Web Studio service

## Context

James has a working multi-tenant WhatsApp AI agent. It runs live on DR's own number (+1 204-809-3662) and for Grand Bay of the Sea. He wants to sell it as a service on dr-webstudio.com, including to businesses whose website he didn't build. Nothing on the site mentions it today. The closest offer is a $200 "WhatsApp Business API integration" add-on under API Integrations & Automation, and that add-on only sends one-way notifications.

Outcome: a public, priced, bilingual offer in four places:

- a service page
- a /pricing card
- a Spanish-first SEO landing page
- DR's own bot, which can quote it and works as the live demo

## The offer (approved)

- **Name:** AI WhatsApp Assistant / Asistente de WhatsApp con IA.
- **Price:** **$300 one-time setup (paid upfront) + $49/mo, month-to-month, cancel anytime.**
- **What it does:**
  - answers the business's WhatsApp 24/7 in es/en, from the business's own information
  - says it's an AI on the first message
  - saves leads and emails the owner
  - hands custom quotes, complaints and unknowns to a person
  - staff keep using the WhatsApp Business app (coexistence); the bot steps back once staff reply
- **Setup includes:** connecting the number, building the knowledge with the client, and bilingual testing.
- **Monthly includes:** hosting, AI usage up to ~500 bot replies/month, and knowledge updates. **Past the allowance, the bot pauses** and staff answer until the next month or an upgrade. This uses the existing tenant allowance and spend cap with `capReachedNotice`.
- **Meta fees:** the client pays Meta directly for any business-started template messages. Replies inside 24h are free.
- **Works even if we didn't build your website.**
- **Won't do:** payments, calendar booking, mass broadcasts, custom price calculation (escalates). The pitch is "never miss a message at night", not "replace your staff".
- **Grand Bay of the Sea** (PADI dive center, Punta Cana) may be named as a client using it. James may want to give them a heads-up before launch.

## Slugs

|                                 | es                                                    | en                                        |
| ------------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| Service                         | `/es/nuestros-servicios/asistente-de-whatsapp-con-ia` | `/en/our-services/ai-whatsapp-assistant`  |
| Landing (folder/route key = es) | `/es/chatbot-whatsapp-republica-dominicana`           | `/en/whatsapp-chatbot-dominican-republic` |

**Which page owns which keyword:**

- **Landing page:** "chatbot WhatsApp República Dominicana" and "bot de WhatsApp para negocios".
- **Service page:** "asistente de WhatsApp con IA", plus the price and details.
- **API page:** keeps "WhatsApp Business API", for notifications only.
- Each page links to the others once.

## Step 0: Design doc

Commit this design as `docs/superpowers/specs/2026-10-29-whatsapp-assistant-service-design.md`.

## Commit 1: Site code (no prompt changes)

1. **WhatsApp demo button on the service page**
   - **`serviceItem.ts` schema:** add an optional `whatsappDemo` boolean.
   - **`queries/services/serviceItem.ts`:** project the new field in `serviceItemIndividualQuery` and its type.
   - **`our-services/[slug]/page.tsx`:** when `whatsappDemo` is set, build `demoHref = waHref(layout.whatsapp, t("whatsappDemo.message"))`. Reuse `waHref` from `src/lib/contact.ts:8` and `getLayoutSchemaData()` from `src/sanity/queries/layout/generalLayout.ts`.
   - **`ServiceHero.tsx`:** pass `demoHref` through `IndividualServiceContent`. When it's set, the warm primary button becomes:
     - a `TrackedLink` (`contact_whatsapp`, `location: "service_demo"`)
     - `target="_blank"`, with an `FaWhatsapp` icon
     - it replaces "Start Project", since the planner doesn't sell this service
     - a one-line caption sits underneath
   - Other services are unchanged.
2. **Translations** (en + es `translation.json`): add a `whatsappDemo` block with `cta`, `note` and `message`.
   - Prefill text: "¡Hola! Quiero probar el asistente de WhatsApp con IA." / "Hi! I want to try the AI WhatsApp assistant."
   - Both contain words `locale.ts` detects, so the chat starts in the right language.
3. **`ServiceCardHeader.tsx`:** add `MessageCircle` to the icon map, with a fallback to `Globe`. Today an unknown icon crashes the hub.
4. **JSON-LD price (setup + monthly)**
   - **`src/lib/schema/config.ts`:** widen the `SERVICE_PRICES` type to `{ price; unit?: "MONTH"; setup? }`. Add `"ai-whatsapp-assistant": { price: 49, unit: "MONTH", setup: 300 }`.
   - **`nodes.ts` (`serviceNode`, `offerCatalogNode`) and `graph.ts`:** when `setup` is set, emit `priceSpecification` as an array: a monthly `UnitPriceSpecification` 49 USD plus a one-time setup `PriceSpecification` 300 USD.
   - Add a test in `nodes.test.ts`.
5. **Pricing card price note**
   - **`pricingData.ts`:** add an optional `priceNote {en, es}`, e.g. "+ $300 one-time setup".
   - **`queries/pricing/pricingData.ts`:** project it.
   - **`PricingCard.tsx`:** render it under the price, and add `MessageCircle` to its icon map.
6. **`pricing/page.tsx`:** with 5 cards, switch the grid to `flex flex-wrap justify-center`, laid out 3 + 2 with the second row centred.
7. **Landing route**, following commits c9e4937 + 5949848:
   - **Page folder:** `src/app/(root)/[lang]/chatbot-whatsapp-republica-dominicana/page.tsx`. Copy `mantenimiento-web-republica-dominicana/page.tsx`. Override `hero.primaryCtaHref` with the demo wa.me link.
   - **`src/i18n/routing.ts`:** add the pathname entry.
   - **`src/lib/indexableRoutes.ts`:** add it to `LANDING_PAGE_ROUTES`.
   - **`src/app/llms.txt/route.ts`:** add a `LANDING_PAGE_META` entry. A missing entry is a compile error.
   - **`src/sanity/schemaTypes/seo/seo.ts`:** add the `pageName` option.
   - **`src/app/(root)/[lang]/sitemap/page.tsx`:** add en/es labels.
8. **`LandingHero.tsx` / `LandingCta.tsx`:** render `https://` hrefs as an external `TrackedLink`.
   - `LandingContactCta` takes an optional `whatsappText`, so this page's bottom link uses the demo prefill too.

## Commit 2: DR's agent (on its own, re-records the golden snapshot)

9. **`src/lib/agent/prompt.ts`**
   - **Line 12:** the persona says DR is a web studio "that also sets up AI WhatsApp assistants for other businesses".
   - **Line 38 (bug fix):** `planificador-de-proyecto` → `planificador-de-proyectos`. It is a 404 today.
   - **New short section:**
     - (a) A visitor who wants to try it is told this chat _is_ the demo, and invited to ask what their own customers would ask.
     - (b) State "$300 one-time setup" and "$49 per month" as two separate figures. Never total, prorate or discount them; the existing "no totals" rule at `prompt.ts:34` covers this.
     - (c) Past the included replies, the assistant pauses, which can be stated. Anything else custom escalates.
     - (d) Leave `service_key` empty and put "AI WhatsApp Assistant" in `project_type`.
   - Keep the strings that `prompt.test.ts` asserts. Add a test for the no-total rule.
10. **`src/lib/agent/knowledge.ts:124` (bug fix):** use `one(p.pricePeriod, lang)`. Spanish chats currently get "/mo".
    - Append `priceNote` to the package heading.
    - Add `priceNote` to the `agentKnowledge.ts` packages projection and the `AgentPackage` type.
11. **No `plannerService` doc.** One would put the assistant into the /project-planner wizard as a one-time build, which is wrong. A lead with no matching key still saves, as `tools.ts:168-175` shows.
12. **Re-record the golden snapshot:** `npx vitest run src/lib/agent/profiles/drwebstudio.golden.test.ts -u`.
    - Optionally refresh `__fixtures__/knowledge.json` from live after seeding.
    - Cost: about a $0.09 cache write per locale, once.

## Content: `scripts/seedWhatsappAssistant.ts`

- Run with `npx tsx --env-file=.env.local scripts/...` and add a `--dry` flag.
- Use `createOrReplace` with **hyphenated** ids.
- Borrow the helpers from `git show c9e4937:scripts/seedConstructoras.ts`. The file is deleted from the tree, but it's still in git history.
- Copy is es-first, in natural Dominican "tú", with en versions.

**Documents to create:**

- **`serviceItem-ai-whatsapp-assistant`**
  - category: Support (`3a954b69-13e6-42da-8b03-fa71a9a98941`), `iconName: "MessageCircle"`, `priceRange: "300"`, `timeline: "1-2"`, `whatsappDemo: true`
  - `description` contains both figures
  - full `pageContent`:
    - mainDescription
    - before/after
    - benefits
    - 8 standard features
    - optional "Higher message volume", priced as Quoted
    - 4 steps
    - 6–8 FAQs covering month-to-month, the bot pausing past the allowance, and Meta fees paid by the client
  - `seo`
- **`pricingData-ai-whatsapp-assistant`**
  - `order: 5`, `price: "49"`, `pricePeriod {"/mo","/mes"}`, `priceNote` "+ $300 one-time setup"
  - "New" badge
  - CTA "See how it works" → `/chatbot-whatsapp-republica-dominicana`
  - 8 included features, plus `included:false` for "Payments or calendar booking" and "Mass broadcasts"
- **`landingPage-chatbot-whatsapp-republica-dominicana`**
  - **hero:** headline, the price, "aunque no hayamos hecho tu web"; demo CTA, with the secondary CTA pointing to the service page
  - **statsBar:** factual stats only
  - **servicesGrid:** "Qué hace", 6 items, one linking to the service
  - **whyUs:** honest limits; "we use it ourselves"; Grand Bay of the Sea named as a client
  - **process:** 4 steps
  - **FAQ:** ~10 items in Portable Text, with plain-text `answerText` for JSON-LD
  - **`structuredData`:** a Service node with both price specs
- **`seo-chatbot-whatsapp-republica-dominicana`**
- **Two pricing `faq` docs** (order 8, 9) on price and what's included, and on staff and limits. These are the only FAQs the agent's knowledge reads.

**Patches to existing documents:**

- **The API service's add-on** (`_key 066ef1483929`) and **`planner-addon-…-whatsapp-business-api-integration`:**
  - retitle as "Automatic WhatsApp Notifications" / "Notificaciones automáticas por WhatsApp"
  - fix the Spanish typo "nvía" → "Envía"
  - add a line pointing to the assistant
  - keep $200, and keep the planner `key` as it is

## Deploy order

Seed the content and deploy production in the same session, minutes apart. Redeploy after seeding so the ISR caches pick up the content. The agent's knowledge cache refreshes within about 1h, or on deploy. Seeding writes to the production dataset, so ask James before running it.

## Verification

1. `npx tsc --noEmit`, `npm run lint`, `npm test`. The golden test fails only in commit 2 and is re-recorded there.
2. `npm run build`.
3. Run `PORT=3200 npm run dev` and check both locales:
   - **Service page:**
     - the demo button opens `wa.me/12048093662?text=…` in the right language
     - the language switcher swaps slugs
     - canonical and hreflang are correct
     - the JSON-LD has two price specs
   - **/pricing:** 3 + 2 layout, the price note shows, the CTA localizes, light and dark mode.
   - **Landing page:** the hero CTA opens the demo, the FAQ JSON-LD is plain text, and the Service node is present.
   - **Elsewhere:**
     - the hub, header, mobile menu and footer list the service
     - the HTML sitemap label shows
     - `/sitemap.xml` includes both URLs
     - `/llms.txt` lists the service and the landing page
     - `/llms-full-es.txt` includes the landing content
     - the API page shows the renamed add-on
   - Validate the JSON-LD at validator.schema.org.
4. **Live WhatsApp test after deploy:**
   - **Spanish prefill:** expect the AI disclosure and "this chat is the demo".
   - **"¿cuánto cuesta?":** expect exactly $300 and $49 al mes.
   - **"¿y el primer mes?":** expect no $349.
   - **Heavy-volume question:** expect the pause explanation, or an escalation.
   - **Booking or payments:** expect a no.
   - Repeat in English.
   - In Supabase, the lead has `service_key` null and `project_type` "AI WhatsApp Assistant", and the lead email arrives.

## Calls Claude made (James can override)

- ~500 replies/month allowance.
- Category "Support", icon `MessageCircle`, "New" badge, pricing CTA → the landing page.
- The demo button replaces "Start Project" on this service page only.
- Small schema additions (`whatsappDemo`, `priceNote`) instead of squeezing everything into existing fields.
- No bundle discount mentioned.
- No public claim about how long conversations are stored.
