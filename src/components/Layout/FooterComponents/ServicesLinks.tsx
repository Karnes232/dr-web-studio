import React from 'react'

const ServicesLinks = () => {
    const services = [
        { href: "#custom-websites", label: "Custom Websites" },
        { href: "#ecommerce", label: "E-commerce Solutions" },
        { href: "#landing-pages", label: "Landing Pages" },
        { href: "#cms", label: "CMS Solutions" },
        { href: "#maintenance", label: "Maintenance & Support" },
        { href: "#seo", label: "SEO & Performance" }
      ];
  return (
    <div>
    <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
    <ul className="space-y-2">
      {services.map((service, index) => (
        <li key={index}>
          <a 
            href={service.href} 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
          >
            {service.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
  )
}

export default ServicesLinks