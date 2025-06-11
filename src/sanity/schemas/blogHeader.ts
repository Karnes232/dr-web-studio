export default {
  name: 'blogHeader',
  title: 'Blog Header',
  type: 'document',
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
          validation: Rule => Rule.required()
        },
        {
          name: 'es',
          title: 'Spanish',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ]
    },
    {
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
    }
  ]
} 