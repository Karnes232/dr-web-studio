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

export default defineType({
  name: "servicesHeader",
  title: "Services Header",
  type: "document",
  fields: [
    defineField({
      name: "badge",
      title: "Badge Text",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "string",
          validation: Rule => Rule.required(),
        },
        {
          name: "es",
          title: "Spanish",
          type: "string",
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "string",
          validation: Rule => Rule.required(),
        },
        {
          name: "es",
          title: "Spanish",
          type: "string",
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "highlightedText",
      title: "Highlighted Text",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "string",
          validation: Rule => Rule.required(),
        },
        {
          name: "es",
          title: "Spanish",
          type: "string",
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "text",
          validation: Rule => Rule.required(),
        },
        {
          name: "es",
          title: "Spanish",
          type: "text",
          validation: Rule => Rule.required(),
        },
      ],
    }),
    // ──────────────────────────────────────────
    // FAQ
    // ──────────────────────────────────────────
    defineField({
      name: "faq",
      title: "FAQ",
      type: "object",
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
  ],
  preview: {
    select: {
      title: "title.en",
    },
  },
})
