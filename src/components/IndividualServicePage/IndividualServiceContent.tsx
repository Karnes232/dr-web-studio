"use client"
import ServiceHero from "@/components/IndividualServicePage/ServiceHero"
import { useLocale } from "@/i18n/useLocale"
import { ServiceItemIndividual } from "@/sanity/queries/services/serviceItem"
import React from "react"
import ServiceOverview from "./ServiceOverview"
import ServiceBenefits from "./ServiceBenefits"
import ServiceFeatures from "./ServiceFeatures"
import ServiceProcess from "./ServiceProcess"
import ServiceFAQ from "./ServiceFAQ"

const IndividualServiceContent = ({
  service,
}: {
  service: ServiceItemIndividual
}) => {
  const { currentLocale, getLocalizedPath } = useLocale()
 
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
        <ServiceProcess
          steps={service.pageContent.steps.map(
            (step: {
              title: { en: string; es: string }
              description: { en: string; es: string }
              duration: { en: string; es: string }
            }) => ({
              title: step.title[currentLocale as keyof typeof step.title],
              description:
                step.description[
                  currentLocale as keyof typeof step.description
                ],
              duration:
                step.duration[currentLocale as keyof typeof step.duration],
            }),
          )}
        />
        <ServiceFAQ faqs={service.pageContent.faqs.map(
          (faq: {
            question: { en: string; es: string }
            answer: { en: string; es: string }
          }) => ({
            question: faq.question[currentLocale as keyof typeof faq.question],
            answer: faq.answer[currentLocale as keyof typeof faq.answer],
          }),
        )} />
        {/* <ServiceCTA service={serviceData} /> */}
      </div>
    </div>
  )
}

export default IndividualServiceContent
