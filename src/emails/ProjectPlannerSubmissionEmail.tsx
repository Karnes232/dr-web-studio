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

export type PlannerEstimateItem = {
  key: string
  label: string
  amount: number
}

export type ProjectPlannerSubmissionEmailProps = {
  name: string
  email: string
  company?: string
  message?: string
  service: string
  addons: string[]
  design?: string
  references?: string[]
  size?: string
  content?: string
  rush: boolean
  timeline: string
  estimateTotal: number
  currencySymbol: string
  items: PlannerEstimateItem[]
}

function money(n: number, symbol: string) {
  return `${symbol}${Math.round(n).toLocaleString("en-US")}`
}

function FieldRow({ label, value }: { label: string; value: string }) {
  if (!value?.trim()) return null
  return (
    <Section className="mb-3">
      <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide m-0 mb-1">
        {label}
      </Text>
      <Text className="text-gray-900 text-sm m-0 whitespace-pre-wrap">
        {value}
      </Text>
    </Section>
  )
}

const ProjectPlannerSubmissionEmail = ({
  name,
  email,
  company = "",
  message = "",
  service,
  addons,
  design = "",
  references = [],
  size = "",
  content = "",
  rush,
  timeline,
  estimateTotal,
  currencySymbol,
  items,
}: ProjectPlannerSubmissionEmailProps) => {
  const previewText = `Project planner submission from ${name} · from ${money(
    estimateTotal,
    currencySymbol,
  )}`
  const addonsText = addons.filter(Boolean).join("\n• ")
  const referencesText = references.filter(Boolean).join("\n")
  const contentLabel =
    content === "need"
      ? "Needs copywriting"
      : content === "ready"
        ? "Content ready"
        : ""

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            <Section className="bg-white rounded-lg shadow-lg p-6 mb-4">
              <div className="flex items-center justify-center mb-4">
                <Img
                  src="https://cdn.sanity.io/images/6r8ro1r9/production/81a1e4e2b8efbeb881d9ef9dd1624377bcd2f6d0-512x487.png"
                  alt="DR Web Studio Logo"
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
                New project planner submission
              </Heading>
              <Text className="text-gray-600 text-sm text-center m-0">
                Reply directly to this email to respond to the sender.
              </Text>
            </Section>

            {/* Estimate */}
            <Section className="bg-white rounded-lg shadow-lg p-6 mb-4">
              <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide m-0 mb-1">
                Estimated investment (starting from)
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
            </Section>

            <Section className="bg-white rounded-lg shadow-lg p-6">
              <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide m-0 mb-1">
                Contact
              </Text>
              <FieldRow label="Name" value={name} />
              <FieldRow label="Email" value={email} />
              <FieldRow label="Company" value={company} />
              <Hr className="border-gray-200 my-4" />
              <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide m-0 mb-1">
                Project details
              </Text>
              <FieldRow label="Service" value={service} />
              {addonsText ? (
                <Section className="mb-3">
                  <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide m-0 mb-1">
                    Add-ons
                  </Text>
                  <Text className="text-gray-900 text-sm m-0 whitespace-pre-wrap">
                    {`• ${addonsText}`}
                  </Text>
                </Section>
              ) : null}
              <FieldRow label="Design style" value={design} />
              <FieldRow label="Size" value={size} />
              <FieldRow label="Content" value={contentLabel} />
              {referencesText ? (
                <Section className="mb-3">
                  <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide m-0 mb-1">
                    Reference sites
                  </Text>
                  <Text className="text-gray-900 text-sm m-0 whitespace-pre-wrap">
                    {referencesText}
                  </Text>
                </Section>
              ) : null}
              <FieldRow label="Rush delivery" value={rush ? "Yes" : "No"} />
              <FieldRow label="Timeline" value={timeline} />
              <Hr className="border-gray-200 my-4" />
              <FieldRow label="Additional notes" value={message} />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default ProjectPlannerSubmissionEmail
