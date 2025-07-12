import { defineField, defineType } from "sanity"

export default defineType({
  name: "paymentSuccess",
  title: "Payment Success Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "string",
          validation: Rule => Rule.required(),
        },
        {
          name: "es",
          title: "Spanish",
          type: "string",
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "object",
      fields: [
        {
          name: "en",
          title: "English",
          type: "text",
          validation: Rule => Rule.required(),
        },
        {
          name: "es",
          title: "Spanish",
          type: "text",
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "whatsNext",
      title: "What's Next Section",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Section Title",
          type: "object",
          fields: [
            {
              name: "en",
              title: "English",
              type: "string",
              validation: Rule => Rule.required(),
            },
            {
              name: "es",
              title: "Spanish",
              type: "string",
              validation: Rule => Rule.required(),
            },
          ],
        },
        {
          name: "steps",
          title: "Steps",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "number",
                  title: "Step Number",
                  type: "number",
                  validation: Rule => Rule.required(),
                },
                {
                  name: "description",
                  title: "Step Description",
                  type: "object",
                  fields: [
                    {
                      name: "en",
                      title: "English",
                      type: "text",
                      validation: Rule => Rule.required(),
                    },
                    {
                      name: "es",
                      title: "Spanish",
                      type: "text",
                      validation: Rule => Rule.required(),
                    },
                  ],
                },
                {
                  name: "color",
                  title: "Step Color",
                  type: "string",
                  options: {
                    list: [
                      { title: "Orange", value: "bg-orange-500" },
                      { title: "Teal", value: "bg-teal-500" },
                      { title: "Yellow", value: "bg-yellow-500" },
                      { title: "Blue", value: "bg-blue-500" },
                      { title: "Green", value: "bg-green-500" },
                      { title: "Purple", value: "bg-purple-500" },
                    ],
                  },
                  validation: Rule => Rule.required(),
                },
              ],
            },
          ],
          validation: Rule => Rule.required().min(1),
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title.en",
    },
  },
}) 