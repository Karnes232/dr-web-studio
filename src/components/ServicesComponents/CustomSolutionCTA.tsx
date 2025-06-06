import { ArrowRight, Target } from "lucide-react"
import React from "react"

const CustomSolutionCTA = () => {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 md:p-12 text-center">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-3xl font-bold text-white mb-4">
          Need a Custom Solution?
        </h3>
        <p className="text-slate-300 text-lg mb-8">
          Don't see exactly what you're looking for? We create custom web
          solutions tailored to your specific business requirements.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#questionnaire"
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
          >
            <Target className="h-5 w-5 mr-2" />
            Start Project Questionnaire
          </a>

          <a
            href="#contact"
            className="bg-white text-slate-800 px-8 py-4 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
          >
            <ArrowRight className="h-5 w-5 mr-2" />
            Get Custom Quote
          </a>
        </div>
      </div>
    </div>
  )
}

export default CustomSolutionCTA
