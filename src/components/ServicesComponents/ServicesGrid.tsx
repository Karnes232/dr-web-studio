import React from "react"
import ServiceCard from "./ServiceCard"

const ServicesGrid = ({ services }: { services: any[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
      {services.map(service => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  )
}

export default ServicesGrid
