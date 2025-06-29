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
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: Rule => Rule.required(),
      options: {
        source: "title.en",
      },
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
          rows: 2,
          validation: Rule => Rule.required(),
        },
        {
          name: "es",
          title: "Spanish",
          type: "text",
          rows: 2,
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
    defineField({
      name: "pageContent",
      title: "Page Content",
      type: "object",
      fields: [
        defineField({
          name: "mainDescription",
          title: "Main Description",
          type: "object",
          fields: [
            {
              name: "en",
              title: "English Description",
              type: "array",
              of: [{ type: "block" }, { type: "image" }],
              validation: Rule => Rule.required(),
            },
            {
              name: "es",
              title: "Spanish Description",
              type: "array",
              of: [{ type: "block" }, { type: "image" }],
              validation: Rule => Rule.required(),
            },
          ],
        }),
        defineField({
          name: "beforeState",
          title: "Before State",
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
        defineField({
          name: "afterState",
          title: "After State",
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
        defineField({
          name: "benefits",
          title: "Benefits",
          type: "object",
          fields: [
            {
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
            },
            {
              name: "description",
              title: "Description",
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
              name: "benefits",
              title: "Benefits",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
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
                    },
                    {
                      name: "description",
                      title: "Description",
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
                },
              ],
              validation: Rule => Rule.required().min(1),
            },
          ],
        }),
        defineField({
          name: "features",
          title: "Features",
          type: "object",
          fields: [
            {
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
            },
            {
              name: "description",
              title: "Description",
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
              name: "standardFeatures",
              title: "Standard Features",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "name",
                      title: "Name",
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
                      name: "description",
                      title: "Description",
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
                },
              ],
              validation: Rule => Rule.required().min(1),
            },
            {
              name: "optionalFeatures",
              title: "Optional Features",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "name",
                      title: "Name",
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
                      name: "description",
                      title: "Description",
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
                      name: "price",
                      title: "Price",
                      type: "number",
                      validation: Rule => Rule.required(),
                    },
                  ],
                },
              ],
              validation: Rule => Rule.required().min(1),
            },
          ],
        }),
      ],
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
