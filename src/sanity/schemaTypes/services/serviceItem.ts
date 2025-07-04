import { defineField, defineType } from "sanity"

export default defineType({
  name: "serviceItem",
  title: "Service Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "string",
          validation: Rule => Rule.required(),
        },
        {
          name: "es",
          title: "Spanish",
          type: "string",
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: Rule => Rule.required(),
      options: {
        source: "title.en",
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "text",
          rows: 2,
          validation: Rule => Rule.required(),
        },
        {
          name: "es",
          title: "Spanish",
          type: "text",
          rows: 2,
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "iconName",
      title: "Icon Name",
      type: "string",
      description: "Name of the icon from the icon library of lucide-react",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }],
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: "priceRange",
      title: "Price Range",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "en",
              title: "English",
              type: "string",
              validation: Rule => Rule.required(),
            },
            {
              name: "es",
              title: "Spanish",
              type: "string",
              validation: Rule => Rule.required(),
            },
          ],
        },
      ],
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: "pageContent",
      title: "Page Content",
      type: "object",
      fields: [
        {
          name: "mainDescription",
          title: "Main Description",
          type: "object",
          fields: [
            {
              name: "en",
              title: "English Description",
              type: "array",
              of: [{ type: "block" }, { type: "image" }],
              validation: Rule => Rule.required(),
            },
            {
              name: "es",
              title: "Spanish Description",
              type: "array",
              of: [{ type: "block" }, { type: "image" }],
              validation: Rule => Rule.required(),
            },
          ],
        },
        {
          name: "beforeState",
          title: "Before State",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                },
                {
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                },
              ],
            },
          ],
          validation: Rule => Rule.required().min(1),
        },
        {
          name: "afterState",
          title: "After State",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                },
                {
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                },
              ],
            },
          ],
          validation: Rule => Rule.required().min(1),
        },
        {
          name: "benefits",
          title: "Benefits",
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "object",
              fields: [
                {
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                },
                {
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                },
              ],
            },
            {
              name: "description",
              title: "Description",
              type: "object",
              fields: [
                {
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                },
                {
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                },
              ],
            },
            {
              name: "benefits",
              title: "Benefits",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "title",
                      title: "Title",
                      type: "object",
                      fields: [
                        {
                          name: "en",
                          title: "English",
                          type: "string",
                          validation: Rule => Rule.required(),
                        },
                        {
                          name: "es",
                          title: "Spanish",
                          type: "string",
                          validation: Rule => Rule.required(),
                        },
                      ],
                    },
                    {
                      name: "description",
                      title: "Description",
                      type: "object",
                      fields: [
                        {
                          name: "en",
                          title: "English",
                          type: "string",
                          validation: Rule => Rule.required(),
                        },
                        {
                          name: "es",
                          title: "Spanish",
                          type: "string",
                          validation: Rule => Rule.required(),
                        },
                      ],
                    },
                  ],
                },
              ],
              validation: Rule => Rule.required().min(1),
            },
          ],
        },
        {
          name: "features",
          title: "Features",
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "object",
              fields: [
                {
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                },
                {
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                },
              ],
            },
            {
              name: "description",
              title: "Description",
              type: "object",
              fields: [
                {
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                },
                {
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                },
              ],
            },
            {
              name: "standardFeatures",
              title: "Standard Features",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "name",
                      title: "Name",
                      type: "object",
                      fields: [
                        {
                          name: "en",
                          title: "English",
                          type: "string",
                          validation: Rule => Rule.required(),
                        },
                        {
                          name: "es",
                          title: "Spanish",
                          type: "string",
                          validation: Rule => Rule.required(),
                        },
                      ],
                    },
                    {
                      name: "description",
                      title: "Description",
                      type: "object",
                      fields: [
                        {
                          name: "en",
                          title: "English",
                          type: "string",
                          validation: Rule => Rule.required(),
                        },
                        {
                          name: "es",
                          title: "Spanish",
                          type: "string",
                          validation: Rule => Rule.required(),
                        },
                      ],
                    },
                  ],
                },
              ],
              validation: Rule => Rule.required().min(1),
            },
            {
              name: "optionalFeatures",
              title: "Optional Features",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "name",
                      title: "Name",
                      type: "object",
                      fields: [
                        {
                          name: "en",
                          title: "English",
                          type: "string",
                          validation: Rule => Rule.required(),
                        },
                        {
                          name: "es",
                          title: "Spanish",
                          type: "string",
                          validation: Rule => Rule.required(),
                        },
                      ],
                    },
                    {
                      name: "description",
                      title: "Description",
                      type: "object",
                      fields: [
                        {
                          name: "en",
                          title: "English",
                          type: "string",
                          validation: Rule => Rule.required(),
                        },
                        {
                          name: "es",
                          title: "Spanish",
                          type: "string",
                          validation: Rule => Rule.required(),
                        },
                      ],
                    },
                    {
                      name: "price",
                      title: "Price",
                      type: "number",
                      validation: Rule => Rule.required(),
                    },
                  ],
                },
              ],
              validation: Rule => Rule.required().min(1),
            },
          ],
        },
        {
          name: "steps",
          title: "Steps",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "title",
                  title: "Title",
                  type: "object",
                  validation: Rule => Rule.required(),
                  fields: [
                    {
                      name: "en",
                      title: "English",
                      type: "string",
                      validation: Rule => Rule.required(),
                    },
                    {
                      name: "es",
                      title: "Spanish",
                      type: "string",
                      validation: Rule => Rule.required(),
                    },
                  ],
                },
                {
                  name: "description",
                  title: "Description",
                  type: "object",
                  fields: [
                    {
                      name: "en",
                      title: "English",
                      type: "string",
                      validation: Rule => Rule.required(),
                    },
                    {
                      name: "es",
                      title: "Spanish",
                      type: "string",
                      validation: Rule => Rule.required(),
                    },
                  ],
                },
                {
                  name: "duration",
                  title: "Duration",
                  type: "object",
                  fields: [
                    {
                      name: "en",
                      title: "English",
                      type: "string",
                      validation: Rule => Rule.required(),
                    },
                    {
                      name: "es",
                      title: "Spanish",
                      type: "string",
                      validation: Rule => Rule.required(),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "faqs",
          title: "FAQs",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "question",
                  title: "Question",
                  type: "object",
                  fields: [
                    {
                      name: "en",
                      title: "English",
                      type: "string",
                      validation: Rule => Rule.required(),
                    },
                    {
                      name: "es",
                      title: "Spanish",
                      type: "string",
                      validation: Rule => Rule.required(),
                    },
                  ],
                },
                {
                  name: "answer",
                  title: "Answer",
                  type: "object",
                  fields: [
                    {
                      name: "en",
                      title: "English",
                      type: "string",
                      validation: Rule => Rule.required(),
                    },
                    {
                      name: "es",
                      title: "Spanish",
                      type: "string",
                      validation: Rule => Rule.required(),
                    },
                  ],
                },
              ],
            },
          ],
          validation: Rule => Rule.required().min(1),
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "document",
      fields: [
        defineField({
          name: "meta",
          title: "Meta Information",
          type: "object",
          fields: [
            defineField({
              name: "en",
              title: "English",
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Meta Title",
                  type: "string",
                  description:
                    "Title for browser tab and search results (50-60 characters recommended)",
                  validation: Rule =>
                    Rule.max(60).warning(
                      "Meta titles longer than 60 characters may be truncated in search results",
                    ),
                }),
                defineField({
                  name: "description",
                  title: "Meta Description",
                  type: "text",
                  rows: 3,
                  description:
                    "Description for search results (150-160 characters recommended)",
                  validation: Rule =>
                    Rule.max(160).warning(
                      "Meta descriptions longer than 160 characters may be truncated in search results",
                    ),
                }),
                defineField({
                  name: "keywords",
                  title: "Keywords",
                  type: "array",
                  of: [{ type: "string" }],
                  description: "Keywords relevant to this content (optional)",
                }),
              ],
            }),
            defineField({
              name: "es",
              title: "Spanish",
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Meta Title",
                  type: "string",
                  description:
                    "Título para la pestaña del navegador y resultados de búsqueda (50-60 caracteres recomendados)",
                  validation: Rule =>
                    Rule.max(60).warning(
                      "Los títulos meta más largos de 60 caracteres pueden aparecer truncados",
                    ),
                }),
                defineField({
                  name: "description",
                  title: "Meta Description",
                  type: "text",
                  rows: 3,
                  description:
                    "Descripción para resultados de búsqueda (150-160 caracteres recomendados)",
                  validation: Rule =>
                    Rule.max(160).warning(
                      "Las descripciones meta más largas de 160 caracteres pueden aparecer truncadas",
                    ),
                }),
                defineField({
                  name: "keywords",
                  title: "Keywords",
                  type: "array",
                  of: [{ type: "string" }],
                  description:
                    "Palabras clave relevantes para este contenido (opcional)",
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "openGraph",
          title: "Open Graph",
          type: "object",
          fields: [
            defineField({
              name: "en",
              title: "English",
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "OG Title",
                  type: "string",
                  description:
                    "Title for social media sharing (optional, will use Meta Title if not provided)",
                }),
                defineField({
                  name: "description",
                  title: "OG Description",
                  type: "text",
                  rows: 3,
                  description:
                    "Description for social media sharing (optional, will use Meta Description if not provided)",
                }),
              ],
            }),
            defineField({
              name: "es",
              title: "Spanish",
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "OG Title",
                  type: "string",
                  description:
                    "Título para compartir en redes sociales (opcional, usará el Meta Title si no se proporciona)",
                }),
                defineField({
                  name: "description",
                  title: "OG Description",
                  type: "text",
                  rows: 3,
                  description:
                    "Descripción para compartir en redes sociales (opcional, usará la Meta Description si no se proporciona)",
                }),
              ],
            }),
            defineField({
              name: "image",
              title: "OG Image",
              type: "image",
              description:
                "Image for social media sharing (recommended size: 1200x630 pixels)",
              options: {
                hotspot: true,
              },
            }),
          ],
        }),
        defineField({
          name: "structuredData",
          title: "Structured Data",
          type: "object",
          description: "JSON-LD structured data for enhanced search results",
          fields: [
            defineField({
              name: "en",
              title: "English Schema",
              type: "text",
              description:
                "Paste your schema.org JSON-LD data for English content here",
              validation: Rule =>
                Rule.custom(text => {
                  if (!text) return true
                  try {
                    JSON.parse(text)
                    return true
                  } catch (err) {
                    return "Must be valid JSON"
                  }
                }),
            }),
            defineField({
              name: "es",
              title: "Spanish Schema",
              type: "text",
              description:
                "Paste your schema.org JSON-LD data for Spanish content here",
              validation: Rule =>
                Rule.custom(text => {
                  if (!text) return true
                  try {
                    JSON.parse(text)
                    return true
                  } catch (err) {
                    return "Must be valid JSON"
                  }
                }),
            }),
          ],
        }),
        defineField({
          name: "canonicalUrl",
          title: "Canonical URL",
          type: "string",
          description:
            "The preferred version of this page for search engines (optional)",
        }),
        defineField({
          name: "noIndex",
          title: "No Index",
          type: "boolean",
          description: "Hide this page from search engines",
          initialValue: false,
        }),
        defineField({
          name: "noFollow",
          title: "No Follow",
          type: "boolean",
          description: "Tell search engines not to follow links on this page",
          initialValue: false,
        }),
      ]
    })
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "categories",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle?.map((cat: any) => cat.name?.en).join(", "),
      }
    },
  },
})
