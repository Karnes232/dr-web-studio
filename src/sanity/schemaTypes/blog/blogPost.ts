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
      name: 'description',
      title: 'Short Description',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.required().max(200)
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'text',
          rows: 3,
          validation: Rule => Rule.required().max(200)
        }
      ]
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time',
      type: 'number',
      validation: Rule => Rule.required()
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
          validation: Rule => Rule.required().min(1).unique()
        },
        {
          name: 'es',
          title: 'Spanish Tags',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            layout: 'tags'
          },
          validation: Rule => Rule.required().min(1).unique()
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
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'blogCategory'}}],
      validation: Rule => Rule.required().min(1).unique()
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: Rule => Rule.required()
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
              validation: Rule => Rule.required()
            },
            {
              name: 'es',
              title: 'Spanish Alt Text',
              type: 'string',
              validation: Rule => Rule.required()
            }
          ]
        }
      ],
      validation: Rule => Rule.required()
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
          validation: Rule => Rule.required()
        },
        {
          name: 'es',
          title: 'Spanish Content',
          type: 'array',
          of: [
            { type: 'block' },
            { type: 'image' }
          ],
          validation: Rule => Rule.required()
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title.en',
      author: 'author.name',
      media: 'mainImage'
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    }
  }
})
