import { defineField, defineType } from "sanity"
import type { StringRule } from "sanity"

interface PreviewProps {
  titleEn?: string
  titleEs?: string
  descriptionEn?: string
  descriptionEs?: string
  color?: string
  icon?: any
}

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "string",
          description: "Service title in English",
          validation: (rule: StringRule) =>
            rule.required().error("English title is required"),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "string",
          description: "Service title in Spanish",
          validation: (rule: StringRule) =>
            rule.required().error("Spanish title is required"),
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "text",
          description: "Service description in English",
          rows: 3,
          validation: (rule: StringRule) =>
            rule.required().error("English description is required"),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "text",
          description: "Service description in Spanish",
          rows: 3,
          validation: (rule: StringRule) =>
            rule.required().error("Spanish description is required"),
        }),
      ],
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description: "Color for the service (hex code or CSS color name)",
      validation: (rule: StringRule) =>
        rule.required().error("Color is required"),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      description: "Service icon",
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
    }),
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleEs: "title.es",
      descriptionEn: "description.en",
      descriptionEs: "description.es",
      color: "color",
      icon: "icon",
    },
    prepare(selection: PreviewProps) {
      const { titleEn, titleEs, descriptionEn, descriptionEs, color, icon } =
        selection
      return {
        title: titleEn || titleEs || "Untitled Service",
        subtitle: `EN: "${titleEn || "None"}" | ES: "${titleEs || "None"}"`,
        media: icon,
      }
    },
  },
})
