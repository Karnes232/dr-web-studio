import React from 'react';
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
  Tailwind
} from '@react-email/components';

const PaymentConfirmationEmail = ({
  clientName = "John Doe",
  clientEmail = "john@example.com",
  paymentAmount = 15000,
  transactionId = "txn_1234567890",
  email = "info@dr-webstudio.com"
}: {
  clientName?: string;
  clientEmail?: string;
  paymentAmount?: number;
  transactionId?: string;
  email?: string;
}) => {
  const previewText = `Payment confirmed for your website project - DR Web Studio`;
  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
  return (
    <Html>
       <Head>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @media screen and (max-width: 768px) {
                .payment-row-tablet {
                  display: none !important;
                }
              }
              @media screen and (min-width: 768px) {
                .payment-row-mobile {
                  display: none !important;
                }
              }
              `,
            }}
          />
        </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
      <Body className="bg-gray-50 font-sans">
        <Container className="mx-auto py-8 px-4 max-w-2xl">
          {/* Header */}
          <Section className="bg-white rounded-lg shadow-lg mb-6 p-6">
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
                <Text className="text-sm text-orange-600 m-0 -mt-1">STUDIO</Text>
              </div>
            </div>
            
            <div className="text-center">
              <Heading className="text-2xl font-bold text-gray-800 mb-2">
                Payment Confirmed! 🎉
              </Heading>
              <Text className="text-gray-600 mb-0">
                Thank you for choosing DR Web Studio for your website project
              </Text>
            </div>
          </Section>

          {/* Payment Details */}
          <Section className="bg-white rounded-lg shadow-lg mb-6 px-6 py-4">
            <div className="rounded-lg p-4 mb-4 bg-orange-600">
              <Text className="text-white font-semibold text-lg text-center m-0">
                Payment Successfully Processed
              </Text> 
            </div>
            <Hr className="border-gray-200 mb-4" />
            <Row>
            <div>
                <Text className="text-gray-600 text-sm font-semibold mb-1">Client Information:</Text>
                <Text className="text-gray-800 mb-2">{clientName}</Text>
                <Text className="text-gray-600 text-sm mb-4">{clientEmail}</Text>
              </div>
            </Row>
            
            <Row className="payment-row-mobile">
              <Column className="w-full">
                <Text className="text-gray-600 text-sm mb-1">Amount Paid:</Text>
                <Text className="text-2xl font-bold text-green-600 mb-4">{USDollar.format(paymentAmount/100)}</Text>
              </Column>
            </Row>

            <Row className="payment-row-mobile">
              <Column className="w-full">
                <Text className="text-gray-600 text-sm mb-1">Transaction ID:</Text>
                <Text className="text-gray-800 font-mono text-sm mb-4">{transactionId}</Text>
              </Column>
            </Row>
            
            <Row className="payment-row-tablet">
              <Column className="w-1/2">
                <Text className="text-gray-600 text-sm mb-1">Amount Paid:</Text>
                <Text className="text-2xl font-bold text-green-600 mb-4">{USDollar.format(paymentAmount/100)}</Text>
              </Column>
              <Column className="w-1/2">
                <Text className="text-gray-600 text-sm mb-1">Transaction ID:</Text>
                <Text className="text-gray-800 font-mono text-sm mb-4">{transactionId}</Text>
              </Column>
            </Row>
            
            {/* <Text className="text-gray-600 text-sm mb-1">Project ID:</Text>
            <Text className="text-gray-800 font-semibold mb-4">{projectId}</Text> */}
          </Section>


          {/* Next Steps */}
          <Section className="bg-white rounded-lg shadow-lg mb-6 p-6">
            <Heading className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              What Happens Next?
            </Heading>
            
            <div className="">
              <div className="flex items-start">
              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                style={{
                  backgroundColor: '#f97316', // orange-500
                  borderRadius: '9999px',
                  minWidth: '24px',
                  height: '24px',
                  marginRight: '12px',
                  marginTop: '16px',
                }}
              >
                <tbody>
                  <tr>
                    <td
                      align="center"
                      valign="middle"
                      style={{
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        lineHeight: '24px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      1
                    </td>
                  </tr>
                </tbody>
              </table>
                <div>
                  <Text className="text-gray-800 font-semibold mb-1">Project Review (Within 24 hours)</Text>
                  <Text className="text-gray-600 text-sm">
                    Our team will review your requirements and prepare a detailed project proposal.
                  </Text>
                </div>
              </div>
              
              <div className="flex items-start">
              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                style={{
                  backgroundColor: '#f97316', // orange-500
                  borderRadius: '9999px',
                  minWidth: '24px',
                  height: '24px',
                  marginRight: '12px',
                  marginTop: '16px',
                }}
              >
                <tbody>
                  <tr>
                    <td
                      align="center"
                      valign="middle"
                      style={{
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        lineHeight: '24px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      2
                    </td>
                  </tr>
                </tbody>
              </table>
                <div>
                  <Text className="text-gray-800 font-semibold mb-1">Initial Consultation</Text>
                  <Text className="text-gray-600 text-sm">
                    We'll schedule a call to discuss your vision, goals, and project timeline in detail.
                  </Text>
                </div>
              </div>
              
              <div className="flex items-start">
              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                style={{
                  backgroundColor: '#f97316', // orange-500
                  borderRadius: '9999px',
                  minWidth: '24px',
                  height: '24px',
                  marginRight: '12px',
                  marginTop: '16px',
                }}
              >
                <tbody>
                  <tr>
                    <td
                      align="center"
                      valign="middle"
                      style={{
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        lineHeight: '24px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      3
                    </td>
                  </tr>
                </tbody>
              </table>
                <div>
                  <Text className="text-gray-800 font-semibold mb-1">Project Kickoff</Text>
                  <Text className="text-gray-600 text-sm">
                    Once approved, we'll begin the design and development process with regular updates.
                  </Text>
                </div>
              </div>
            </div>
          </Section>

          {/* Contact Information */}
          <Section className="bg-white rounded-lg shadow-lg mb-6 p-6">
            <Heading className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              Need to Get in Touch?
            </Heading>
            
            <Text className="text-gray-600 mb-4">
              We're here to help! Feel free to reach out if you have any questions or need to make changes to your project.
            </Text>
            
            <div className="">
              <div className="flex items-center">
                <Text className="text-gray-600 font-semibold mr-2">Email:</Text>
                <Link href={`mailto:${email}`} className="text-orange-600 ">
                  {email}
                </Link>
              </div>
              
              {/* <div className="flex items-center">
                <Text className="text-gray-600 font-semibold mr-2">WhatsApp:</Text>
                <Link href="https://wa.me/18091234567" className="text-orange-600 ">
                  Message us on WhatsApp
                </Link>
              </div> */}
              
              {/* <div className="flex items-center">
                <Text className="text-gray-600 font-semibold mr-2">Schedule a Call:</Text>
                <Link href="https://calendly.com/drwebstudio" className="text-orange-600 ">
                  Book a consultation
                </Link>
              </div> */}
            </div>
          </Section>

          {/* Call to Action */}
          <Section className="bg-orange-500 rounded-lg p-6 text-center mb-6">
            <Heading className="text-white text-xl font-bold mb-2">
              Excited to Work With You!
            </Heading>
            <Text className="text-orange-100 mb-4">
              Our team is already preparing to bring your website vision to life. 
              We'll be in touch within 24 hours with next steps.
            </Text>
            {/* <Link 
              href="https://drwebstudio.com/project-portal"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 inline-block"
            >
              View Project Portal
            </Link> */}
          </Section>

          {/* Footer */}
          <Section className="text-center py-6">
            <Hr className="border-gray-300 mb-4" />
            <Text className="text-gray-500 text-sm mb-2">
              © {new Date().getFullYear()} DR Web Studio. All rights reserved.
            </Text>
            <Text className="text-gray-500 text-sm">
              Professional website development for businesses in the Dominican Republic
            </Text>
            
            <div className="flex justify-around mt-4">
              <Link href="https://drwebstudio.com" className="text-gray-500 text-sm ">
                DR Web Studio
              </Link>
              <Link href="https://www.dr-webstudio.com/en/privacy-policy" className="text-gray-500 text-sm ">
                Privacy Policy
              </Link>
              <Link href="https://www.dr-webstudio.com/en/terms-of-service" className="text-gray-500 text-sm ">
                Terms of Service
              </Link>
            </div>
          </Section>
        </Container>
      </Body>
      </Tailwind>
    </Html>
  );
};

export default PaymentConfirmationEmail;