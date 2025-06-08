import React from "react"

const NewsletterSignup = () => {
  return (
    <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl p-8 text-center text-white mb-12">
      <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
      <p className="text-teal-100 mb-6">
        Get the latest web development tips and insights delivered to your
        inbox.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button className="bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  )
}

export default NewsletterSignup
