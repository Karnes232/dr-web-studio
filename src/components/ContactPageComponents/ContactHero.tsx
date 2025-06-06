import React from "react"

const ContactHero = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
        Let's Build Your
        <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
          {" "}
          Dream Website
        </span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        Ready to take your business online? Get in touch and let's discuss how
        we can create the perfect website for your needs.
      </p>
    </div>
  )
}

export default ContactHero
