import { defineField, defineType } from "sanity"

export default defineType({
  name: "locationAvailability",
  title: "Location & Availability",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "string",
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "string",
          validation: Rule => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "availabilityItems",
      title: "Availability Items",
      type: "array",
      of: [
        {
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
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "availabilityItems",
    },
    prepare({ title }) {
      return {
        title,
      }
    },
  },
})
