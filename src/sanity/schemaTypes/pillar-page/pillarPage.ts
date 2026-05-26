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
  name: "pillarPage",
  title: "Pillar Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero Section" },
    { name: "comparison", title: "Comparison Table" },
    { name: "techStack", title: "Tech Stack" },
    { name: "caseStudies", title: "Case Studies" },
    { name: "processSteps", title: "Process Steps" },
    { name: "faqs", title: "FAQs" },
    { name: "structuredData", title: "Structured Data" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      description: "Internal title for identification in the Studio",
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
        localizedText("subheadline", "Subheadline"),
        defineField({
          name: "stats",
          title: "Statistics",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "value",
                  title: "Value",
                  type: "string",
                }),
                localizedString("label", "Label"),
              ],
              preview: {
                select: { value: "value", label: "label.en" },
                prepare({ value, label }: { value?: string; label?: string }) {
                  return { title: `${value || ""} — ${label || ""}` }
                },
              },
            },
          ],
        }),
        localizedString("readingTime", "Reading Time"),
        localizedString("lastUpdated", "Last Updated"),
      ],
    }),

    // ──────────────────────────────────────────
    // COMPARISON TABLE
    // ──────────────────────────────────────────
    defineField({
      name: "comparisonData",
      title: "Comparison Table Data",
      type: "array",
      group: "comparison",
      of: [
        {
          type: "object",
          fields: [
            localizedString("feature", "Feature"),
            defineField({
              name: "traditional",
              title: "Traditional",
              type: "object",
              fields: [
                localizedString("value", "Value"),
                defineField({
                  name: "icon",
                  title: "Icon Name",
                  type: "string",
                  description: "Lucide icon name (e.g. Turtle, Clock)",
                }),
                localizedString("description", "Description"),
              ],
            }),
            defineField({
              name: "modern",
              title: "Modern",
              type: "object",
              fields: [
                localizedString("value", "Value"),
                defineField({
                  name: "icon",
                  title: "Icon Name",
                  type: "string",
                  description: "Lucide icon name (e.g. Rocket, Zap)",
                }),
                localizedString("description", "Description"),
              ],
            }),
          ],
          preview: {
            select: { feature: "feature.en" },
            prepare({ feature }: { feature?: string }) {
              return { title: feature || "Comparison Item" }
            },
          },
        },
      ],
    }),

    // ──────────────────────────────────────────
    // TECH STACK
    // ──────────────────────────────────────────
    defineField({
      name: "techStack",
      title: "Tech Stack",
      type: "array",
      group: "techStack",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Technology Name",
              type: "string",
            }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "Frontend", value: "frontend" },
                  { title: "Backend", value: "backend" },
                  { title: "Database", value: "database" },
                  { title: "DevOps", value: "devops" },
                  { title: "Tools", value: "tools" },
                ],
              },
            }),
            localizedText("description", "Description", 2),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description: "Emoji or short text icon (e.g. ▲, ⚛️, TS)",
            }),
            localizedStringArray("benefits", "Benefits"),
            localizedStringArray("useCases", "Use Cases"),
            defineField({
              name: "popularity",
              title: "Popularity Score",
              type: "number",
              description: "Score from 0 to 100",
              validation: rule => rule.min(0).max(100),
            }),
          ],
          preview: {
            select: { name: "name", category: "category", icon: "icon" },
            prepare({
              name,
              category,
              icon,
            }: {
              name?: string
              category?: string
              icon?: string
            }) {
              return {
                title: `${icon || ""} ${name || "Tech Item"}`,
                subtitle: category,
              }
            },
          },
        },
      ],
    }),

    // ──────────────────────────────────────────
    // CASE STUDIES
    // ──────────────────────────────────────────
    defineField({
      name: "caseStudies",
      title: "Case Studies",
      type: "array",
      group: "caseStudies",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "caseId",
              title: "Case Study ID",
              type: "string",
              description:
                "Slug-like identifier (e.g. wedding-photography-portfolio)",
            }),
            defineField({
              name: "client",
              title: "Client Name",
              type: "string",
            }),
            localizedString("industry", "Industry"),
            defineField({
              name: "logo",
              title: "Logo",
              type: "image",
            }),
            localizedText("challenge", "Challenge", 4),
            localizedStringArray("solution", "Solution Points"),
            defineField({
              name: "results",
              title: "Results",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    localizedString("metric", "Metric"),
                    localizedString("before", "Before"),
                    localizedString("after", "After"),
                    localizedString("improvement", "Improvement"),
                  ],
                  preview: {
                    select: { metric: "metric.en" },
                    prepare({ metric }: { metric?: string }) {
                      return { title: metric || "Result" }
                    },
                  },
                },
              ],
            }),
            defineField({
              name: "technologies",
              title: "Technologies Used",
              type: "array",
              of: [{ type: "string" }],
            }),
            localizedString("timeline", "Timeline"),
            defineField({
              name: "testimonial",
              title: "Testimonial",
              type: "object",
              fields: [
                localizedText("quote", "Quote", 3),
                localizedString("author", "Author"),
                localizedString("role", "Role"),
              ],
            }),
          ],
          preview: {
            select: { client: "client", industry: "industry.en" },
            prepare({
              client,
              industry,
            }: {
              client?: string
              industry?: string
            }) {
              return {
                title: client || "Case Study",
                subtitle: industry,
              }
            },
          },
        },
      ],
    }),

    // ──────────────────────────────────────────
    // PROCESS STEPS
    // ──────────────────────────────────────────
    defineField({
      name: "processSteps",
      title: "Process Steps",
      type: "array",
      group: "processSteps",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "step",
              title: "Step Number",
              type: "number",
            }),
            localizedString("stepTitle", "Title"),
            localizedText("description", "Description", 3),
            localizedString("duration", "Duration"),
            localizedStringArray("deliverables", "Deliverables"),
            defineField({
              name: "icon",
              title: "Icon Name",
              type: "string",
              description: "Lucide icon name (e.g. Search, Palette, Code)",
            }),
          ],
          preview: {
            select: { step: "step", title: "stepTitle.en" },
            prepare({ step, title }: { step?: number; title?: string }) {
              return {
                title: `Step ${step || "?"}: ${title || "Untitled"}`,
              }
            },
          },
        },
      ],
    }),

    // ──────────────────────────────────────────
    // FAQS
    // ──────────────────────────────────────────
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "faqs",
      of: [
        {
          type: "object",
          fields: [
            localizedString("question", "Question"),
            localizedText("answer", "Answer", 4),
          ],
          preview: {
            select: { question: "question.en" },
            prepare({ question }: { question?: string }) {
              return { title: question || "FAQ" }
            },
          },
        },
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
      description: "JSON-LD structured data for search engines",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "text",
          rows: 15,
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "text",
          rows: 15,
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }: { title?: string }) {
      return { title: title || "Pillar Page" }
    },
  },
})
