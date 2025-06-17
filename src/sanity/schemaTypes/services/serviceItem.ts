import { defineField, defineType } from "sanity"

export default defineType({
  name: "serviceItem",
  title: "Service Item",
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
      name: "description",
      title: "Description",
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
      name: "iconName",
      title: "Icon Name",
      type: "string",
      description: "Name of the icon from the icon library of lucide-react",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }],
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: "priceRange",
      title: "Price Range",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [
        {
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
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "categories",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle?.map((cat: any) => cat.name?.en).join(", "),
      }
    },
  },
})
