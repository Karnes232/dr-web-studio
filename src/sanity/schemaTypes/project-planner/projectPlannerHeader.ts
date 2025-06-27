import { defineType, defineField } from "sanity"

export default defineType({
  name: "projectPlannerHeader",
  title: "Project Planner Header",
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
  ],
})
