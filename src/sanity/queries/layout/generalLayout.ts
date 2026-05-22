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
  companyName,
  footerText {
    en,
    es
  },
  socialLinks {
    linkedin,
    github
  }
}`

export const getLogo = cache(async () => client.fetch(logoQuery))

export const getCompanyInfo = cache(async () =>
  client.fetch(companyInfoQuery),
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
