import { defineType, defineField } from "sanity"

export default defineType({
  name: "pagesCount",
  title: "Pages Count",
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
      name: "rangeConfig",
      title: "Range Slider Configuration",
      type: "object",
      fields: [
        {
          name: "min",
          title: "Minimum Value",
          type: "number",
          validation: Rule => Rule.required(),
        },
        {
          name: "max",
          title: "Maximum Value",
          type: "number",
          validation: Rule => Rule.required(),
        },
        {
          name: "step",
          title: "Step Value",
          type: "number",
          validation: Rule => Rule.required(),
        },
        {
          name: "default",
          title: "Default Value",
          type: "number",
          validation: Rule => Rule.required(),
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "tip",
      title: "Tip Text",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "text" },
        { name: "es", title: "Spanish", type: "text" },
      ],
      validation: Rule => Rule.required(),
    }),
  ],
})
