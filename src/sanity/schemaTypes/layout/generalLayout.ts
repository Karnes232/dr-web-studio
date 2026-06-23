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
      description:
        "Personal links (GitHub, LinkedIn) describe James as a Person; the " +
        "company links describe the DR Web Studio business. Both feed the " +
        "structured-data (schema.org) sameAs lists.",
      fields: [
        {
          name: "github",
          title: "Github URL (personal)",
          type: "url",
          initialValue: "https://github.com/",
        },
        {
          name: "linkedin",
          title: "Linkedin URL (personal)",
          type: "url",
          initialValue: "https://linkedin.com/in/",
        },
        {
          name: "linkedinCompany",
          title: "LinkedIn Company Page URL",
          type: "url",
        },
        {
          name: "googleBusiness",
          title: "Google Business Profile URL",
          type: "url",
        },
        {
          name: "trustpilot",
          title: "Trustpilot URL",
          type: "url",
        },
        {
          name: "clutch",
          title: "Clutch Profile URL",
          type: "url",
        },
        {
          name: "instagram",
          title: "Instagram URL",
          type: "url",
        },
        {
          name: "facebook",
          title: "Facebook Page URL",
          type: "url",
        },
      ],
      options: {
        collapsed: false,
        collapsible: true,
        columns: 2,
      },
    }),
    defineField({
      name: "address",
      title: "Business Address",
      type: "object",
      description: "Used for LocalBusiness structured data (NAP).",
      options: { collapsed: false, collapsible: true },
      fields: [
        { name: "streetAddress", title: "Street Address", type: "string" },
        { name: "addressLocality", title: "City / Locality", type: "string" },
        { name: "addressRegion", title: "Region / Province", type: "string" },
        { name: "postalCode", title: "Postal Code", type: "string" },
        {
          name: "addressCountry",
          title: "Country Code (ISO, e.g. DO)",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "geo",
      title: "Geo Coordinates",
      type: "object",
      description: "Latitude / longitude for LocalBusiness structured data.",
      options: { collapsed: true, collapsible: true, columns: 2 },
      fields: [
        { name: "latitude", title: "Latitude", type: "number" },
        { name: "longitude", title: "Longitude", type: "number" },
      ],
    }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "array",
      description: "Business hours for LocalBusiness structured data.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "dayOfWeek",
              title: "Days",
              type: "array",
              of: [{ type: "string" }],
              options: {
                list: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
              },
            },
            { name: "opens", title: "Opens (HH:MM)", type: "string" },
            { name: "closes", title: "Closes (HH:MM)", type: "string" },
          ],
          preview: {
            select: { days: "dayOfWeek", opens: "opens", closes: "closes" },
            prepare({ days, opens, closes }) {
              return {
                title: Array.isArray(days) ? days.join(", ") : "Hours",
                subtitle: opens && closes ? `${opens} – ${closes}` : "",
              }
            },
          },
        },
      ],
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
