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

export type ContactFormEmailProps = {
  name: string
  email: string
  company?: string
  phone?: string
  projectType?: string
  budget?: string
  timeline?: string
  message: string
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

const ContactFormEmail = ({
  name,
  email,
  company = "",
  phone = "",
  projectType = "",
  budget = "",
  timeline = "",
  message,
}: ContactFormEmailProps) => {
  const previewText = `New message from ${name}`

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
                New contact form submission
              </Heading>
              <Text className="text-gray-600 text-sm text-center m-0">
                Reply directly to this email to respond to the sender.
              </Text>
            </Section>

            <Section className="bg-white rounded-lg shadow-lg p-6">
              <FieldRow label="Name" value={name} />
              <FieldRow label="Email" value={email} />
              <FieldRow label="Company" value={company} />
              <FieldRow label="Phone" value={phone} />
              <FieldRow label="Project type" value={projectType} />
              <FieldRow label="Budget" value={budget} />
              <FieldRow label="Timeline" value={timeline} />
              <Hr className="border-gray-200 my-4" />
              <FieldRow label="Message" value={message} />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default ContactFormEmail
