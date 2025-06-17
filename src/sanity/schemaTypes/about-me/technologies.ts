import { defineField, defineType } from "sanity"

export default defineType({
  name: "technologies",
  title: "Technologies",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
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
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Name",
              type: "string",
              validation: Rule => Rule.required(),
            },
            {
              name: "color",
              title: "Color",
              type: "string",
            },
          ],
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "technologies",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: `${subtitle?.length || 0} technologies`,
      }
    },
  },
})
