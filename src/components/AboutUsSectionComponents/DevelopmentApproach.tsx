import { Globe, Shield, Smartphone, Zap } from 'lucide-react';
import React from 'react'

const DevelopmentApproach = () => {
    const approaches = [
        {
          icon: Zap,
          title: "Fast & Optimized",
          description: "Lightning-fast websites that load in under 3 seconds and score 90+ on Google PageSpeed."
        },
        {
          icon: Smartphone,
          title: "Mobile-First Design",
          description: "Every website is designed for mobile devices first, ensuring perfect performance on all screens."
        },
        {
          icon: Shield,
          title: "SEO-Optimized",
          description: "Built with SEO best practices to help your business rank higher in Google search results."
        },
        {
          icon: Globe,
          title: "Reliable & Secure",
          description: "Secure, reliable websites with 99.9% uptime and regular backups to protect your business."
        }
      ];
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-slate-800 mb-6">My Development Approach</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {approaches.map((approach, index) => {
          const Icon = approach.icon;
          return (
            <div key={index} className="flex items-start space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Icon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">{approach.title}</h4>
                <p className="text-slate-600 text-sm">{approach.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default DevelopmentApproach