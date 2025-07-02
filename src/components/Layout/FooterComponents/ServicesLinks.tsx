"use client"
import { useLocale } from "@/i18n/useLocale"
import { ServiceItemsLinks } from "@/sanity/queries/services/serviceItem"
import Link from "next/link"
import React from "react"

const ServicesLinks = ({
  serviceLinks,
}: {
  serviceLinks: ServiceItemsLinks[]
}) => {
  const { currentLocale, t, getLocalizedPath } = useLocale()
  const services = [
    {
      href: getLocalizedPath("/our-services"),
      label: t("services.custom_websites"),
    },
    { href: getLocalizedPath("/our-services"), label: t("services.ecommerce") },
    {
      href: getLocalizedPath("/our-services"),
      label: t("services.landing_pages"),
    },
    { href: getLocalizedPath("/our-services"), label: t("services.cms") },
    {
      href: getLocalizedPath("/our-services"),
      label: t("services.maintenance"),
    },
    { href: getLocalizedPath("/our-services"), label: t("services.seo") },
  ]
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
      <ul className="space-y-2">
        {serviceLinks.map((service, index) => (
          <li key={service._id}>
            <Link
              href={getLocalizedPath(`/our-services/${service.slug.current}`)}
              className="text-gray-300 hover:text-orange-400 transition-colors duration-200 line-clamp-2"
            >
              {service.title[currentLocale as keyof typeof service.title]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ServicesLinks
