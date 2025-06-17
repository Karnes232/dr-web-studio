import { defineField, defineType } from "sanity"

export default defineType({
  name: "personalStory",
  title: "Personal Story",
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
      name: "story1",
      title: "Story Part 1",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "text",
          validation: Rule => Rule.required(),
        },
        {
          name: "es",
          title: "Spanish",
          type: "text",
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "story2",
      title: "Story Part 2",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "text",
          validation: Rule => Rule.required(),
        },
        {
          name: "es",
          title: "Spanish",
          type: "text",
          validation: Rule => Rule.required(),
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "description.en",
    },
  },
})
