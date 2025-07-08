import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faqCategory',
  title: 'FAQ Category',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Category ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Unique identifier for the category (e.g., "general", "development")'
    }),
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'string',
          validation: (Rule) => Rule.required()
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'string',
          validation: (Rule) => Rule.required()
        }
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Icon name from Lucide React (e.g., "HelpCircle", "Code", "DollarSign")',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'color',
      title: 'Color Class',
      type: 'string',
      description: 'Tailwind CSS color class (e.g., "bg-blue-500", "bg-green-500")',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'id',
              title: 'Question ID',
              type: 'string',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'question',
              title: 'Question',
              type: 'object',
              fields: [
                {
                  name: 'en',
                  title: 'English',
                  type: 'string',
                  validation: (Rule) => Rule.required()
                },
                {
                  name: 'es',
                  title: 'Spanish',
                  type: 'string',
                  validation: (Rule) => Rule.required()
                }
              ],
              validation: (Rule) => Rule.required()
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'object',
              fields: [
                {
                  name: 'en',
                  title: 'English',
                  type: 'text',
                  rows: 4,
                  validation: (Rule) => Rule.required()
                },
                {
                  name: 'es',
                  title: 'Spanish',
                  type: 'text',
                  rows: 4,
                  validation: (Rule) => Rule.required()
                }
              ],
              validation: (Rule) => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'question.en',
              subtitle: 'id'
            }
          }
        }
      ],
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this category should appear (lower numbers appear first)',
      validation: (Rule) => Rule.required().integer().positive()
    })
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'id',
      media: 'icon'
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title || 'Untitled FAQ Category',
        subtitle: `ID: ${subtitle}`,
        media: media ? `📋` : undefined
      }
    }
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]
}) 