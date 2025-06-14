import { defineField, defineType } from "sanity"
import type { ImageRule, StringRule } from "sanity"

interface PreviewProps {
  companyName?: string
  logo?: any
}

export default defineType({
  name: "previousClients",
  title: "Previous Clients",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "string",
          description: "Section title in English",
          validation: (rule: StringRule) =>
            rule.required().error("English title is required"),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "string",
          description: "Section title in Spanish",
          validation: (rule: StringRule) =>
            rule.required().error("Spanish title is required"),
        }),
      ],
    }),
    defineField({
      name: "clients",
      title: "Clients",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "companyName",
              title: "Company Name",
              type: "string",
              validation: (rule: StringRule) =>
                rule.required().error("Company name is required"),
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "string",
              validation: (rule: StringRule) =>
                rule.required().error("Link is required"),
            }),
            defineField({
              name: "logo",
              title: "Company Logo",
              type: "image",
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                  description: "Important for accessibility and SEO",
                }),
              ],
              validation: (rule: ImageRule) =>
                rule.required().error("Company logo is required"),
            }),
          ],
          preview: {
            select: {
              companyName: "companyName",
              logo: "logo",
            },
            prepare(selection: PreviewProps) {
              const { companyName, logo } = selection
              return {
                title: companyName || "Unnamed Company",
                media: logo,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.min(1),
      description: "Add at least one previous client",
    }),
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleEs: "title.es",
    },
    prepare(selection: { titleEn?: string; titleEs?: string }) {
      const { titleEn, titleEs } = selection
      return {
        title: titleEn || titleEs || "Previous Clients Section",
        subtitle: `EN: "${titleEn || "None"}" | ES: "${titleEs || "None"}"`,
        media: () => "🏢",
      }
    },
  },
}) 