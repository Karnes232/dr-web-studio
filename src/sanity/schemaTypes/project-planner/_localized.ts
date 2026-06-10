import { defineField } from "sanity"

/**
 * Helpers that emit the project's standard inline localized field:
 * an `object` with `en` / `es` sub-fields. This matches the existing
 * convention (no custom `localeString` schema type) while keeping the
 * planner schemas readable — the resulting field definition is identical
 * to writing the object out by hand.
 */
export const localeString = (
  name: string,
  title: string,
  opts: { required?: boolean } = { required: true },
) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      { name: "en", title: "English", type: "string" },
      { name: "es", title: "Spanish", type: "string" },
    ],
    validation: rule => (opts.required ? rule.required() : rule),
  })

export const localeText = (
  name: string,
  title: string,
  opts: { required?: boolean } = { required: true },
) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      { name: "en", title: "English", type: "text" },
      { name: "es", title: "Spanish", type: "text" },
    ],
    validation: rule => (opts.required ? rule.required() : rule),
  })
