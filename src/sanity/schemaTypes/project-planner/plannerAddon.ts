import { defineType, defineField } from "sanity"
import { localeString, localeText } from "./_localized"

export default defineType({
  name: "plannerAddon",
  title: "Planner · Add-on",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key (stable id)",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "service",
      title: "Service (key)",
      description: "The plannerService.key this add-on belongs to.",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    localeString("title", "Title"),
    localeText("description", "Description", { required: false }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: Rule => Rule.required().min(0),
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
      title: "Service, then order",
      name: "serviceOrder",
      by: [
        { field: "service", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "title.en", service: "service", price: "price" },
    prepare: ({ title, service, price }) => ({
      title,
      subtitle: `${service} · $${price}`,
    }),
  },
})
