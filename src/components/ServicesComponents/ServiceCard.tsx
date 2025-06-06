import React from "react"
import ServiceCardHeader from "./ServiceCardHeader"
import ServiceBenefits from "./ServiceBenefits"
import ServiceStats from "./ServiceStats"
import ServiceCardActions from "./ServiceCardActions"

const ServiceCard = ({ service }: { service: any }) => {
  const handleGetStarted = () => {
    // Handle get started action
    console.log(`Get started with ${service.title}`)
  }

  const handleLearnMore = () => {
    // Handle learn more action
    console.log(`Learn more about ${service.title}`)
  }
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
      <ServiceCardHeader service={service} />

      <div className="p-6">
        <ServiceBenefits benefits={service.benefits} />
        <ServiceStats timeline={service.timeline} features={service.features} />
        <ServiceCardActions
          onGetStarted={handleGetStarted}
          onLearnMore={handleLearnMore}
        />
      </div>
    </div>
  )
}

export default ServiceCard
