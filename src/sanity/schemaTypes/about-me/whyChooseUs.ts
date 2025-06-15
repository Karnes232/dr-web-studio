import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'whyChooseUs',
  title: 'Why Choose Us',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'reasons',
      title: 'Reasons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'object',
              fields: [
                {
                  name: 'en',
                  title: 'English',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'es',
                  title: 'Spanish',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
              ],
            },
            {
              name: 'description',
              title: 'Description',
              type: 'object',
              fields: [
                {
                  name: 'en',
                  title: 'English',
                  type: 'text',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'es',
                  title: 'Spanish',
                  type: 'text',
                  validation: (Rule) => Rule.required(),
                },
              ],
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'reasons',
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: `${subtitle?.length || 0} reasons`,
      }
    },
  },
}) 