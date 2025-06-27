import { defineType, defineField } from "sanity"

export default defineType({
  name: "websiteType",
  title: "Website Type",
  type: "document",
  preview: {
    select: {
      title: "title.en",
      subtitle: "description.en",
    },
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "string" },
        { name: "es", title: "Spanish", type: "string" },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "string" },
        { name: "es", title: "Spanish", type: "string" },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "websiteTypes",
      title: "Website Types",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "value",
              title: "Value",
              type: "string",
              validation: Rule => Rule.required(),
            },
            {
              name: "label",
              title: "Label",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "es", title: "Spanish", type: "string" },
              ],
              validation: Rule => Rule.required(),
            },
            {
              name: "description",
              title: "Description",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "es", title: "Spanish", type: "string" },
              ],
              validation: Rule => Rule.required(),
            },
          ],
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
  ],
})
