import ContactFAQ from "@/components/ContactPageComponents/ContactFAQ"
import ContactForm from "@/components/ContactPageComponents/ContactForm"
import ContactHero from "@/components/ContactPageComponents/ContactHero"
import LocationInfo from "@/components/ContactPageComponents/LocationInfo"
import React from "react"

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-slate-50 to-orange-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactHero />
        {/* <ContactMethods /> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <ContactForm />
          <div className="space-y-8">
            <LocationInfo />
            <ContactFAQ />
          </div>
        </div>
      </div>
    </section>
  )
}
