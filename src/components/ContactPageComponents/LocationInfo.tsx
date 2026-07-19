import { Clock, MapPin, Phone } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import React from "react"
import { telHref, waHref } from "@/lib/contact"

const LocationInfo = ({
  title,
  location,
  description,
  localAdvantageTitle,
  localAdvantageDescription,
  emergencySupportTitle,
  emergencySupportDescription,
  language,
  phone,
}: {
  title: string
  location: string
  description: string
  localAdvantageTitle: string
  localAdvantageDescription: string
  emergencySupportTitle: string
  emergencySupportDescription: string
  language: string
  phone?: string
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-3" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {location}
          </h3>
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

        {phone && (
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
              {language === "en"
                ? "Talk to us directly"
                : "Háblanos directamente"}
            </h3>
            <div className="space-y-2">
              <a
                href={waHref(
                  phone,
                  language === "en"
                    ? "Hi! I'm interested in a website for my business."
                    : "¡Hola! Me interesa un sitio web para mi negocio.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                <FaWhatsapp className="h-5 w-5 mr-2 text-green-600 dark:text-green-500" />
                <span>
                  {language === "en"
                    ? "Chat on WhatsApp"
                    : "Escríbenos por WhatsApp"}
                </span>
              </a>
              <a
                href={telHref(phone)}
                className="flex items-center text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
                <span>{phone}</span>
              </a>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center mb-3">
            <Clock className="h-5 w-5 text-slate-600 dark:text-slate-400 mr-2" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              {language === "en" ? "Business Hours" : "Horarios de Negocios"}
            </h3>
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
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {emergencySupportTitle}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {emergencySupportDescription}
          </p>
        </div>
      </div>
    </div>
  )
}

export default LocationInfo
