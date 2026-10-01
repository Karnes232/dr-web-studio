import { defineArrayMember, defineField, defineType } from "sanity"

// Body members shared by both languages. dataTable and barChart give data posts real
// HTML tables and accessible charts instead of screenshots (better for readers and for citation).
const bodyMembers = [
  defineArrayMember({ type: "block" }),
  defineArrayMember({
    type: "image",
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        // warning, not error: older posts' body images predate this field
        validation: Rule => Rule.required().warning("Add alt text describing the image"),
      }),
      defineField({ name: "caption", title: "Caption", type: "string" }),
    ],
  }),
  defineArrayMember({
    name: "dataTable",
    title: "Data table",
    type: "object",
    fields: [
      defineField({
        name: "caption",
        title: "Caption",
        type: "string",
        validation: Rule => Rule.required(),
      }),
      defineField({
        name: "headers",
        title: "Column headers",
        type: "array",
        of: [{ type: "string" }],
        validation: Rule => Rule.required().min(1),
      }),
      defineField({
        name: "numericColumns",
        title: "Numeric columns",
        description: "Zero-based indexes of columns to right-align (e.g. 1, 2)",
        type: "array",
        of: [{ type: "number" }],
      }),
      defineField({
        name: "rows",
        title: "Rows",
        type: "array",
        of: [
          defineArrayMember({
            name: "row",
            type: "object",
            fields: [
              defineField({
                name: "cells",
                title: "Cells",
                type: "array",
                of: [{ type: "string" }],
              }),
            ],
            preview: {
              select: { cells: "cells" },
              prepare: ({ cells }) => ({ title: (cells || []).join(" · ") }),
            },
          }),
        ],
        validation: Rule => Rule.required().min(1),
      }),
      defineField({ name: "note", title: "Note / source", type: "text", rows: 2 }),
    ],
    preview: {
      select: { title: "caption" },
      prepare: ({ title }) => ({ title: title || "Data table", subtitle: "Table" }),
    },
  }),
  defineArrayMember({
    name: "barChart",
    title: "Bar chart",
    type: "object",
    fields: [
      defineField({
        name: "title",
        title: "Title",
        type: "string",
        validation: Rule => Rule.required(),
      }),
      defineField({
        name: "unit",
        title: "Unit",
        description: 'Shown after each value, e.g. "%" or " sites"',
        type: "string",
      }),
      defineField({
        name: "max",
        title: "Scale maximum",
        description: "Leave empty to use the largest value",
        type: "number",
      }),
      defineField({
        name: "bars",
        title: "Bars",
        type: "array",
        of: [
          defineArrayMember({
            name: "bar",
            type: "object",
            fields: [
              defineField({
                name: "label",
                title: "Label",
                type: "string",
                validation: Rule => Rule.required(),
              }),
              defineField({
                name: "value",
                title: "Value",
                type: "number",
                validation: Rule => Rule.required(),
              }),
              defineField({ name: "n", title: "Sample size (n)", type: "number" }),
              defineField({
                name: "highlight",
                title: "Highlight",
                type: "boolean",
                initialValue: false,
              }),
            ],
            preview: {
              select: { title: "label", value: "value" },
              prepare: ({ title, value }) => ({ title, subtitle: String(value) }),
            },
          }),
        ],
        validation: Rule => Rule.required().min(1),
      }),
      defineField({ name: "note", title: "Note / source", type: "text", rows: 2 }),
    ],
    preview: {
      select: { title: "title" },
      prepare: ({ title }) => ({ title: title || "Bar chart", subtitle: "Chart" }),
    },
  }),
]

export default defineType({
  name: "blogPost",
  title: "Blog Post",
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
      name: "description",
      title: "Short Description",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "text",
          rows: 3,
          validation: Rule => Rule.required().max(200),
        },
        {
          name: "es",
          title: "Spanish",
          type: "text",
          rows: 3,
          validation: Rule => Rule.required().max(200),
        },
      ],
    }),
    defineField({
      name: "readTime",
      title: "Read Time",
      type: "number",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured Post",
      type: "boolean",
      description: "Set to true to mark this post as featured",
      initialValue: false,
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English Tags",
          type: "array",
          of: [{ type: "string" }],
          options: {
            layout: "tags",
          },
          validation: Rule => Rule.required().min(1).unique(),
        },
        {
          name: "es",
          title: "Spanish Tags",
          type: "array",
          of: [{ type: "string" }],
          options: {
            layout: "tags",
          },
          validation: Rule => Rule.required().min(1).unique(),
        },
      ],
    }),
    defineField({
      name: "slug",
      title: "Slug (English)",
      type: "slug",
      options: {
        source: "title.en",
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "slugEs",
      title: "Slug (Spanish)",
      type: "slug",
      description:
        "Spanish URL slug. Falls back to the English slug until set.",
      options: {
        source: "title.es",
        maxLength: 96,
      },
    }),
    defineField({
      name: "previousSlugs",
      title: "Previous slugs (retired URLs)",
      type: "array",
      of: [{ type: "string" }],
      description:
        "When you change this post's English or Spanish slug, paste the OLD slug value here so its old URL 301-redirects to the new one. One entry per retired slug.",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "blogCategory" } }],
      validation: Rule => Rule.required().min(1).unique(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "object",
          fields: [
            {
              name: "en",
              title: "English Alt Text",
              type: "string",
              validation: Rule => Rule.required(),
            },
            {
              name: "es",
              title: "Spanish Alt Text",
              type: "string",
              validation: Rule => Rule.required(),
            },
          ],
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English Content",
          type: "array",
          of: bodyMembers,
          validation: Rule => Rule.required(),
        },
        {
          name: "es",
          title: "Spanish Content",
          type: "array",
          of: bodyMembers,
          validation: Rule => Rule.required(),
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
      ],
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
