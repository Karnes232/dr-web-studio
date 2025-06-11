import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Image',
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
      name: 'bio',
      title: 'Bio',
      type: 'object',
      fields: [
        {
          name: 'en',
          title: 'English Bio',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{title: 'Normal', value: 'normal'}],
              lists: [],
            }
          ],
          validation: Rule => Rule.required()
        },
        {
          name: 'es',
          title: 'Spanish Bio',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{title: 'Normal', value: 'normal'}],
              lists: [],
            }
          ],
          validation: Rule => Rule.required()
        }
      ]
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
        },
        {
          name: 'github',
          title: 'GitHub URL',
          type: 'url',
        },
        {
          name: 'website',
          title: 'Personal Website',
          type: 'url',
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image'
    }
  }
}) 