import { defineField, defineType } from "sanity"
import type { StringRule, NumberRule } from "sanity"

interface PreviewProps {
  author?: string
  company?: string
  rating?: number
}

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "text",
          description: "Testimonial quote in English",
          rows: 3,
          validation: (rule: StringRule) =>
            rule.required().error("English quote is required"),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "text",
          description: "Testimonial quote in Spanish",
          rows: 3,
          validation: (rule: StringRule) =>
            rule.required().error("Spanish quote is required"),
        }),
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      validation: (rule: StringRule) =>
        rule.required().error("Author is required"),
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      validation: (rule: StringRule) =>
        rule.required().error("Company is required"),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      description: "Rating from 1 to 5",
      validation: (rule: NumberRule) =>
        rule.required().min(1).max(5).error("Rating must be between 1 and 5"),
    }),
  ],
  preview: {
    select: {
      author: "author",
      company: "company",
      rating: "rating",
    },
    prepare(selection: PreviewProps) {
      const { author, company, rating } = selection
      return {
        title: author || "Unnamed Author",
        subtitle: `${company || "Unknown Company"} - ${rating ? "★".repeat(rating) : "No Rating"}`,
        media: () => "💬",
      }
    },
  },
})
