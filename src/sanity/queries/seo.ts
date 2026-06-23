import { cache } from "react"
import { client } from "../lib/client"

export const seoQuery = `
*[_type == "seo" && pageName == $pageName][0] {
  pageName,
  // Meta information
  meta {
    en {
      title,
      description,
      keywords
    },
    es {
      title,
      description,
      keywords
    }
  },
  // Open Graph data
  openGraph {
    en {
      title,
      description
    },
    es {
      title,
      description
    },
    "image": {
      "url": image.asset->url,
      "alt": image.alt,
      "width": image.asset->metadata.dimensions.width,
      "height": image.asset->metadata.dimensions.height
    }
  },
  // Structured Data (JSON-LD)
  structuredData {
    en,
    es
  },
  // Other SEO settings
  canonicalUrl,
  noIndex,
  noFollow
}`

export interface SEOData {
  pageName: string
  meta: {
    en: {
      title: string
      description: string
      keywords: string[]
    }
    es: {
      title: string
      description: string
      keywords: string[]
    }
  }
  openGraph: {
    en: {
      title: string
      description: string
    }
    es: {
      title: string
      description: string
    }
    image: {
      url: string
      alt?: string
      width?: number
      height?: number
    }
  }
  structuredData: {
    en: string
    es: string
  }
  canonicalUrl?: string
  noIndex: boolean
  noFollow: boolean
}

export const getSEO = cache(
  async (pageName: string): Promise<SEOData | null> => {
    return await client.fetch(seoQuery, { pageName })
  },
)
