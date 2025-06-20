import { defineField, defineType } from "sanity"

export default defineType({
  name: "project",
  title: "Project",
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
      name: "client",
      title: "Client",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
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
      name: "image",
      title: "Project Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "string" }],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: "problem",
      title: "Problem",
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
      name: "solution",
      title: "Solution",
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
      name: "outcomes",
      title: "Outcomes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "metric",
              title: "Metric",
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
              name: "value",
              title: "Value",
              type: "string",
              validation: Rule => Rule.required(),
            },
            {
              name: "improvement",
              title: "Improvement",
              type: "string",
              validation: Rule => Rule.required(),
            },
          ],
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Featured Project",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "client",
      media: "image",
    },
  },
})
