import { defineField, defineType } from "sanity"
import type { StringRule } from "sanity"

interface PreviewProps {
  titleEn?: string
  titleEs?: string
  subtitleEn?: string
  subtitleEs?: string
}

export default defineType({
  name: "trustSignals",
  title: "Trust Signals",
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
      name: "subtitle",
      title: "Subtitle",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "text",
          description: "Section subtitle in English",
          rows: 3,
          validation: (rule: StringRule) =>
            rule.required().error("English subtitle is required"),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "text",
          description: "Section subtitle in Spanish",
          rows: 3,
          validation: (rule: StringRule) =>
            rule.required().error("Spanish subtitle is required"),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleEs: "title.es",
      subtitleEn: "subtitle.en",
      subtitleEs: "subtitle.es",
    },
    prepare(selection: PreviewProps) {
      const { titleEn, titleEs, subtitleEn, subtitleEs } = selection
      return {
        title: titleEn || titleEs || "Trust Signals Section",
        subtitle: `EN: "${subtitleEn || "None"}" | ES: "${subtitleEs || "None"}"`,
        media: () => "🔒",
      }
    },
  },
}) 