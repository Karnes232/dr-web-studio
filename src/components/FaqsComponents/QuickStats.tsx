import { Clock, Globe, Shield, Users } from "lucide-react"
import React from "react"

const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
        <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
        <div className="text-2xl font-bold text-gray-900">1-4</div>
        <div className="text-sm text-gray-600">Weeks Average</div>
      </div>
      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
        <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
        <div className="text-2xl font-bold text-gray-900">50+</div>
        <div className="text-sm text-gray-600">Happy Clients</div>
      </div>
      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
        <Globe className="h-8 w-8 text-teal-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-gray-900">2</div>
        <div className="text-sm text-gray-600">Languages</div>
      </div>
      <div className="bg-white rounded-lg p-4 text-center shadow-sm">
        <Shield className="h-8 w-8 text-amber-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-gray-900">24/7</div>
        <div className="text-sm text-gray-600">Support</div>
      </div>
    </div>
  )
}

export default QuickStats
