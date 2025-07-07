import { defineField, defineType } from "sanity"

export default defineType({
  name: "legal",
  title: "Legal",
  type: "document",
  fields: [
    defineField({
      name: "pageName",
      title: "Page Name",
      type: "string",
      description: "Select the page this legal configuration is for",
      options: {
        list: [
          { title: "Privacy Policy", value: "privacy-policy" },
          { title: "Terms of Service", value: "terms-of-service" },
        ],
        layout: "dropdown",
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "array",
          of: [{ type: "block" }],
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "array",
          of: [{ type: "block" }],
        }),
      ],
    }),
  ],
})
