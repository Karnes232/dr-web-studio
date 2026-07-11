import { defineField, defineType } from "sanity"
import type { StringRule } from "sanity"

// Rich text (Portable Text), same restricted setup as the landing pages:
// Normal style + lists + bold/italic + the default `link` annotation.
const richBlock = {
  type: "array" as const,
  of: [
    {
      type: "block" as const,
      styles: [{ title: "Normal", value: "normal" }],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
      },
    },
  ],
}

/**
 * Singleton prose section rendered on the homepage between the hero and the
 * services grid. Gives the homepage a substantive, CMS-editable value
 * proposition (the hero alone is intentionally terse).
 */
export default defineType({
  name: "homeIntro",
  title: "Home Intro",
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
          validation: (rule: StringRule) =>
            rule.required().error("English title is required"),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "string",
          validation: (rule: StringRule) =>
            rule.required().error("Spanish title is required"),
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "object",
      fields: [
        defineField({ name: "en", title: "English", ...richBlock }),
        defineField({ name: "es", title: "Spanish", ...richBlock }),
      ],
    }),
  ],
  preview: {
    select: { titleEn: "title.en" },
    prepare({ titleEn }: { titleEn?: string }) {
      return { title: titleEn || "Home Intro" }
    },
  },
})
