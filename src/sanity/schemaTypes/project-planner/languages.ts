import { defineField, defineType } from "sanity"

export default defineType({
  name: "languages",
  title: "Languages Step",
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
      name: "languageOptions",
      title: "Language Options",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "object",
              fields: [
                { name: "en", title: "English", type: "string" },
                { name: "es", title: "Spanish", type: "string" },
              ],
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
          ],
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: "selectedLanguagesText",
      title: "Selected Languages Text",
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
  preview: {
    select: {
      title: "title.en",
    },
  },
})
