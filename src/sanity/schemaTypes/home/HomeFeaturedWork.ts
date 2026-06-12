import { defineField, defineType } from "sanity"

const localizedString = (name: string, title: string, rows?: number) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({
        name: "en",
        title: "English",
        type: rows ? "text" : "string",
        ...(rows ? { rows } : {}),
      }),
      defineField({
        name: "es",
        title: "Spanish",
        type: rows ? "text" : "string",
        ...(rows ? { rows } : {}),
      }),
    ],
  })

export default defineType({
  name: "homeFeaturedWork",
  title: "Home Featured Work",
  type: "document",
  fields: [
    localizedString("title", "Section Title"),
    localizedString("subtitle", "Section Subtitle", 2),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      validation: rule => rule.min(1).max(3),
      description:
        "Choose 1-3 projects for the homepage 'Recent work' section. The first is shown as the large featured project.",
    }),
  ],
  preview: {
    select: { title: "title.en", projects: "projects" },
    prepare({ title, projects }) {
      const count = Array.isArray(projects) ? projects.length : 0
      return {
        title: title || "Home Featured Work",
        subtitle: `${count} project${count === 1 ? "" : "s"} selected`,
      }
    },
  },
})
