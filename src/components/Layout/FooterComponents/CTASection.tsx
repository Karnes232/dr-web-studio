import React from "react"

const CTASection = () => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg p-6 mb-8">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          Ready to Start Your Website Project?
        </h3>
        <p className="text-orange-100 mb-4">
          Get a free consultation and custom quote for your business website.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#questionnaire"
            className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Start Questionnaire
          </a>
          <a
            href="#contact"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}

export default CTASection
