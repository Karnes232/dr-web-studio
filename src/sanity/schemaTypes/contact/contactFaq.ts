import { defineField, defineType } from "sanity"

export default defineType({
  name: "contactFaq",
  title: "Contact FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "object",
      fields: [
        { name: "en", type: "string", title: "English" },
        { name: "es", type: "string", title: "Spanish" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "object",
      fields: [
        { name: "en", type: "text", title: "English" },
        { name: "es", type: "text", title: "Spanish" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "question.en",
      order: "order",
    },
    prepare({ title, order }) {
      return {
        title: title || "FAQ Item",
        subtitle: `Order: ${order}`,
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