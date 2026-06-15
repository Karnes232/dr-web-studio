import { Clock, MapPin } from "lucide-react"
import React from "react"

const LocationInfo = ({
  title,
  location,
  description,
  localAdvantageTitle,
  localAdvantageDescription,
  emergencySupportTitle,
  emergencySupportDescription,
  language,
}: {
  title: string
  location: string
  description: string
  localAdvantageTitle: string
  localAdvantageDescription: string
  emergencySupportTitle: string
  emergencySupportDescription: string
  language: string
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-3" />
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h3>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {location}
          </h4>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {description}
          </p>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center text-orange-700 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="font-medium">{localAdvantageTitle}</span>
            </div>
            <p className="text-orange-700 text-sm">
              {localAdvantageDescription}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center mb-3">
            <Clock className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-2" />
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">
              {language === "en" ? "Business Hours" : "Horarios de Negocios"}
            </h4>
          </div>
          <div className="space-y-2 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>
                {language === "en" ? "Monday - Friday" : "Lunes - Viernes"}
              </span>
              <span className="font-medium">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>{language === "en" ? "Saturday" : "Sábado"}</span>
              <span className="font-medium">10:00 AM - 2:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>{language === "en" ? "Sunday" : "Domingo"}</span>
              <span className="font-medium">
                {language === "en" ? "Closed" : "Cerrado"}
              </span>
            </div>
          </div>
          {/* <p className="text-sm text-slate-500 mt-3">
            * Response times: WhatsApp within 1 hour, Email within 24 hours
          </p> */}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {emergencySupportTitle}
          </h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {emergencySupportDescription}
          </p>
        </div>
      </div>
    </div>
  )
}

export default LocationInfo
