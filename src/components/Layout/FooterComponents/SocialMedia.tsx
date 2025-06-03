import React from 'react'
import { 
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Github,
  } from 'lucide-react';
const SocialMedia = () => {
    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Github, href: "#", label: "GitHub" }
      ];
  return (
    <div className="mt-8">
    <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
    <div className="flex space-x-4">
      {socialLinks.map((social, index) => {
        const Icon = social.icon;
        return (
          <a
            key={index}
            href={social.href}
            className="bg-slate-700 p-3 rounded-full text-gray-300 hover:bg-orange-500 hover:text-white transition-all duration-200 transform hover:scale-110"
            aria-label={social.label}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  </div>
  )
}

export default SocialMedia