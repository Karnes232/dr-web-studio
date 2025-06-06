import { ArrowRight, Calendar, Sparkles } from "lucide-react"
import React from "react"
import FeatureItem from "./FeatureItem"

const CustomQuoteCard = () => {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full transform translate-x-16 -translate-y-16"></div>

      <div className="relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg mb-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>

          <h3 className="text-xl font-bold mb-2">Custom Solution</h3>
          <p className="text-gray-300 text-sm">
            Need something unique? Let's build exactly what your business needs.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <FeatureItem className="text-gray-300!">
            Tailored to your specific requirements
          </FeatureItem>
          <FeatureItem className="text-gray-300!">
            Advanced functionality & integrations
          </FeatureItem>
          <FeatureItem className="text-gray-300!">
            Scalable architecture
          </FeatureItem>
          <FeatureItem className="text-gray-300!">
            Priority support & maintenance
          </FeatureItem>
          <FeatureItem className="text-gray-300!">
            Dedicated project manager
          </FeatureItem>
        </div>

        <div className="space-y-3">
          <a
            href="#questionnaire"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Start Questionnaire
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>

          <a
            href="#contact"
            className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-gray-400 text-gray-300 hover:bg-white hover:text-slate-800 rounded-lg font-medium transition-all duration-200"
          >
            Schedule Consultation
            <Calendar className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default CustomQuoteCard
