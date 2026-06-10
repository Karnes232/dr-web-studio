import React from "react"
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
  Tailwind,
} from "@react-email/components"

const PaymentConfirmationEmailSpanish = ({
  clientName = "John Doe",
  clientEmail = "john@example.com",
  paymentAmount = 15000,
  transactionId = "txn_1234567890",
  email = "info@dr-webstudio.com",
}: {
  clientName?: string
  clientEmail?: string
  paymentAmount?: number
  transactionId?: string
  email?: string
}) => {
  const previewText = `Pago confirmado para tu proyecto web - DR Web Studio`
  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })

  return (
    <Html>
      <Head></Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            <Section className="bg-white rounded-lg shadow-lg mb-6 p-6">
              <div className="flex items-center justify-center mb-4">
                <Img
                  src="https://cdn.sanity.io/images/6r8ro1r9/production/81a1e4e2b8efbeb881d9ef9dd1624377bcd2f6d0-512x487.png"
                  alt="Logo de DR Web Studio"
                  className="w-16 h-16 rounded-full"
                />
                <div className="ml-3">
                  <Heading className="text-2xl font-bold text-gray-800 m-0">
                    DR WEB
                  </Heading>
                  <Text className="text-sm text-orange-700 m-0 -mt-1">
                    STUDIO
                  </Text>
                </div>
              </div>
              <div className="text-center">
                <Heading className="text-2xl font-bold text-gray-800 mb-2">
                  ¡Pago Confirmado! 🎉
                </Heading>
                <Text className="text-gray-600 mb-0">
                  Gracias por elegir DR Web Studio para tu proyecto web.
                </Text>
              </div>
            </Section>

            <Section className="bg-white rounded-lg shadow-lg mb-6 px-6 py-4">
              <div className="rounded-lg p-4 mb-4 bg-orange-600">
                <Text className="text-white font-semibold text-lg text-center m-0">
                  Pago procesado con éxito
                </Text>
              </div>
              <Hr className="border-gray-200 mb-4" />
              <Row>
                <div>
                  <Text className="text-gray-600 text-sm font-semibold mb-1">
                    Información del Cliente:
                  </Text>
                  <Text className="text-gray-800 mb-2">{clientName}</Text>
                  <Text className="text-gray-600 text-sm mb-4">
                    {clientEmail}
                  </Text>
                </div>
              </Row>

              <Row className="">
                <Column className="w-full">
                  <Text className="text-gray-600 text-sm mb-1">
                    Monto Pagado:
                  </Text>
                  <Text className="text-2xl font-bold text-green-600 mb-4">
                    {USDollar.format(paymentAmount / 100)}
                  </Text>
                </Column>
              </Row>
              <Row className="">
                <Column className="w-full">
                  <Text className="text-gray-600 text-sm mb-1">
                    ID de Transacción:
                  </Text>
                  <Text className="text-gray-800 font-mono text-sm mb-4">
                    {transactionId}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="bg-white rounded-lg shadow-lg mb-6 p-6">
              <Heading className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                ¿Qué sigue ahora?
              </Heading>
              <div>
                {[
                  "Revisión del Proyecto (en 24 horas)",
                  "Consulta Inicial",
                  "Inicio del Proyecto",
                ].map((title, index) => (
                  <div className="flex items-start" key={index}>
                    <table
                      role="presentation"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{
                        backgroundColor: "#f97316",
                        borderRadius: "9999px",
                        minWidth: "24px",
                        height: "24px",
                        marginRight: "12px",
                        marginTop: "16px",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            align="center"
                            valign="middle"
                            style={{
                              color: "#ffffff",
                              fontSize: "12px",
                              fontWeight: "bold",
                              lineHeight: "24px",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {index + 1}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div>
                      <Text className="text-gray-800 font-semibold mb-1">
                        {title}
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        {index === 0 &&
                          "Nuestro equipo revisará tus requerimientos y preparará una propuesta detallada."}
                        {index === 1 &&
                          "Agendaremos una llamada para discutir tu visión, metas y cronograma."}
                        {index === 2 &&
                          "Con tu aprobación, iniciaremos el diseño y desarrollo con actualizaciones regulares."}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section className="bg-white rounded-lg shadow-lg mb-6 p-6">
              <Heading className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                ¿Tienes dudas o necesitas ayuda?
              </Heading>
              <Text className="text-gray-600 mb-4">
                ¡Estamos para ayudarte! Escríbenos si tienes alguna pregunta o
                necesitas realizar cambios.
              </Text>
              <div>
                <div className="flex items-center">
                  <Text className="text-gray-600 font-semibold mr-2">
                    Correo:
                  </Text>
                  <Link href={`mailto:${email}`} className="text-orange-700">
                    {email}
                  </Link>
                </div>
              </div>
            </Section>

            <Section className="bg-orange-500 rounded-lg p-6 text-center mb-6">
              <Heading className="text-white text-xl font-bold mb-2">
                ¡Emocionados de trabajar contigo!
              </Heading>
              <Text className="text-orange-100 mb-4">
                Nuestro equipo ya está preparando todo para dar vida a tu sitio
                web. Te contactaremos en 24 horas con los siguientes pasos.
              </Text>
            </Section>

            <Section className="text-center py-6">
              <Hr className="border-gray-300 mb-4" />
              <Text className="text-gray-500 text-sm mb-2">
                © {new Date().getFullYear()} DR Web Studio. Todos los derechos
                reservados.
              </Text>
              <Text className="text-gray-500 text-sm">
                Desarrollo profesional de sitios web para negocios en República
                Dominicana.
              </Text>
              <div className="flex justify-around mt-4">
                <Link
                  href="https://drwebstudio.com"
                  className="text-gray-500 text-sm"
                >
                  DR Web Studio
                </Link>
                <Link
                  href="https://www.dr-webstudio.com/en/privacy-policy"
                  className="text-gray-500 text-sm"
                >
                  Política de Privacidad
                </Link>
                <Link
                  href="https://www.dr-webstudio.com/en/terms-of-service"
                  className="text-gray-500 text-sm"
                >
                  Términos de Servicio
                </Link>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default PaymentConfirmationEmailSpanish
