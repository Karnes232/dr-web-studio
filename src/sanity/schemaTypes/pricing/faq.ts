import { defineField, defineType } from "sanity"

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
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
      name: "answer",
      title: "Answer",
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
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "question.en",
      subtitle: "answer.en",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle?.substring(0, 100) + (subtitle?.length > 100 ? "..." : ""),
      }
    },
  },
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
}) 