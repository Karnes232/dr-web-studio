import { defineField, defineType } from "sanity"

export default defineType({
  name: "pricingData",
  title: "Pricing Data",
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
      name: "price",
      title: "Price",
      type: "string",
      validation: Rule => Rule.required(),
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
              name: "text",
              title: "Text",
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
            {
              name: "included",
              title: "Included",
              type: "boolean",
              initialValue: true,
            },
          ],
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: "ctaText",
      title: "CTA Text",
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
      name: "ctaHref",
      title: "CTA Href",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Popular", value: "popular" },
          { title: "Premium", value: "premium" },
        ],
      },
      initialValue: "default",
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "object",
      fields: [
        {
          name: "text",
          title: "Text",
          type: "object",
          fields: [
            {
              name: "en",
              title: "English",
              type: "string",
            },
            {
              name: "es",
              title: "Spanish",
              type: "string",
            },
          ],
        },
        {
          name: "variant",
          title: "Variant",
          type: "string",
          options: {
            list: [
              { title: "Default", value: "default" },
              { title: "Popular", value: "popular" },
              { title: "Premium", value: "premium" },
            ],
          },
          initialValue: "default",
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "price",
      variant: "variant",
    },
    prepare({ title, subtitle, variant }) {
      return {
        title,
        subtitle: `${subtitle} - ${variant}`,
      }
    },
  },
}) 