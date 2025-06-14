import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'sectionHeader',
  title: 'Section Header',
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
    }),
    defineField({
      name: 'basedOutOf',
      title: 'Based Out Of',
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
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'description.en',
    },
  },
}) 