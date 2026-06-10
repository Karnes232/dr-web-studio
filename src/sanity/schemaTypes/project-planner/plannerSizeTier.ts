import { defineType, defineField } from "sanity"
import { localeString } from "./_localized"

export default defineType({
  name: "plannerSizeTier",
  title: "Planner · Size Tier",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key (stable id)",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    localeString("label", "Label"),
    defineField({
      name: "priceModifier",
      title: "Price add (flat)",
      type: "number",
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: "pages",
      title: "Representative page count",
      description: "Used for the per-page content calculation.",
      type: "number",
      validation: Rule => Rule.required().min(1),
    }),
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
    select: { title: "label.en", price: "priceModifier", pages: "pages" },
    prepare: ({ title, price, pages }) => ({
      title,
      subtitle: `+$${price} · ~${pages} pages`,
    }),
  },
})
