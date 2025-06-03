import React from 'react'
import { 
    Code, 
  } from 'lucide-react';
const TechStack = () => {
    const technologies = [
        { name: 'React', category: 'Frontend', color: 'bg-blue-100 text-blue-800' },
        { name: 'Next.js', category: 'Framework', color: 'bg-gray-100 text-gray-800' },
        { name: 'Gatsby', category: 'Static Sites', color: 'bg-purple-100 text-purple-800' },
        { name: 'Tailwind CSS', category: 'Styling', color: 'bg-cyan-100 text-cyan-800' },
        { name: 'Sanity CMS', category: 'Content', color: 'bg-red-100 text-red-800' },
        { name: 'Contentful', category: 'Headless CMS', color: 'bg-orange-100 text-orange-800' },
        { name: 'Shopify', category: 'E-commerce', color: 'bg-green-100 text-green-800' },
        { name: 'WordPress', category: 'CMS', color: 'bg-indigo-100 text-indigo-800' }
      ];
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
        <Code className="h-6 w-6 text-orange-500 mr-2" />
        Technologies & Tools
      </h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <span 
            key={index}
            className={`px-3 py-1 rounded-full text-sm font-medium ${tech.color}`}
          >
            {tech.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default TechStack