import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
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
      name: 'description',
      title: 'Short Description',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'text',
          rows: 3,
          validation: rule => rule.required().max(200)
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'text',
          rows: 3,
          validation: rule => rule.required().max(200)
        }
      ]
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time',
      type: 'number',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Set to true to mark this post as featured',
      initialValue: false
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English Tags',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            layout: 'tags'
          },
          validation: rule => rule.required().min(1).unique()
        },
        {
          name: 'es',
          title: 'Spanish Tags',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            layout: 'tags'
          },
          validation: rule => rule.required().min(1).unique()
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
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
      validation: rule => rule.required()
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'blogCategory'}}],
      validation: rule => rule.required().min(1).unique()
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: rule => rule.required()
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'object',
          fields: [
            {
              name: 'en',
              title: 'English Alt Text',
              type: 'string',
              validation: rule => rule.required()
            },
            {
              name: 'es',
              title: 'Spanish Alt Text',
              type: 'string',
              validation: rule => rule.required()
            }
          ]
        }
      ],
      validation: rule => rule.required()
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English Content',
          type: 'array',
          of: [
            { type: 'block' },
            { type: 'image' }
          ],
          validation: rule => rule.required()
        },
        {
          name: 'es',
          title: 'Spanish Content',
          type: 'array',
          of: [
            { type: 'block' },
            { type: 'image' }
          ],
          validation: rule => rule.required()
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'description.en',
      media: 'mainImage'
    }
  }
})
