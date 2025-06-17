import { defineField, defineType } from "sanity"

export default defineType({
  name: "stats",
  title: "Stats",
  type: "document",
  fields: [
    defineField({
      name: "websitesDelivered",
      title: "Websites Delivered",
      type: "number",
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: "yearsExperience",
      title: "Years Experience",
      type: "number",
      validation: Rule => Rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      title: "websitesDelivered",
      subtitle: "yearsExperience",
    },
    prepare({ title, subtitle }) {
      return {
        title: `${title} Websites Delivered`,
        subtitle: `${subtitle} Years Experience`,
      }
    },
  },
})
