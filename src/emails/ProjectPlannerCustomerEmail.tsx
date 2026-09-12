import React from "react"
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
  Tailwind,
} from "@react-email/components"
import type { PlannerConfig } from "@/sanity/queries/project-planner/plannerConfig"
import type { LocalizedString } from "@/lib/planner/types"
import type { PlannerEstimateItem } from "./ProjectPlannerSubmissionEmail"

type Locale = "en" | "es"

export type ProjectPlannerCustomerEmailProps = {
  name: string
  locale: Locale
  /** Confirmation copy, straight from Sanity `plannerConfig`, so this email
   *  and the on-screen confirmation can never drift apart. */
  confirmation: PlannerConfig["confirmation"]
  contactEmail: string
  service: string
  addons: string[]
  size?: string
  timeline: string
  estimateTotal: number
  currencySymbol: string
  items: PlannerEstimateItem[]
}

/** Only the copy that has no on-screen equivalent lives here. */
const OWN_COPY = {
  intro: {
    en: "Thanks for building out your plan. Here's your copy — nothing is confirmed yet, and there's nothing you need to do.",
    es: "Gracias por armar tu plan. Aquí tienes tu copia — todavía no hay nada confirmado y no necesitas hacer nada.",
  },
  scopeHeading: { en: "What you selected", es: "Lo que seleccionaste" },
  serviceLabel: { en: "Service", es: "Servicio" },
  addonsLabel: { en: "Add-ons", es: "Complementos" },
  sizeLabel: { en: "Size", es: "Tamaño" },
  timelineLabel: { en: "Timeline", es: "Plazo" },
} satisfies Record<string, LocalizedString>

export function customerEmailSubject(name: string, locale: Locale) {
  return locale === "es"
    ? `Tu plan de proyecto, ${name} — DR Web Studio`
    : `Your project plan, ${name} — DR Web Studio`
}

function money(n: number, symbol: string) {
  return `${symbol}${Math.round(n).toLocaleString("en-US")}`
}

const ProjectPlannerCustomerEmail = ({
  name,
  locale,
  confirmation,
  contactEmail,
  service,
  addons,
  size = "",
  timeline,
  estimateTotal,
  currencySymbol,
  items,
}: ProjectPlannerCustomerEmailProps) => {
  const L = (s?: LocalizedString) => s?.[locale] ?? s?.en ?? ""

  const heading =
    L(confirmation?.headingTemplate).replace("{name}", name) ||
    (locale === "es"
      ? `Tu plan está listo, ${name}.`
      : `Your plan is ready, ${name}.`)
  const footer = L(confirmation?.footTemplate).replace("{email}", contactEmail)
  const addonsText = addons.filter(Boolean).join("\n• ")

  return (
    <Html lang={locale}>
      <Head />
      <Preview>{`${heading} ${money(estimateTotal, currencySymbol)}`}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            <Section className="bg-white rounded-lg shadow-lg p-6 mb-4">
              <div className="flex items-center justify-center mb-4">
                <Img
                  src="https://cdn.sanity.io/images/6r8ro1r9/production/81a1e4e2b8efbeb881d9ef9dd1624377bcd2f6d0-512x487.png"
                  alt="DR Web Studio"
                  className="w-16 h-16 rounded-full"
                />
                <div className="ml-3">
                  <Heading className="text-2xl font-bold text-gray-800 m-0">
                    DR WEB
                  </Heading>
                  <Text className="text-sm text-orange-600 m-0 -mt-1">
                    STUDIO
                  </Text>
                </div>
              </div>
              <Heading className="text-xl font-bold text-gray-800 text-center m-0 mb-2">
                {heading}
              </Heading>
              <Text className="text-gray-600 text-sm text-center m-0">
                {L(OWN_COPY.intro)}
              </Text>
            </Section>

            {/* Estimate */}
            <Section className="bg-white rounded-lg shadow-lg p-6 mb-4">
              <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide m-0 mb-1">
                {L(confirmation?.estKicker)}
              </Text>
              <Heading className="text-2xl font-bold text-gray-900 m-0 mb-3">
                {money(estimateTotal, currencySymbol)}
              </Heading>
              {items
                .filter(it => !!it?.label)
                .map(it => (
                  <Section key={it.key} className="mb-1">
                    <Text className="text-gray-700 text-sm m-0">
                      {it.label}
                      {"  "}
                      <span className="text-gray-900 font-semibold">
                        {`+${money(it.amount, currencySymbol)}`}
                      </span>
                    </Text>
                  </Section>
                ))}
              <Hr className="border-gray-200 my-4" />
              {/* The estimate is explicitly not a quote — same wording the
                  confirmation screen uses. */}
              <Text className="text-gray-500 text-xs m-0 italic">
                {L(confirmation?.estNote)}
              </Text>
            </Section>

            {/* What they chose */}
            <Section className="bg-white rounded-lg shadow-lg p-6 mb-4">
              <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide m-0 mb-3">
                {L(OWN_COPY.scopeHeading)}
              </Text>
              <Text className="text-gray-900 text-sm m-0 mb-2">
                <span className="text-gray-500">{`${L(OWN_COPY.serviceLabel)}: `}</span>
                {service}
              </Text>
              {addonsText ? (
                <Text className="text-gray-900 text-sm m-0 mb-2 whitespace-pre-wrap">
                  <span className="text-gray-500">{`${L(OWN_COPY.addonsLabel)}: `}</span>
                  {`\n• ${addonsText}`}
                </Text>
              ) : null}
              {size ? (
                <Text className="text-gray-900 text-sm m-0 mb-2">
                  <span className="text-gray-500">{`${L(OWN_COPY.sizeLabel)}: `}</span>
                  {size}
                </Text>
              ) : null}
              {timeline ? (
                <Text className="text-gray-900 text-sm m-0">
                  <span className="text-gray-500">{`${L(OWN_COPY.timelineLabel)}: `}</span>
                  {timeline}
                </Text>
              ) : null}
            </Section>

            {/* Next steps */}
            {confirmation?.nextSteps?.length ? (
              <Section className="bg-white rounded-lg shadow-lg p-6 mb-4">
                <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide m-0 mb-3">
                  {L(confirmation.nextTitle)}
                </Text>
                {confirmation.nextSteps.map((step, i) => (
                  <Section key={i} className="mb-3">
                    <Text className="text-gray-900 text-sm font-semibold m-0">
                      {`${i + 1}. ${L(step.title)}`}
                    </Text>
                    <Text className="text-gray-600 text-sm m-0">
                      {L(step.body)}
                    </Text>
                  </Section>
                ))}
              </Section>
            ) : null}

            {footer ? (
              <Text className="text-gray-500 text-xs text-center m-0">
                {footer}
              </Text>
            ) : null}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default ProjectPlannerCustomerEmail
