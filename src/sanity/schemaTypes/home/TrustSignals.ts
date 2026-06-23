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
    defineField({
      name: "stats",
      title: "Stats",
      type: "object",
      description:
        "Trust numbers shown in the hero indicator AND the stats grid — single source so they always match.",
      options: { collapsed: false, collapsible: true },
      fields: [
        defineField({
          name: "happyClients",
          title: "Happy Clients",
          type: "number",
          initialValue: 20,
        }),
        defineField({
          name: "projectsCompleted",
          title: "Projects Completed",
          type: "number",
          initialValue: 50,
        }),
        defineField({
          name: "averageRating",
          title: "Average Rating",
          type: "number",
          initialValue: 5,
        }),
        defineField({
          name: "supportAvailable",
          title: "Support Available",
          type: "string",
          initialValue: "24/7",
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
      }
    },
  },
})
