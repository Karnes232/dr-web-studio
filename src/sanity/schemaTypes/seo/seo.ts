import { defineField, defineType } from "sanity"

export default defineType({
  name: "seo",
  title: "SEO",
  type: "document",
  groups: [
    {
      name: "basic",
      title: "Basic SEO",
    },
    {
      name: "social",
      title: "Social Media",
    },
    {
      name: "structured",
      title: "Structured Data",
    },
  ],
  fields: [
    defineField({
      name: "pageName",
      title: "Page Name",
      type: "string",
      group: "basic",
      description: "Select the page this SEO configuration is for",
      options: {
        list: [
          { title: "Home", value: "home" },
          { title: "About", value: "about" },
          { title: "Portfolio", value: "portfolio" },
          { title: "Pricing", value: "pricing" },
          { title: "Contact", value: "contact" },
          { title: "Blog", value: "blog" },
          { title: "Services", value: "services" },
          { title: "Project Planner", value: "project-planner" },
        ],
        layout: "dropdown",
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "meta",
      title: "Meta Information",
      type: "object",
      group: "basic",
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
      group: "social",
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
      group: "structured",
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
      type: "url",
      group: "basic",
      description:
        "The preferred version of this page for search engines (optional)",
    }),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      group: "basic",
      description: "Hide this page from search engines",
      initialValue: false,
    }),
    defineField({
      name: "noFollow",
      title: "No Follow",
      type: "boolean",
      group: "basic",
      description: "Tell search engines not to follow links on this page",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "pageName",
      metaTitleEn: "meta.en.title",
      metaTitleEs: "meta.es.title",
    },
    prepare({ title, metaTitleEn, metaTitleEs }) {
      return {
        title: title || "Unnamed Page",
        subtitle: `EN: "${metaTitleEn || "No title"}" | ES: "${metaTitleEs || "No title"}"`,
      }
    },
  },
})
