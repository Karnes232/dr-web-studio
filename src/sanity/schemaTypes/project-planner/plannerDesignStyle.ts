import { defineType, defineField } from "sanity"
import { localeString, localeText } from "./_localized"

export default defineType({
  name: "plannerDesignStyle",
  title: "Planner · Design Style",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key (stable id)",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    localeString("title", "Title"),
    localeText("description", "Description"),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: Rule => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title.en", subtitle: "key" },
  },
})
