"use client"
import ServiceHero from "@/components/IndividualServicePage/ServiceHero"
import { useLocale } from "@/i18n/useLocale"
import { ServiceItemIndividual } from "@/sanity/queries/services/serviceItem"
import React from "react"
import ServiceOverview from "./ServiceOverview"
import ServiceBenefits from "./ServiceBenefits"
import ServiceFeatures from "./ServiceFeatures"

const IndividualServiceContent = ({
  service,
}: {
  service: ServiceItemIndividual
}) => {
  const { currentLocale, getLocalizedPath } = useLocale()
  const serviceData = {
    title: "Custom Website Development",
    category: ["Web Development", "Web Design", "Web Applications"],
    shortSummary:
      "Professional, responsive websites built with modern technology that convert visitors into customers and grow your business.",
    heroImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    timeline: "2-4 weeks",
    clientsServed: "50",
    badge: "Most Popular",
    startingPrice: "599",
    longDescription: `Custom Website Development is the process of creating a unique, tailored website specifically designed for your business needs, goals, and brand identity. Unlike template-based solutions, custom development gives you complete control over design, functionality, and user experience.
    
    Our custom websites are built using modern technologies like React, Next.js, and Tailwind CSS, ensuring fast loading times, mobile responsiveness, and search engine optimization. We focus on creating websites that not only look professional but also drive business results through strategic design and conversion optimization.
    
    Whether you're a small business looking to establish your online presence or a growing company needing advanced functionality, our custom development approach ensures your website stands out from the competition and delivers measurable results for your business.`,
    beforeState: [
      "Outdated or no website",
      "Poor mobile experience",
      "Slow loading times",
      "Low search rankings",
      "Few online inquiries",
    ],
    afterState: [
      "Modern, professional website",
      "Perfect mobile experience",
      "Lightning-fast performance",
      "Higher search rankings",
      "Increased leads and sales",
    ],
    benefits: [
      {
        title: "Mobile-First Design",
        description:
          "Your website looks and works perfectly on all devices, ensuring you never lose a potential customer.",
      },
      {
        title: "Lightning Fast Speed",
        description:
          "Optimized performance means better user experience and higher search engine rankings.",
      },
      {
        title: "SEO Optimized",
        description:
          "Built-in SEO best practices help your business get found by potential customers online.",
      },
      {
        title: "Conversion Focused",
        description:
          "Strategic design elements and calls-to-action turn visitors into paying customers.",
      },
      {
        title: "Scalable Architecture",
        description:
          "Your website grows with your business, easily adding new features and functionality.",
      },
      {
        title: "Ongoing Support",
        description:
          "We're here to help with updates, maintenance, and technical support whenever you need it.",
      },
    ],
    features: {
      standard: [
        {
          name: "Responsive Design",
          description: "Perfect display on desktop, tablet, and mobile devices",
        },
        {
          name: "Contact Forms",
          description: "Professional contact forms with spam protection",
        },
        {
          name: "SEO Setup",
          description: "Basic on-page SEO optimization and meta tags",
        },
        {
          name: "Google Analytics",
          description: "Track website performance and visitor behavior",
        },
        {
          name: "Social Media Integration",
          description: "Connect your social media profiles",
        },
        {
          name: "SSL Certificate",
          description: "Secure connection for visitor trust and SEO",
        },
      ],
      optional: [
        {
          name: "E-commerce Integration",
          description: "Add online store functionality",
          price: "300",
        },
        {
          name: "Blog System",
          description: "Content management for regular updates",
          price: "200",
        },
        {
          name: "Booking System",
          description: "Online appointment scheduling",
          price: "250",
        },
        {
          name: "Multi-language Support",
          description: "English and Spanish versions",
          price: "400",
        },
      ],
    },
    steps: [
      {
        title: "Discovery",
        description:
          "We learn about your business, goals, and requirements through detailed consultation.",
        duration: "1-2 days",
      },
      {
        title: "Design",
        description:
          "Create wireframes and visual designs that align with your brand and objectives.",
        duration: "3-5 days",
      },
      {
        title: "Development",
        description:
          "Build your website using modern technologies with regular progress updates.",
        duration: "1-2 weeks",
      },
      {
        title: "Launch",
        description:
          "Test, optimize, and launch your website with full training and support.",
        duration: "2-3 days",
      },
    ],
    faqs: [
      {
        question: "How long does it take to build a custom website?",
        answer:
          "Most custom websites take 2-4 weeks to complete, depending on complexity and features required. We provide a detailed timeline during the discovery phase.",
      },
      {
        question: "Do you provide website hosting?",
        answer:
          "We can recommend reliable hosting solutions and help with setup. We also offer managed hosting services for clients who prefer a hands-off approach.",
      },
      {
        question: "Will my website work on mobile devices?",
        answer:
          "Absolutely! All our websites are built with a mobile-first approach, ensuring perfect functionality across all devices and screen sizes.",
      },
      {
        question: "Can I update the website content myself?",
        answer:
          "Yes, we build websites with user-friendly content management systems that allow you to easily update text, images, and other content without technical knowledge.",
      },
      {
        question: "What if I need changes after the website is live?",
        answer:
          "We provide ongoing support and maintenance services. Minor updates are often included, while larger changes can be handled through our support packages.",
      },
      {
        question: "Do you offer SEO services?",
        answer:
          "Basic SEO optimization is included with every website. We also offer advanced SEO services and ongoing optimization for clients who want to maximize their search rankings.",
      },
    ],
  }
  console.log(service.pageContent.features.optionalFeatures)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <ServiceHero
        title={service.title[currentLocale as keyof typeof service.title]}
        categories={service.categories.map(
          category =>
            category.name[currentLocale as keyof typeof category.name],
        )}
        description={
          service.description[currentLocale as keyof typeof service.description]
        }
        timeline={service.timeline}
      />
      <div className="">
        <ServiceOverview
          title={service.title[currentLocale as keyof typeof service.title]}
          mainDescription={
            service.pageContent.mainDescription[
              currentLocale as keyof typeof service.pageContent.mainDescription
            ]
          }
          beforeState={service.pageContent.beforeState.map(
            (item: { en: string; es: string }) =>
              item[currentLocale as keyof typeof item],
          )}
          afterState={service.pageContent.afterState.map(
            (item: { en: string; es: string }) =>
              item[currentLocale as keyof typeof item],
          )}
          service={serviceData}
        />
        <ServiceBenefits
          title={
            service.pageContent.benefits.title[
              currentLocale as keyof typeof service.pageContent.benefits.title
            ]
          }
          description={
            service.pageContent.benefits.description[
              currentLocale as keyof typeof service.pageContent.benefits.description
            ]
          }
          benefits={service.pageContent.benefits.benefits.map(
            (benefit: {
              title: { en: string; es: string }
              description: { en: string; es: string }
            }) => ({
              title: benefit.title[currentLocale as keyof typeof benefit.title],
              description:
                benefit.description[
                  currentLocale as keyof typeof benefit.description
                ],
            }),
          )}
        />
        <ServiceFeatures
          title={
            service.pageContent.features.title[
              currentLocale as keyof typeof service.pageContent.features.title
            ]
          }
          description={
            service.pageContent.features.description[
              currentLocale as keyof typeof service.pageContent.features.description
            ]
          }
          standardFeatures={service.pageContent.features.standardFeatures.map(
            (feature: {
              name: { en: string; es: string }
              description: { en: string; es: string }
            }) => ({
              name: feature.name[currentLocale as keyof typeof feature.name],
              description:
                feature.description[
                  currentLocale as keyof typeof feature.description
                ],
            }),
          )}
          optionalFeatures={service.pageContent.features.optionalFeatures.map(
            (feature: {
              name: { en: string; es: string }
              description: { en: string; es: string }
              price: number
            }) => ({
              name: feature.name[currentLocale as keyof typeof feature.name],
              description:
                feature.description[
                  currentLocale as keyof typeof feature.description
                ],
              price: feature.price,
            }),
          )}
        />
        {/* <ServiceProcess steps={serviceData.steps} />
    <ServiceFAQ faqs={serviceData.faqs} />
    <ServiceCTA service={serviceData} /> */}
      </div>
    </div>
  )
}

export default IndividualServiceContent
