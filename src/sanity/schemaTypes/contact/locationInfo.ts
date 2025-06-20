import { defineField, defineType } from "sanity"

export default defineType({
  name: "locationInfo",
  title: "Location Info",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "en", type: "string", title: "English" },
        { name: "es", type: "string", title: "Spanish" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "object",
      fields: [
        { name: "en", type: "string", title: "English" },
        { name: "es", type: "string", title: "Spanish" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        { name: "en", type: "text", title: "English" },
        { name: "es", type: "text", title: "Spanish" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "localAdvantage",
      title: "Local Advantage",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "object",
          fields: [
            { name: "en", type: "string", title: "English" },
            { name: "es", type: "string", title: "Spanish" },
          ],
        },
        {
          name: "description",
          title: "Description",
          type: "object",
          fields: [
            { name: "en", type: "text", title: "English" },
            { name: "es", type: "text", title: "Spanish" },
          ],
        },
      ],
    }),
    defineField({
      name: "emergencySupport",
      title: "Emergency Support",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "object",
          fields: [
            { name: "en", type: "string", title: "English" },
            { name: "es", type: "string", title: "Spanish" },
          ],
        },
        {
          name: "description",
          title: "Description",
          type: "object",
          fields: [
            { name: "en", type: "text", title: "English" },
            { name: "es", type: "text", title: "Spanish" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      location: "location.en",
    },
    prepare({ title, location }) {
      return {
        title: title || "Location Info",
        subtitle: location,
      }
    },
  },
}) 