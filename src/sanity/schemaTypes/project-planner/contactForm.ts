import { defineField, defineType } from "sanity"

export default defineType({
  name: "contactForm",
  title: "Contact Form Step",
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
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "string",
          validation: Rule => Rule.required(),
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
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: "es",
          title: "Spanish",
          type: "string",
          validation: Rule => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "formFields",
      title: "Form Fields",
      type: "object",
      fields: [
        defineField({
          name: "fullName",
          title: "Full Name Field",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "object",
              fields: [
                defineField({
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
              ],
            }),
            defineField({
              name: "placeholder",
              title: "Placeholder",
              type: "object",
              fields: [
                defineField({
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "email",
          title: "Email Field",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "object",
              fields: [
                defineField({
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
              ],
            }),
            defineField({
              name: "placeholder",
              title: "Placeholder",
              type: "object",
              fields: [
                defineField({
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "phone",
          title: "Phone Field",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "object",
              fields: [
                defineField({
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
              ],
            }),
            defineField({
              name: "placeholder",
              title: "Placeholder",
              type: "object",
              fields: [
                defineField({
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "company",
          title: "Company Field",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "object",
              fields: [
                defineField({
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
              ],
            }),
            defineField({
              name: "placeholder",
              title: "Placeholder",
              type: "object",
              fields: [
                defineField({
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "message",
          title: "Message Field",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "object",
              fields: [
                defineField({
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
              ],
            }),
            defineField({
              name: "placeholder",
              title: "Placeholder",
              type: "object",
              fields: [
                defineField({
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
                defineField({
                  name: "es",
                  title: "Spanish",
                  type: "string",
                  validation: Rule => Rule.required(),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title.en",
    },
  },
})
