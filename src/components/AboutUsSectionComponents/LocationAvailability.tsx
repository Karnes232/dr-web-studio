import React from 'react'
import { 
    MapPin, 
    CheckCircle
  } from 'lucide-react';
const LocationAvailability = () => {
    const availabilityItems = [
        "Based in Dominican Republic (GMT-4 timezone)",
        "Available for local and international projects",
        "Fluent in Spanish and English",
        "Flexible hours to accommodate client needs"
      ];
  return (
    <div className="bg-slate-50 rounded-lg p-6 mb-6">
    <div className="flex items-center mb-4">
      <MapPin className="h-5 w-5 text-orange-500 mr-2" />
      <span className="font-semibold text-slate-800">Location & Availability</span>
    </div>
    <ul className="space-y-2 text-slate-600">
      {availabilityItems.map((item, index) => (
        <li key={index} className="flex items-center">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          {item}
        </li>
      ))}
    </ul>
  </div>
  )
}

export default LocationAvailability