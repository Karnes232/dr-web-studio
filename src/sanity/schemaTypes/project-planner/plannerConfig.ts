import { defineType, defineField } from "sanity"
import { localeString, localeText } from "./_localized"

export default defineType({
  name: "plannerConfig",
  title: "Planner · Config",
  type: "document",
  groups: [
    { name: "intro", title: "Intro & Nav" },
    { name: "steps", title: "Step Headings" },
    { name: "contact", title: "Contact Step" },
    { name: "estimate", title: "Estimate Panel" },
    { name: "confirmation", title: "Confirmation" },
    { name: "settings", title: "Estimate Settings" },
  ],
  fields: [
    // ---- Intro ----
    defineField({
      name: "intro",
      title: "Intro",
      type: "object",
      group: "intro",
      fields: [
        localeString("kicker", "Kicker"),
        localeString("title", "Title"),
        localeText("subtitle", "Subtitle"),
        localeString("timeLabel", "Time label"),
      ],
    }),

    // ---- Nav ----
    defineField({
      name: "nav",
      title: "Navigation",
      type: "object",
      group: "intro",
      fields: [
        localeString("backLabel", "Back label"),
        localeString("continueLabel", "Continue label"),
        localeString("submitLabel", "Submit label"),
        localeString("skipLabel", "Skip label"),
        localeString(
          "progressTemplate",
          "Progress template (use {current} and {total})",
        ),
      ],
    }),

    // ---- Step headings ----
    defineField({
      name: "steps",
      title: "Step headings",
      type: "object",
      group: "steps",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "service",
          title: "Step 1 · Service",
          type: "object",
          fields: [
            localeString("kicker", "Kicker"),
            localeString("title", "Title"),
            localeText("subtitle", "Subtitle"),
          ],
        }),
        defineField({
          name: "addons",
          title: "Step 2 · Add-ons",
          type: "object",
          fields: [
            localeString("kicker", "Kicker"),
            localeString("title", "Title"),
            localeText("subtitle", "Subtitle"),
            localeText("emptyNote", "Note when a service has no add-ons", {
              required: false,
            }),
          ],
        }),
        defineField({
          name: "design",
          title: "Step 3 · Design & inspiration",
          type: "object",
          fields: [
            localeString("kicker", "Kicker"),
            localeString("title", "Title"),
            localeText("subtitle", "Subtitle"),
            localeString("referencesLabel", "Reference sites label"),
            localeString("referencesPlaceholder", "Reference sites placeholder"),
          ],
        }),
        defineField({
          name: "size",
          title: "Step 4 · Size & content (page-based services)",
          type: "object",
          fields: [
            localeString("kicker", "Kicker"),
            localeString("title", "Title"),
            localeText("subtitle", "Subtitle"),
            localeString("sizeHeading", "Size heading"),
            localeString("contentHeading", "Content heading"),
            localeString("contentReadyLabel", "Content ready label"),
            localeText("contentReadyDesc", "Content ready description"),
            localeString("contentNeedLabel", "Needs content label"),
            localeText("contentNeedDesc", "Needs content description"),
          ],
        }),
        defineField({
          name: "timeline",
          title: "Step 5 · Timeline & rush",
          type: "object",
          fields: [
            localeString("kicker", "Kicker"),
            localeString("title", "Title"),
            localeText("subtitle", "Subtitle"),
            localeString("estimatedTimelineLabel", "Estimated timeline label"),
            localeString("rushLabel", "Rush option label"),
            localeText("rushDesc", "Rush option description"),
            localeString("rushTag", "Rush tag (e.g. +20%)"),
          ],
        }),
        defineField({
          name: "contact",
          title: "Step 6 · Contact",
          type: "object",
          fields: [
            localeString("kicker", "Kicker"),
            localeString("title", "Title"),
            localeText("subtitle", "Subtitle"),
          ],
        }),
      ],
    }),

    // ---- Contact fields ----
    defineField({
      name: "contactFields",
      title: "Contact fields",
      type: "object",
      group: "contact",
      fields: [
        defineField({
          name: "name",
          title: "Name",
          type: "object",
          fields: [
            localeString("label", "Label"),
            localeString("placeholder", "Placeholder"),
          ],
        }),
        defineField({
          name: "email",
          title: "Email",
          type: "object",
          fields: [
            localeString("label", "Label"),
            localeString("placeholder", "Placeholder"),
            localeString("note", "Note"),
          ],
        }),
        defineField({
          name: "company",
          title: "Business name",
          type: "object",
          fields: [
            localeString("label", "Label"),
            localeString("placeholder", "Placeholder"),
          ],
        }),
        defineField({
          name: "message",
          title: "Message",
          type: "object",
          fields: [
            localeString("label", "Label"),
            localeString("placeholder", "Placeholder"),
          ],
        }),
        localeString("nameInvalid", "Invalid email error"),
        localeText("reassurance", "Reassurance line"),
      ],
    }),

    // ---- Estimate panel ----
    defineField({
      name: "estimatePanel",
      title: "Estimate panel",
      type: "object",
      group: "estimate",
      fields: [
        localeString("kicker", "Kicker"),
        localeString("startingFromLabel", "Starting-from label"),
        localeString("ballparkNote", "Ballpark note"),
        localeString("includedHeading", "Included heading"),
        localeString("timelineLabel", "Timeline label"),
        localeString("contentLine", "Line label · content & copywriting"),
        localeString("rushLine", "Line label · rush (use {pct})"),
        localeText("emptyBody", "Empty state body"),
        localeText("footnote", "Footnote"),
        localeString("mobileKicker", "Mobile kicker"),
        localeString("mobileCta", "Mobile CTA"),
      ],
    }),

    // ---- Confirmation ----
    defineField({
      name: "confirmation",
      title: "Confirmation",
      type: "object",
      group: "confirmation",
      fields: [
        localeString("headingTemplate", "Heading template (use {name})"),
        localeText("subtitle", "Subtitle"),
        localeString("estKicker", "Estimate kicker"),
        localeText("estNote", "Estimate note"),
        localeString("nextTitle", "What-happens-next title"),
        defineField({
          name: "nextSteps",
          title: "What happens next (steps)",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                localeString("title", "Title"),
                localeText("body", "Body"),
              ],
              preview: { select: { title: "title.en" } },
            },
          ],
          validation: Rule => Rule.required().min(1),
        }),
        localeString("footTemplate", "Footer template (use {email})"),
        localeString("restartLabel", "Restart label"),
      ],
    }),

    // ---- Contact email ----
    defineField({
      name: "contactEmail",
      title: "Contact email (optional)",
      description:
        "Where leads are sent and shown. Falls back to the global contact email when empty.",
      type: "string",
      group: "settings",
    }),

    // ---- Estimate settings ----
    defineField({
      name: "estimateSettings",
      title: "Estimate settings",
      type: "object",
      group: "settings",
      fields: [
        defineField({
          name: "currencyCode",
          title: "Currency code",
          type: "string",
          initialValue: "USD",
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: "currencySymbol",
          title: "Currency symbol",
          type: "string",
          initialValue: "$",
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: "rushPct",
          title: "Rush percent (0.2 = +20%)",
          type: "number",
          initialValue: 0.2,
          validation: Rule => Rule.required().min(0),
        }),
        defineField({
          name: "contentPerPagePrice",
          title: "Content price per page",
          type: "number",
          initialValue: 30,
          validation: Rule => Rule.required().min(0),
        }),
        defineField({
          name: "rounding",
          title: "Rounding",
          type: "number",
          initialValue: 50,
          validation: Rule => Rule.required().min(1),
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Project Planner Config" }),
  },
})
