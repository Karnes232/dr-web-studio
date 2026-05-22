import { defineField, defineType } from "sanity"

export default defineType({
  name: "webhookEvent",
  title: "Webhook Event",
  type: "document",
  fields: [
    defineField({
      name: "eventId",
      title: "Event ID",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Event Type",
      type: "string",
    }),
    defineField({
      name: "receivedAt",
      title: "Received At",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "eventId", subtitle: "type" },
  },
})
