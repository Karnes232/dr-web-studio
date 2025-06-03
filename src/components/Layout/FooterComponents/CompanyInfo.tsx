import React from 'react'
import { 
    MapPin, 
    Mail, 
    MessageCircle, 
    Calendar,
  } from 'lucide-react';
import FooterLogo from './FooterLogo';
const CompanyInfo = () => {
  return (
    <div className="lg:col-span-2">
    <FooterLogo />
    <p className="text-gray-300 mb-6 max-w-md">
      Professional website development for businesses in the Dominican Republic. 
      We create custom websites that look great, load fast, and grow your business.
    </p>
    
    {/* Contact Info */}
    <div className="space-y-3">
      <div className="flex items-center text-gray-300">
        <MapPin className="h-5 w-5 text-orange-400 mr-3" />
        <span>Dominican Republic</span>
      </div>
      <div className="flex items-center text-gray-300">
        <Mail className="h-5 w-5 text-orange-400 mr-3" />
        <a href="mailto:info@drwebstudio.com" className="hover:text-orange-400 transition-colors">
          info@drwebstudio.com
        </a>
      </div>
      <div className="flex items-center text-gray-300">
        <MessageCircle className="h-5 w-5 text-orange-400 mr-3" />
        <a href="https://wa.me/18091234567" className="hover:text-orange-400 transition-colors">
          WhatsApp
        </a>
      </div>
      <div className="flex items-center text-gray-300">
        <Calendar className="h-5 w-5 text-orange-400 mr-3" />
        <a href="#" className="hover:text-orange-400 transition-colors">
          Schedule a Call
        </a>
      </div>
    </div>
  </div>
  )
}

export default CompanyInfo