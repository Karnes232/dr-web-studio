// schemas/generalLayout.ts
import { defineField, defineType } from "sanity"
import { DocumentIcon } from "@sanity/icons"
export default defineType({
  name: "generalLayout",
  title: "General Layout",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: "telephone",
      title: "Telephone",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      description: "Add your social media links:",
      fields: [
        {
          name: "github",
          title: "Github URL",
          type: "url",
          initialValue: "https://github.com/",
        },
        {
          name: "linkedin",
          title: "Linkedin URL",
          type: "url",
          initialValue: "https://linkedin.com/in/",
        },
      ],
      options: {
        collapsed: false,
        collapsible: true,
        columns: 2,
      },
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true, // Enables the hotspot functionality for image cropping
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
          description: "Important for SEO and accessibility",
          validation: Rule => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "footerLogo",
      title: "Footer Logo",
      type: "image",
      options: {
        hotspot: true, // Enables the hotspot functionality for image cropping
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
          description: "Important for SEO and accessibility",
          validation: Rule => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "object",
      fields: [
        defineField({
          name: "en",
          title: "English",
          type: "text",
          description: "Text to display in the footer in English",
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "text",
          description: "Text to display in the footer in Spanish",
          validation: Rule => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "companyName",
      media: "logo",
    },
  },
})
