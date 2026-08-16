import { cache } from "react"
import { unstable_cache } from "next/cache"
import { client } from "@/sanity/lib/client"

const logoQuery = `*[_type == "generalLayout"][0] {
  logo {
    asset->{
      url,
      metadata {
        dimensions,
        lqip,
        palette
      }
    },
    alt,
    hotspot,
    crop
  },
  footerLogo {
    asset->{
      url,
      metadata {
        dimensions,
        lqip,
        palette
      }
    },
    alt,
    hotspot,
    crop
  },
  companyName
}`

const companyInfoQuery = `*[_type == "generalLayout"][0] {
  email,
  telephone,
  companyName,
  footerText {
    en,
    es
  },
  socialLinks {
    linkedin,
    github,
    googleBusiness,
    trustpilot
  }
}`

export const getLogo = cache(async () => client.fetch(logoQuery))

export const getCompanyInfo = cache(async () => client.fetch(companyInfoQuery))

// Everything the schema.org builders (src/lib/schema) need from the singleton:
// the NAP, logo, and both the personal (Person) and company (Organization)
// social links. Single source of truth for site-wide structured data.
const layoutSchemaQuery = `*[_type == "generalLayout"][0] {
  companyName,
  email,
  telephone,
  "logo": logo.asset->url,
  address {
    streetAddress,
    addressLocality,
    addressRegion,
    postalCode,
    addressCountry
  },
  geo {
    latitude,
    longitude
  },
  openingHours[] {
    dayOfWeek,
    opens,
    closes
  },
  socialLinks {
    github,
    linkedin,
    linkedinCompany,
    googleBusiness,
    trustpilot,
    clutch,
    instagram,
    facebook
  }
}`

export interface LayoutSchemaData {
  companyName?: string
  email?: string
  telephone?: string
  logo?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  geo?: {
    latitude?: number
    longitude?: number
  }
  openingHours?: {
    dayOfWeek?: string[]
    opens?: string
    closes?: string
  }[]
  socialLinks?: {
    github?: string
    linkedin?: string
    linkedinCompany?: string
    googleBusiness?: string
    trustpilot?: string
    clutch?: string
    instagram?: string
    facebook?: string
  }
}

export const getLayoutSchemaData = cache(
  async (): Promise<LayoutSchemaData | null> => client.fetch(layoutSchemaQuery),
)

const contactEmailQuery = `*[_type == "generalLayout"][0] { email }`

export const getContactEmail = unstable_cache(
  async (): Promise<string | null> => {
    const result = await client.fetch<{ email?: string } | null>(
      contactEmailQuery,
    )
    return result?.email ?? null
  },
  ["contact-email"],
  { revalidate: 3600, tags: ["generalLayout"] },
)
