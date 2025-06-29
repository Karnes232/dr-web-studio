import React from "react"
import ServiceCardHeader from "./ServiceCardHeader"
import ServiceBenefits from "./ServiceBenefits"
import ServiceStats from "./ServiceStats"
import ServiceCardActions from "./ServiceCardActions"

const ServiceCard = ({ service }: { service: any }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
      <ServiceCardHeader service={service} />

      <div className="p-6">
        <ServiceBenefits benefits={service.benefits} />
        <ServiceStats timeline={service.timeline} features={service.features} />
        <ServiceCardActions onLearnMore={service.slug.current} />
      </div>
    </div>
  )
}

export default ServiceCard
