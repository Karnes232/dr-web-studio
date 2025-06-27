import { defineType, defineField } from "sanity"

export default defineType({
  name: "features",
  title: "Features",
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
      name: "selectedFeaturesText",
      title: "Selected Features Text",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "string" },
        { name: "es", title: "Spanish", type: "string" },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "features",
      title: "Features",
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
