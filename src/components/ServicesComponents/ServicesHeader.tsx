import React from "react"
import { Code } from "lucide-react"

const ServicesHeader = () => {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
        <Code className="h-4 w-4 mr-2" />
        Our Services
      </div>

      <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
        Professional Web Development
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
          Services
        </span>
      </h2>

      <p className="text-xl text-slate-600 max-w-3xl mx-auto">
        From custom websites to e-commerce solutions, we offer comprehensive web
        development services tailored to your business needs in the Dominican
        Republic.
      </p>
    </div>
  )
}

export default ServicesHeader
