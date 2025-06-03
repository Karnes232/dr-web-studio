import React from 'react'
import { 
    ArrowRight,
    Zap, 
    Smartphone, 
    Search, 
    ShoppingCart,
    Code,
    Palette,
  } from 'lucide-react';
const QuickServicesOverview = () => {
    const services = [
        {
          icon: Code,
          title: "Custom Websites",
          description: "Tailored web solutions built with modern technologies for your unique business needs.",
          color: "from-blue-500 to-cyan-500"
        },
        {
          icon: ShoppingCart,
          title: "E-commerce Solutions",
          description: "Complete online stores with secure payments and inventory management systems.",
          color: "from-green-500 to-emerald-500"
        },
        {
          icon: Smartphone,
          title: "Mobile-First Design",
          description: "Responsive websites that look perfect on all devices and screen sizes.",
          color: "from-purple-500 to-pink-500"
        },
        {
          icon: Zap,
          title: "Fast Performance",
          description: "Lightning-fast loading speeds optimized for better user experience and SEO.",
          color: "from-orange-500 to-yellow-500"
        },
        {
          icon: Search,
          title: "SEO Optimized",
          description: "Built-in SEO best practices to help your website rank higher in search results.",
          color: "from-red-500 to-pink-500"
        },
        {
          icon: Palette,
          title: "Custom Design",
          description: "Unique designs that reflect your brand identity and engage your customers.",
          color: "from-indigo-500 to-purple-500"
        }
      ];
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Our Web Development Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From custom websites to e-commerce solutions, we provide comprehensive web development services to grow your business online.
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="group">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`w-14 h-14 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href="#services" className="text-orange-500 font-medium flex items-center">
                      Learn More
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <a
            href="#services"
            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View All Services
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default QuickServicesOverview