import React from "react"
import { Star, Quote } from "lucide-react"
const TrustSignals = () => {
  const clientLogos = [
    { name: "TechCorp", logo: "/client-logos/techcorp.png" },
    { name: "StartupXYZ", logo: "/client-logos/startup.png" },
    { name: "LocalBiz", logo: "/client-logos/localbiz.png" },
    { name: "Restaurant DR", logo: "/client-logos/restaurant.png" },
    { name: "Fashion Store", logo: "/client-logos/fashion.png" },
    { name: "Medical Clinic", logo: "/client-logos/medical.png" },
  ]

  const testimonials = [
    {
      quote:
        "DR Web Studio transformed our online presence completely. Our sales increased by 150% in just 3 months!",
      author: "Maria Rodriguez",
      company: "Boutique Fashion DR",
      rating: 5,
    },
    {
      quote:
        "Professional, fast, and exactly what we needed. They understood our vision and delivered beyond expectations.",
      author: "Carlos Martinez",
      company: "Santo Domingo Restaurant",
      rating: 5,
    },
    {
      quote:
        "The website loads incredibly fast and looks amazing on all devices. Our customers love the new design!",
      author: "Ana Jimenez",
      company: "Medical Center Punta Cana",
      rating: 5,
    },
  ]
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Trusted by Dominican Businesses
          </h2>
          <p className="text-xl text-gray-600">
            Join the growing number of successful businesses we've helped
            establish their online presence.
          </p>
        </div>

        {/* Client Logos */}
        <div className="mb-16">
          <h3 className="text-center text-lg font-semibold text-gray-500 mb-8">
            PROUD TO WORK WITH
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60 hover:opacity-100 transition-opacity duration-300">
            {clientLogos.map((client, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-semibold text-sm hover:bg-gray-300 transition-colors">
                  {client.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-orange-400" />
                <div className="flex ml-auto">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              <div className="border-t pt-4">
                <p className="font-semibold text-slate-800">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-600">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">50+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal-500 mb-2">100+</div>
            <div className="text-gray-600">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-2">5.0</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustSignals
