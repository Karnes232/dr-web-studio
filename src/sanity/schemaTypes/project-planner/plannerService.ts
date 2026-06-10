import { defineType, defineField } from "sanity"
import { localeString, localeText } from "./_localized"

export default defineType({
  name: "plannerService",
  title: "Planner · Service",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key (stable id, = service slug)",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    localeString("title", "Title"),
    localeText("description", "Description"),
    defineField({
      name: "icon",
      title: "Icon (lucide key)",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "basePrice",
      title: "Starting price",
      type: "number",
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: "pageBased",
      title: "Page-based",
      description:
        "If on, the planner shows the Size & Content step (page tiers + content) for this service.",
      type: "boolean",
      initialValue: false,
    }),
    localeString("timeline", "Timeline (e.g. 2–3 weeks)"),
    defineField({
      name: "included",
      title: "What's included",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "en", title: "English", type: "string" },
            { name: "es", title: "Spanish", type: "string" },
          ],
          preview: { select: { title: "en" } },
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: "slug",
      title: "Service page slug (optional)",
      type: "string",
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
    select: { title: "title.en", subtitle: "basePrice" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle != null ? `from $${subtitle}` : undefined,
    }),
  },
})
