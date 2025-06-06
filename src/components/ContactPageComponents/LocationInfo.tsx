import { Clock, MapPin } from 'lucide-react'
import React from 'react'

const LocationInfo = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <MapPin className="h-6 w-6 text-orange-500 mr-3" />
        <h3 className="text-2xl font-bold text-slate-800">Location & Hours</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-slate-800 mb-2">Based in Dominican Republic</h4>
          <p className="text-slate-600 mb-4">
            Serving clients locally and internationally. We specialize in creating websites 
            for businesses in the Caribbean and Latin America.
          </p>
          
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center text-orange-700 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="font-medium">Local Advantage</span>
            </div>
            <p className="text-orange-600 text-sm">
              Same timezone, cultural understanding, and bilingual support (Spanish/English)
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center mb-3">
            <Clock className="h-5 w-5 text-slate-600 mr-2" />
            <h4 className="font-semibold text-slate-800">Business Hours</h4>
          </div>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Monday - Friday</span>
              <span className="font-medium">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday</span>
              <span className="font-medium">10:00 AM - 2:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday</span>
              <span className="font-medium">Closed</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-3">
            * Response times: WhatsApp within 1 hour, Email within 24 hours
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 mb-2">Emergency Support</h4>
          <p className="text-slate-600 text-sm">
            For urgent website issues with existing clients, emergency support is available 24/7. 
            Contact us via WhatsApp with "URGENT" in your message.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LocationInfo