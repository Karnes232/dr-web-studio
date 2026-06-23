import { cache } from "react"
import { client } from "@/sanity/lib/client"

/**
 * Service Item SEO Queries
 *
 * This file provides queries to fetch service items with their SEO data.
 *
 * Available functions:
 * - getServiceItems(): Get all service items (basic data only)
 * - getServiceItemsWithSEO(): Get all service items with SEO data
 * - getServiceItemBySlug(slug): Get individual service item with full content and SEO
 * - getServiceItemSEO(slug): Get only SEO data for a specific service item
 *
 * SEO Data includes:
 * - Meta titles and descriptions (English & Spanish)
 * - Keywords
 * - OpenGraph data for social sharing
 * - Structured data (JSON-LD)
 * - Canonical URLs
 * - No-index and no-follow settings
 *
 * Usage example:
 * ```typescript
 * // For metadata generation in pages
 * const serviceSEO = await getServiceItemSEO(slug)
 * const metaTitle = serviceSEO.seo?.meta[lang]?.title || serviceSEO.title[lang]
 *
 * // For full service data with SEO
 * const service = await getServiceItemBySlug(slug)
 * const structuredData = service.seo?.structuredData[lang]
 * ```
 */

export interface ServiceItem {
  _id: string
  title: {
    en: string
    es: string
  }
  slug: string
  description: {
    en: string
    es: string
  }
  iconName: string
  categories: {
    _id: string
    name: {
      en: string
      es: string
    }
    slug: {
      current: string
    }
  }[]
  priceRange: string
  timeline: string
  features: string
  benefits: {
    en: string
    es: string
  }[]
}

const serviceItemsQuery = `*[_type == "serviceItem"] {
  _id,
  title,
  slug,
  slugEs,
  description,
  iconName,
  "categories": categories[]-> {
    _id,
    name,
    slug
  },
  priceRange,
  timeline,
  features,
  benefits
}`

export const getServiceItems = cache(async (): Promise<ServiceItem[]> => {
  return client.fetch(serviceItemsQuery)
})

const serviceItemIndividualQuery = `*[_type == "serviceItem" && (slug.current == $slug || slugEs.current == $slug)][0] {
  _id,
  title,
  slug,
  slugEs,
  description,
  "categories": categories[]-> {
    _id,
    name,
  },
  timeline,
  pageContent {
    mainDescription,
    beforeState,
    afterState,
    benefits {
      title,
      description,
      benefits {
        title,
        description
      }[]
    },
    features {
      title,
      description,
      standardFeatures {
        name,
        description
      }[],
      optionalFeatures {
        name,
        description,
        price
      }[],
      
    },
      steps {
        title,
        description,
        duration
      }[],
      faqs {
        question,
        answer
      }[],

  },
  seo {
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
    structuredData {
      en,
      es
    },
    canonicalUrl,
    noIndex,
    noFollow
  }
}`

export const getServiceItemBySlug = cache(
  async (slug: string): Promise<ServiceItemIndividual | null> => {
    return client.fetch(serviceItemIndividualQuery, { slug })
  },
)

export interface ServiceItemSEO {
  meta: {
    en: {
      title?: string
      description?: string
      keywords?: string[]
    }
    es: {
      title?: string
      description?: string
      keywords?: string[]
    }
  }
  openGraph: {
    en: {
      title?: string
      description?: string
    }
    es: {
      title?: string
      description?: string
    }
    image: {
      url: string
      alt?: string
      width?: number
      height?: number
    }
  }
  structuredData: {
    en?: string
    es?: string
  }
  canonicalUrl?: string
  noIndex?: boolean
  noFollow?: boolean
}

export interface ServiceItemIndividual {
  _id: string
  title: {
    en: string
    es: string
  }
  slug: string
  slugEs?: {
    current: string
  }
  description: {
    en: string
    es: string
  }
  categories: {
    _id: string
    name: {
      en: string
      es: string
    }
  }[]
  timeline: string
  pageContent: {
    mainDescription: {
      en: string
      es: string
    }
    beforeState: {
      en: string
      es: string
    }[]
    afterState: {
      en: string
      es: string
    }[]
    benefits: {
      title: {
        en: string
        es: string
      }
      description: {
        en: string
        es: string
      }
      benefits: {
        title: {
          en: string
          es: string
        }
        description: {
          en: string
          es: string
        }
      }[]
    }
    features: {
      title: {
        en: string
        es: string
      }
      description: {
        en: string
        es: string
      }
      standardFeatures: {
        name: {
          en: string
          es: string
        }
        description: {
          en: string
          es: string
        }
      }[]
      optionalFeatures: {
        name: {
          en: string
          es: string
        }
        description: {
          en: string
          es: string
        }
        price: number
      }[]
    }
    steps: {
      title: {
        en: string
        es: string
      }
      description: {
        en: string
        es: string
      }
      duration: {
        en: string
        es: string
      }
    }[]
    faqs: {
      question: {
        en: string
        es: string
      }
      answer: {
        en: string
        es: string
      }
    }[]
  }
  seo?: ServiceItemSEO
}

