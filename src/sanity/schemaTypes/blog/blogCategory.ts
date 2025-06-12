import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogCategory',
  title: 'Blog Category',
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
          validation: rule => rule.required()
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'string',
          validation: rule => rule.required()
        }
      ]
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: rule => rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English Description',
          type: 'text',
          validation: rule => rule.required()
        },
        {
          name: 'es',
          title: 'Spanish Description',
          type: 'text',
          validation: rule => rule.required()
        }
      ]
    }),
    // defineField({
    //   name: 'color',
    //   title: 'Color',
    //   type: 'string',
    //   description: 'Color for the category tag (hex code)',
    //   validation: Rule => Rule.required().regex(
    //     /^#[0-9A-Fa-f]{6}$/,
    //     'Must be a valid hex color code (e.g. #FF0000)'
    //   )
    // })
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'description.en'
    }
  }
}) 