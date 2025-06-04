import { defineField, defineType } from "sanity"
import type { ImageRule, NumberRule, StringRule } from "sanity"

interface PreviewProps {
  beforeEn?: string
  highlightEn?: string
  afterEn?: string
  beforeEs?: string
  highlightEs?: string
  afterEs?: string
  en?: string
  es?: string
  title?: string
  media?: any
  beforeHighlightEn?: string
  highlightedWordEn?: string
  afterHighlightEn?: string
  beforeHighlightEs?: string
  highlightedWordEs?: string
  afterHighlightEs?: string
}

export default defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      description:
        "Internal title for this hero section (not displayed on frontend)",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
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
        rule.required().error("Background image is required"),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "object",
          fields: [
            defineField({
              name: "beforeHighlight",
              title: "Text Before Highlighted Word",
              type: "string",
              description: "Text that appears before the highlighted word",
            }),
            defineField({
              name: "highlightedWord",
              title: "Highlighted Word",
              type: "string",
              description:
                "The word that will be highlighted/styled differently",
              validation: (rule: StringRule) =>
                rule.required().error("Highlighted word is required"),
            }),
            defineField({
              name: "afterHighlight",
              title: "Text After Highlighted Word",
              type: "string",
              description: "Text that appears after the highlighted word",
            }),
          ],
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "object",
          fields: [
            defineField({
              name: "beforeHighlight",
              title: "Text Before Highlighted Word",
              type: "string",
              description: "Text that appears before the highlighted word",
            }),
            defineField({
              name: "highlightedWord",
              title: "Highlighted Word",
              type: "string",
              description:
                "The word that will be highlighted/styled differently",
              validation: (rule: StringRule) =>
                rule.required().error("Highlighted word is required"),
            }),
            defineField({
              name: "afterHighlight",
              title: "Text After Highlighted Word",
              type: "string",
              description: "Text that appears after the highlighted word",
            }),
          ],
        }),
      ],
      preview: {
        select: {
          beforeEn: "en.beforeHighlight",
          highlightEn: "en.highlightedWord",
          afterEn: "en.afterHighlight",
          beforeEs: "es.beforeHighlight",
          highlightEs: "es.highlightedWord",
          afterEs: "es.afterHighlight",
        },
        prepare(selection: PreviewProps) {
          const {
            beforeEn,
            highlightEn,
            afterEn,
            beforeEs,
            highlightEs,
            afterEs,
          } = selection
          const englishText =
            `${beforeEn || ""} ${highlightEn || ""} ${afterEn || ""}`.trim()
          const spanishText =
            `${beforeEs || ""} ${highlightEs || ""} ${afterEs || ""}`.trim()
          return {
            title: englishText || spanishText || "No heading text",
            subtitle: `EN: "${highlightEn || "None"}" | ES: "${highlightEs || "None"}"`,
          }
        },
      },
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "text",
          description: "Subheading text in English",
          rows: 3,
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "text",
          description: "Subheading text in Spanish",
          rows: 3,
        }),
      ],
      preview: {
        select: {
          en: "en",
          es: "es",
        },
        prepare(selection: PreviewProps) {
          const { en, es } = selection
          return {
            title: en || es || "No subheading",
            subtitle: "Subheading content",
          }
        },
      },
    }),
    defineField({
      name: "ctaButton",
      title: "Call to Action Button",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Button Text",
          type: "string",
        }),
        defineField({
          name: "url",
          title: "Button URL",
          type: "url",
        }),
        defineField({
          name: "style",
          title: "Button Style",
          type: "string",
          options: {
            list: [
              { title: "Primary", value: "primary" },
              { title: "Secondary", value: "secondary" },
              { title: "Outline", value: "outline" },
            ],
          },
          initialValue: "primary",
        }),
      ],
    }),
    defineField({
      name: "textAlignment",
      title: "Text Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
      },
      initialValue: "center",
    }),
    defineField({
      name: "overlayOpacity",
      title: "Background Overlay Opacity",
      type: "number",
      description: "Opacity of dark overlay on background image (0-100)",
      validation: (rule: NumberRule) => rule.min(0).max(100),
      initialValue: 50,
    }),
  ],
  preview: {
    select: {
      title: "title",
      beforeHighlightEn: "heading.en.beforeHighlight",
      highlightedWordEn: "heading.en.highlightedWord",
      afterHighlightEn: "heading.en.afterHighlight",
      beforeHighlightEs: "heading.es.beforeHighlight",
      highlightedWordEs: "heading.es.highlightedWord",
      afterHighlightEs: "heading.es.afterHighlight",
      media: "backgroundImage",
    },
    prepare(selection: PreviewProps) {
      const {
        title,
        beforeHighlightEn,
        highlightedWordEn,
        afterHighlightEn,
        beforeHighlightEs,
        highlightedWordEs,
        afterHighlightEs,
        media,
      } = selection
      const englishHeading =
        `${beforeHighlightEn || ""} ${highlightedWordEn || ""} ${afterHighlightEn || ""}`.trim()
      const spanishHeading =
        `${beforeHighlightEs || ""} ${highlightedWordEs || ""} ${afterHighlightEs || ""}`.trim()
      const headingText =
        englishHeading || spanishHeading || "No heading configured"

      return {
        title: title || "Hero Section",
        subtitle: headingText,
        media,
      }
    },
  },
})
