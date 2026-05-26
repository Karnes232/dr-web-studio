import { defineField, defineType } from "sanity"

const localizedString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "en", title: "English", type: "string" }),
      defineField({ name: "es", title: "Spanish", type: "string" }),
    ],
  })

const localizedText = (name: string, title: string, rows = 3) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "en", title: "English", type: "text", rows }),
      defineField({ name: "es", title: "Spanish", type: "text", rows }),
    ],
  })

const localizedStringArray = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({
        name: "en",
        title: "English",
        type: "array",
        of: [{ type: "string" }],
      }),
      defineField({
        name: "es",
        title: "Spanish",
        type: "array",
        of: [{ type: "string" }],
      }),
    ],
  })

export default defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  groups: [
    { name: "meta", title: "Page Meta" },
    { name: "hero", title: "Hero Section" },
    { name: "stats", title: "Stats Bar" },
    { name: "services", title: "Services Grid" },
    { name: "whyUs", title: "Why Choose Us" },
    { name: "process", title: "Process Steps" },
    { name: "portfolio", title: "Portfolio Highlight" },
    { name: "testimonials", title: "Testimonials" },
    { name: "faq", title: "FAQ" },
    { name: "structuredData", title: "Structured Data" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal Title",
      type: "string",
      group: "meta",
      description: "Used for identification in the Studio only",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "meta",
      description:
        "Must match the URL path segment exactly (e.g. desarrollo-web-republica-dominicana)",
      options: { source: "title", maxLength: 96 },
      validation: Rule => Rule.required(),
    }),

    // ──────────────────────────────────────────
    // HERO SECTION
    // ──────────────────────────────────────────
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      group: "hero",
      fields: [
        localizedString("headline", "Headline"),
        localizedText("subheadline", "Subheadline", 3),
        localizedString("primaryCta", "Primary CTA Text"),
        defineField({
          name: "primaryCtaHref",
          title: "Primary CTA Link",
          type: "string",
          description: "Relative path (e.g. /es/contact) or anchor (#contact)",
        }),
        localizedString("secondaryCta", "Secondary CTA Text"),
        defineField({
          name: "secondaryCtaHref",
          title: "Secondary CTA Link",
          type: "string",
        }),
        localizedString("badge", "Trust Badge Text"),
        defineField({
          name: "backgroundImage",
          title: "Background Image (optional)",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),

    // ──────────────────────────────────────────
    // STATS BAR
    // ──────────────────────────────────────────
    defineField({
      name: "statsBar",
      title: "Stats Bar",
      type: "array",
      group: "stats",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string" }),
            localizedString("label", "Label"),
          ],
          preview: {
            select: { value: "value", label: "label.en" },
            prepare({ value, label }: { value?: string; label?: string }) {
              return { title: `${value ?? ""} — ${label ?? ""}` }
            },
          },
        },
      ],
    }),

    // ──────────────────────────────────────────
    // SERVICES GRID
    // ──────────────────────────────────────────
    defineField({
      name: "servicesGrid",
      title: "Services Grid",
      type: "object",
      group: "services",
      fields: [
        localizedString("sectionTitle", "Section Title"),
        localizedText("sectionSubtitle", "Section Subtitle", 2),
        defineField({
          name: "items",
          title: "Service Items",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "icon",
                  title: "Lucide Icon Name",
                  type: "string",
                  description: "e.g. Globe, ShoppingCart, Layout",
                }),
                localizedString("title", "Title"),
                localizedText("description", "Description", 2),
                defineField({
                  name: "linkSlug",
                  title: "Link Slug (optional)",
                  type: "string",
                  description: "Links to /our-services/{slug}",
                }),
              ],
              preview: {
                select: { title: "title.en", icon: "icon" },
                prepare({ title, icon }: { title?: string; icon?: string }) {
                  return { title: `${icon ?? ""} ${title ?? "Service"}` }
                },
              },
            },
          ],
        }),
      ],
    }),

    // ──────────────────────────────────────────
    // WHY CHOOSE US
    // ──────────────────────────────────────────
    defineField({
      name: "whyUs",
      title: "Why Choose Us",
      type: "object",
      group: "whyUs",
      fields: [
        localizedString("sectionTitle", "Section Title"),
        localizedText("sectionSubtitle", "Section Subtitle", 2),
        defineField({
          name: "items",
          title: "Differentiators",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "icon",
                  title: "Lucide Icon Name",
                  type: "string",
                }),
                localizedString("title", "Title"),
                localizedText("description", "Description", 2),
              ],
              preview: {
                select: { title: "title.en" },
                prepare({ title }: { title?: string }) {
                  return { title: title ?? "Differentiator" }
                },
              },
            },
          ],
        }),
      ],
    }),

    // ──────────────────────────────────────────
    // PROCESS STEPS
    // ──────────────────────────────────────────
    defineField({
      name: "process",
      title: "Process Steps",
      type: "object",
      group: "process",
      fields: [
        localizedString("sectionTitle", "Section Title"),
        localizedText("sectionSubtitle", "Section Subtitle", 2),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "number",
                  title: "Step Number",
                  type: "number",
                }),
                defineField({
                  name: "icon",
                  title: "Lucide Icon Name",
                  type: "string",
                }),
                localizedString("stepTitle", "Title"),
                localizedText("description", "Description", 2),
                localizedString("duration", "Duration"),
              ],
              preview: {
                select: { number: "number", title: "stepTitle.en" },
                prepare({
                  number,
                  title,
                }: {
                  number?: number
                  title?: string
                }) {
                  return { title: `Step ${number ?? "?"}: ${title ?? ""}` }
                },
              },
            },
          ],
        }),
      ],
    }),

    // ──────────────────────────────────────────
    // PORTFOLIO HIGHLIGHT
    // ──────────────────────────────────────────
    defineField({
      name: "portfolioHighlight",
      title: "Portfolio Highlight",
      type: "object",
      group: "portfolio",
      fields: [
        localizedString("sectionTitle", "Section Title"),
        localizedText("sectionSubtitle", "Section Subtitle", 2),
        defineField({
          name: "projects",
          title: "Featured Projects",
          type: "array",
          of: [{ type: "reference", to: [{ type: "project" }] }],
          validation: Rule => Rule.max(3),
        }),
        localizedString("ctaText", "CTA Text"),
        defineField({ name: "ctaHref", title: "CTA Link", type: "string" }),
      ],
    }),

    // ──────────────────────────────────────────
    // TESTIMONIALS
    // ──────────────────────────────────────────
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "object",
      group: "testimonials",
      fields: [
        localizedString("sectionTitle", "Section Title"),
        defineField({
          name: "items",
          title: "Testimonials",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                localizedText("quote", "Quote", 3),
                defineField({
                  name: "author",
                  title: "Author Name",
                  type: "string",
                }),
                defineField({
                  name: "company",
                  title: "Company / Role",
                  type: "string",
                }),
                defineField({
                  name: "rating",
                  title: "Rating (1-5)",
                  type: "number",
                  validation: Rule => Rule.min(1).max(5),
                }),
                defineField({
                  name: "avatar",
                  title: "Avatar Image",
                  type: "image",
                }),
              ],
              preview: {
                select: { author: "author", company: "company" },
                prepare({
                  author,
                  company,
                }: {
                  author?: string
                  company?: string
                }) {
                  return { title: author ?? "Testimonial", subtitle: company }
                },
              },
            },
          ],
        }),
      ],
    }),

    // ──────────────────────────────────────────
    // FAQ
    // ──────────────────────────────────────────
    defineField({
      name: "faq",
      title: "FAQ",
      type: "object",
      group: "faq",
      fields: [
        localizedString("sectionTitle", "Section Title"),
        localizedText("sectionSubtitle", "Section Subtitle", 2),
        defineField({
          name: "items",
          title: "Questions",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                localizedString("question", "Question"),
                localizedText("answer", "Answer", 4),
              ],
              preview: {
                select: { question: "question.es" },
                prepare({ question }: { question?: string }) {
                  return { title: question ?? "FAQ" }
                },
              },
            },
          ],
        }),
      ],
    }),

    // ──────────────────────────────────────────
    // STRUCTURED DATA (JSON-LD)
    // ──────────────────────────────────────────
    defineField({
      name: "structuredData",
      title: "Structured Data (JSON-LD)",
      type: "object",
      group: "structuredData",
      description: "JSON-LD for LocalBusiness, Service, and FAQPage schemas",
      fields: [
        defineField({
          name: "en",
          title: "English JSON-LD",
          type: "text",
          rows: 15,
          validation: Rule =>
            Rule.custom(text => {
              if (!text) return true
              try {
                JSON.parse(text)
                return true
              } catch {
                return "Must be valid JSON"
              }
            }),
        }),
        defineField({
          name: "es",
          title: "Spanish JSON-LD",
          type: "text",
          rows: 15,
          validation: Rule =>
            Rule.custom(text => {
              if (!text) return true
              try {
                JSON.parse(text)
                return true
              } catch {
                return "Must be valid JSON"
              }
            }),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare({ title, slug }: { title?: string; slug?: string }) {
      return {
        title: title ?? "Landing Page",
        subtitle: slug ? `/${slug}` : "no slug",
      }
    },
  },
})