const serviceItemsLinksQuery = `*[_type == "serviceItem"] {
_id,
  title,
  slug,
  slugEs
}`

export interface ServiceItemsLinks {
  _id: string
  title: {
    en: string
    es: string
  }
  slug: {
    current: string
  }
  slugEs?: {
    current: string
  }
}

export const getServiceItemsLinks = cache(
  async (): Promise<ServiceItemsLinks[]> => {
    return client.fetch(serviceItemsLinksQuery)
  },
)

const serviceItemSEOQuery = `*[_type == "serviceItem" && (slug.current == $slug || slugEs.current == $slug)][0] {
  _id,
  title,
  slug,
  slugEs,
  seo {
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
    structuredData {
      en,
      es
    },
    canonicalUrl,
    noIndex,
    noFollow
  }
}`

export interface ServiceItemSEOData {
  _id: string
  title: {
    en: string
    es: string
  }
  slug: {
    current: string
  }
  slugEs?: {
    current: string
  }
  seo?: ServiceItemSEO
}

export const getServiceItemSEO = cache(
  async (slug: string): Promise<ServiceItemSEOData | null> => {
    return client.fetch(serviceItemSEOQuery, { slug })
  },
)

const serviceItemsWithSEOQuery = `*[_type == "serviceItem"] {
  _id,
  title,
  slug,
  slugEs,
  description,
  iconName,
  "categories": categories[]-> {
    _id,
    name,
    slug
  },
  priceRange,
  timeline,
  features,
  benefits,
  seo {
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
    structuredData {
      en,
      es
    },
    canonicalUrl,
    noIndex,
    noFollow
  }
}`

export interface ServiceItemWithSEO extends ServiceItem {
  seo?: ServiceItemSEO
}

export const getServiceItemsWithSEO = cache(
  async (): Promise<ServiceItemWithSEO[]> => {
    return client.fetch(serviceItemsWithSEOQuery)
  },
)

const serviceItemsSitemapQuery = `*[_type == "serviceItem"] {
  _id,
  title,
  slug,
  slugEs,
  _updatedAt
}`

export interface ServiceItemsSitemap {
  _id: string
  title: {
    en: string
    es: string
  }
  slug: {
    current: string
  }
  slugEs?: {
    current: string
  }
  _updatedAt: string
}

export const getServiceItemsSitemap = cache(
  async (): Promise<ServiceItemsSitemap[]> => {
    return client.fetch(serviceItemsSitemapQuery)
  },
)

// Minimal projection for building the Organization OfferCatalog JSON-LD.
const serviceOffersQuery = `*[_type == "serviceItem"] {
  title,
  description,
  slug,
  slugEs
}`

export interface ServiceOffer {
  title: { en: string; es: string }
  description?: { en: string; es: string }
  slug: { current: string }
  slugEs?: { current: string } | null
}

export const getServiceOffers = cache(async (): Promise<ServiceOffer[]> => {
  return client.fetch(serviceOffersQuery)
})

// All services with their full localized body — used by the /llms-full.txt
// routes to inline complete service descriptions (one query, not N per-slug).
const allServiceItemsFullQuery = `*[_type == "serviceItem"] {
  title,
  slug,
  slugEs,
  description,
  pageContent {
    mainDescription
  }
}`

export interface ServiceItemFull {
  title: {
    en: string
    es: string
  }
  slug: {
    current: string
  }
  slugEs?: {
    current: string
  }
  description: {
    en: string
    es: string
  }
  pageContent?: {
    mainDescription?: {
      en: unknown[]
      es: unknown[]
    }
  }
}

export const getAllServiceItemsFull = cache(
  async (): Promise<ServiceItemFull[]> => {
    return client.fetch(allServiceItemsFullQuery)
  },
)
