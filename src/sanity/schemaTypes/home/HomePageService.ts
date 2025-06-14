import { defineField, defineType } from "sanity"
import type { StringRule, UrlRule } from "sanity"

interface PreviewProps {
  title?: string
  subtitleEn?: string
  subtitleEs?: string
  ctaTextEn?: string
  ctaTextEs?: string
}

export default defineType({
  name: "serviceSection",
  title: "Service Section",
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
          description: "Title text in English",
          validation: (rule: StringRule) =>
            rule.required().error("English title is required"),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "string",
          description: "Title text in Spanish",
          validation: (rule: StringRule) =>
            rule.required().error("Spanish title is required"),
        }),
      ],
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "text",
          description: "Subtitle text in English",
          rows: 3,
          validation: (rule: StringRule) =>
            rule.required().error("English subtitle is required"),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "text",
          description: "Subtitle text in Spanish",
          rows: 3,
          validation: (rule: StringRule) =>
            rule.required().error("Spanish subtitle is required"),
        }),
      ],
    }),
    defineField({
      name: "ctaButton",
      title: "Call to Action Button",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Button Text",
          type: "object",
          fields: [
            defineField({
              name: "en",
              title: "English",
              type: "string",
              validation: (rule: StringRule) =>
                rule.required().error("English button text is required"),
            }),
            defineField({
              name: "es",
              title: "Spanish",
              type: "string",
              validation: (rule: StringRule) =>
                rule.required().error("Spanish button text is required"),
            }),
          ],
        }),
        // defineField({
        //   name: "url",
        //   title: "Button URL",
        //   type: "url",
        //   validation: (rule: UrlRule) =>
        //     rule.required().error("Button URL is required"),
        // }),
        // defineField({
        //   name: "style",
        //   title: "Button Style",
        //   type: "string",
        //   options: {
        //     list: [
        //       { title: "Primary", value: "primary" },
        //       { title: "Secondary", value: "secondary" },
        //     ],
        //   },
        //   initialValue: "primary",
        // }),
      ],
    }),
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleEs: "title.es",
      subtitleEn: "subtitle.en",
      subtitleEs: "subtitle.es",
      ctaTextEn: "ctaButton.text.en",
      ctaTextEs: "ctaButton.text.es",
    },
    prepare(selection: PreviewProps) {
      const { title, subtitleEn, subtitleEs, ctaTextEn, ctaTextEs } = selection
      return {
        title: title || "Service Section",
        subtitle: `EN: "${subtitleEn || "None"}" | ES: "${subtitleEs || "None"}"`,
        media: () => "📋",
      }
    },
  },
})
