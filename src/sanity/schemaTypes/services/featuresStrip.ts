import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'featuresStrip',
  title: 'Features Strip',
  type: 'document',
  fields: [
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'iconName',
              title: 'Icon Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
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
            {
              name: 'gradient',
              title: 'Gradient',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      features: 'features',
    },
    prepare({ features }) {
      return {
        title: 'Features Strip',
        subtitle: `${features?.length || 0} features`,
      }
    },
  },
}) 