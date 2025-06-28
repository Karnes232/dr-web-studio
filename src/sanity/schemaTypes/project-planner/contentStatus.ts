import { defineField, defineType } from "sanity"

export default defineType({
  name: "contentStatus",
  title: "Content Status Step",
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
      name: "description",
      title: "Description",
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
      name: "contentOptions",
      title: "Content Options",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
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
              name: "description",
              title: "Description",
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
          ],
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title.en",
    },
  },
})
