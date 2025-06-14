import { defineField, defineType } from "sanity"
import type { StringRule } from "sanity"

interface PreviewProps {
  title?: string
  icon?: string
  gradientFrom?: string
  gradientTo?: string
}

export default defineType({
  name: "heroVisualElement",
  title: "Hero Visual Elements",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Element Title",
      type: "string",
      description: "Internal title for this visual element (for organization)",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Icon lucide-react code",
    
    }),
    // defineField({
    //   name: "icon",
    //   title: "Icon SVG",
    //   type: "image",
    //   description: "Upload an SVG icon (recommended size: 24x24 or 48x48)",
    //   options: {
    //     accept: "image/svg+xml",
    //     storeOriginalFilename: true,
    //   },
    //   validation: rule => rule.required().error("Icon is required"),
    // }),
    defineField({
      name: "gradientFrom",
      title: "Gradient Start Color",
      type: "string",
      description:
        "Tailwind color class for gradient start (e.g., 'orange-400')",
      validation: (rule: StringRule) =>
        rule.required().error("Gradient start color is required"),
    }),
    defineField({
      name: "gradientTo",
      title: "Gradient End Color",
      type: "string",
      description: "Tailwind color class for gradient end (e.g., 'teal-500')",
      validation: (rule: StringRule) =>
        rule.required().error("Gradient end color is required"),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "string",
          description: "Heading text in English",
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "string",
          description: "Heading text in Spanish",
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
          type: "string",
          description: "Description text in English",
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "string",
          description: "Description text in Spanish",
        }),
      ],
    }),
    defineField({
      name: "badges",
      title: "Technology Badges",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "en",
              title: "English",
              type: "string",
              description: "Badge text in English",
            }),
            defineField({
              name: "es",
              title: "Spanish",
              type: "string",
              description: "Badge text in Spanish",
            }),
          ],
        },
      ],
      validation: rule => rule.min(1).max(3),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description:
        "Order in which this element appears in the slider (1, 2, 3)",
      validation: rule => rule.required().min(1).max(3),
    }),
  ],
  preview: {
    select: {
      title: "title",
      icon: "icon",
      gradientFrom: "gradientFrom",
      gradientTo: "gradientTo",
    },
    prepare(selection: PreviewProps) {
      const { title, icon, gradientFrom, gradientTo } = selection
      return {
        title: title || "Untitled Visual Element",
        subtitle: `Icon: ${icon} | Gradient: ${gradientFrom} → ${gradientTo}`,
      }
    },
  },
})
