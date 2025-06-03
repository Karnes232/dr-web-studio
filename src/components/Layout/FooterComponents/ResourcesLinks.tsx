import React from 'react'
import { 
    ExternalLink
  } from 'lucide-react';
const ResourcesLinks = () => {
    const resources = [
        { href: "#questionnaire", label: "Website Questionnaire" },
        { href: "#quote", label: "Get Free Quote" },
        { href: "#case-studies", label: "Case Studies" },
        { href: "#testimonials", label: "Client Reviews" },
        { href: "#faq", label: "FAQ" },
        { href: "#privacy", label: "Privacy Policy" }
      ];
  return (
    <div>
    <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
    <ul className="space-y-2">
      {resources.map((resource, index) => (
        <li key={index}>
          <a 
            href={resource.href} 
            className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center"
          >
            {resource.label}
            {(resource.href === "#questionnaire" || resource.href === "#quote") && (
              <ExternalLink className="h-3 w-3 ml-1" />
            )}
          </a>
        </li>
      ))}
    </ul>
  </div>
  )
}

export default ResourcesLinks