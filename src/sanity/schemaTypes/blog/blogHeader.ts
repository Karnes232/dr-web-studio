import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogHeader',
  title: 'Blog Header',
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
          validation: Rule => Rule.required()
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ]
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'subtitle.en'
    }
  }
}) 