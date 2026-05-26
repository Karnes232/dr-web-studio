# Sanity CMS

## Setup

- **Project config**: `sanity.config.ts` (root) — basePath `/studio`, plugins: `structureTool`, `media`, `visionTool`
- **Env vars**: `src/sanity/env.ts` — reads `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- **API version**: `2025-06-01` (or latest if env var unset)
- **Studio URL**: `/studio` (bypasses locale middleware)

## Clients

| File                              | Purpose                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------- |
| `src/sanity/lib/client.ts`        | Read-only CDN client (`useCdn: true`). Use for all page data.                    |
| `src/sanity/lib/live.ts`          | `sanityFetch` + `SanityLive` for live/real-time content (experimental API `vX`). |
| `src/sanity/lib/image.ts`         | `imageUrlBuilder` — use `urlFor(source).url()` for image URLs.                   |
| `src/sanity/lib/blogImageUrls.ts` | Image URL helper scoped to blog Portable Text.                                   |

## Schema Types Catalogue

All schema types are registered in `src/sanity/schemaTypes/index.ts`.

### Layout / Global

| Type            | File                      | Description                                                       |
| --------------- | ------------------------- | ----------------------------------------------------------------- |
| `generalLayout` | `layout/generalLayout.ts` | Logo, footer logo, company name, email, social links, footer text |
| `stats`         | `layout/stats.ts`         | Site-wide stats shown in various sections                         |

### Home Page

| Type                | File                         |
| ------------------- | ---------------------------- |
| `heroSection`       | `home/HomePageHero.ts`       |
| `heroVisualElement` | `home/HeroVisualElements.ts` |
| `homePageService`   | `home/HomePageService.ts`    |
| `previousClients`   | `home/PreviousClients.ts`    |
| `testimonial`       | `home/Testimonial.ts`        |
| `trustSignals`      | `home/TrustSignals.ts`       |

### Services

| Type                | File                                                                |
| ------------------- | ------------------------------------------------------------------- |
| `service`           | `services/Service.ts` — full service detail (Portable Text content) |
| `serviceItem`       | `services/serviceItem.ts` — lightweight card used in listings/nav   |
| `servicesHeader`    | `services/servicesHeader.ts`                                        |
| `featuresStrip`     | `services/featuresStrip.ts`                                         |
| `customSolutionCTA` | `services/customSolutionCTA.ts`                                     |
| `serviceCategory`   | `services/category.ts`                                              |

### Blog

| Type           | File                                                            |
| -------------- | --------------------------------------------------------------- |
| `blogPost`     | `blog/blogPost.ts` — slug, author, category, Portable Text body |
| `author`       | `blog/author.ts`                                                |
| `blogCategory` | `blog/blogCategory.ts`                                          |
| `blogHeader`   | `blog/blogHeader.ts`                                            |

### Portfolio

| Type              | File                           |
| ----------------- | ------------------------------ |
| `project`         | `portfolio/project.ts`         |
| `portfolioHeader` | `portfolio/portfolioHeader.ts` |

### Pricing

| Type                | File                       |
| ------------------- | -------------------------- |
| `pricingData`       | `pricing/pricingData.ts`   |
| `pricingHeader`     | `pricing/pricingHeader.ts` |
| `pricingFaq`        | `pricing/faq.ts`           |
| `pricingFaqsHeader` | `pricing/faqsHeader.ts`    |

### About Me

| Type                   | File                               |
| ---------------------- | ---------------------------------- |
| `aboutSectionHeader`   | `about-me/sectionHeader.ts`        |
| `personalStory`        | `about-me/personalStory.ts`        |
| `developmentApproach`  | `about-me/developmentApproach.ts`  |
| `technologies`         | `about-me/technologies.ts`         |
| `whyChooseUs`          | `about-me/whyChooseUs.ts`          |
| `locationAvailability` | `about-me/locationAvailability.ts` |

### Contact

| Type           | File                      |
| -------------- | ------------------------- |
| `contactHero`  | `contact/contactHero.ts`  |
| `contactFaq`   | `contact/contactFaq.ts`   |
| `locationInfo` | `contact/locationInfo.ts` |

### FAQs

| Type             | File                                                     |
| ---------------- | -------------------------------------------------------- |
| `faqCategory`    | `faqs/faqCategory.ts` — category with array of Q&A items |
| `faqsPageHeader` | `faqs/faqsPageHeader.ts`                                 |

### Payment

| Type             | File                                                          |
| ---------------- | ------------------------------------------------------------- |
| `customPayment`  | `payment/customPayment.ts` — configures custom checkout page  |
| `paymentSuccess` | `payment/paymentSuccess.ts` — configures success page content |

### Project Planner

| Type                   | File                                      |
| ---------------------- | ----------------------------------------- |
| `projectPlannerHeader` | `project-planner/projectPlannerHeader.ts` |
| `websiteType`          | `project-planner/websiteType.ts`          |
| `timeline`             | `project-planner/timeline.ts`             |
| `budget`               | `project-planner/budget.ts`               |
| `features`             | `project-planner/features.ts`             |
| `designStyle`          | `project-planner/designStyle.ts`          |
| `pagesCount`           | `project-planner/pagesCount.ts`           |
| `contentStatus`        | `project-planner/contentStatus.ts`        |
| `languages`            | `project-planner/languages.ts`            |
| `contactForm`          | `project-planner/contactForm.ts`          |

### SEO

| Type  | File                                                                            |
| ----- | ------------------------------------------------------------------------------- |
| `seo` | `seo/seo.ts` — per-page meta, OG, noIndex, canonical, structured data (JSON-LD) |

### Legal

| Type    | File                                                               |
| ------- | ------------------------------------------------------------------ |
| `legal` | `legal/legal.ts` — privacy policy + terms of service Portable Text |

### Pillar Page

| Type         | File                                                     |
| ------------ | -------------------------------------------------------- |
| `pillarPage` | `pillar-page/pillarPage.ts` — long-form SEO content type |

---

## Localised Fields Pattern

Sanity stores multilingual strings as plain objects, not i18n plugins:

```ts
// Schema field definition
defineField({
  name: "title",
  type: "object",
  fields: [
    defineField({ name: "en", type: "string" }),
    defineField({ name: "es", type: "string" }),
  ],
})
```

Access in components: `data.title[lang]`  
Access in GROQ: `title.en`, `title.es` — or just `title` and destructure in the component.

---

## GROQ Query Patterns

### Basic fetch (single document)

```ts
import { client } from "@/sanity/lib/client"

const data = await client.fetch(`
  *[_type == "heroSection"][0] {
    heading,
    subheading
  }
`)
```

### Fetch with image

```ts
*[_type == "blogPost"][0] {
  title,
  mainImage {
    asset->{ url, metadata { dimensions, lqip } },
    alt
  }
}
```

### Fetch referenced documents

```ts
*[_type == "heroSection"][0] {
  visualElements[]->{ _id, title, icon, order }
}
```

### Fetch by slug

```ts
*[_type == "blogPost" && slug.current == $slug][0] {
  title,
  body
}
```

Pass `{ slug }` as the params argument to `client.fetch()`.

### SEO query (used on every page)

```ts
import { getSEO, getSeoSchema } from "@/sanity/queries/seo"

// In generateMetadata()
const seoData = await getSEO("home") // pageKey matches _type or a custom identifier

// In the page component (for JSON-LD structured data)
const seoData = await getSeoSchema("home")
```

---

## Studio Structure

Custom sidebar defined in `src/sanity/structure.ts`. Groups documents by section (Home, Services, Blog, etc.) instead of the default flat list.

To add a new section to the Studio sidebar, edit `structure.ts` and add a `listItem` with the appropriate document type.
