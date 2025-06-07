import { client } from "../lib/client"

export const seoSchema = `
*[_type == "seo" && pageName == $pageName][0] {
  structuredData {
    en,
    es
  }
}`

export interface seoSchemaData {
  structuredData: {
    en: string
    es: string
  }
}

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
    "image": image.asset->url
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
    image: string
  }
  structuredData: {
    en: string
    es: string
  }
  canonicalUrl?: string
  noIndex: boolean
  noFollow: boolean
}

export async function getSEO(pageName: string): Promise<SEOData | null> {
  return await client.fetch(seoQuery, { pageName })
}

export async function getSeoSchema(
  pageName: string,
): Promise<seoSchemaData | null> {
  return await client.fetch(seoSchema, { pageName })
}
