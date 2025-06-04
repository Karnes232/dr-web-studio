import React from "react"

const CTASection = () => {
  return (
    <div className="text-center mt-16">
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-4">
          Ready to Work Together?
        </h3>
        <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
          Let's discuss your website project and how I can help grow your
          business online. Schedule a free consultation or get started with our
          project questionnaire.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Schedule a Call
          </a>
          <a
            href="#questionnaire"
            className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Questionnaire
          </a>
        </div>
      </div>
    </div>
  )
}

export default CTASection
