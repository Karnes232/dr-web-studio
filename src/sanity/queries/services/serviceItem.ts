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

export async function getServiceItems(): Promise<ServiceItem[]> {
  return client.fetch(serviceItemsQuery)
}

const serviceItemIndividualQuery = `*[_type == "serviceItem" && slug.current == $slug][0] {
  _id,
  title,
  slug,
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

export async function getServiceItemBySlug(
  slug: string,
): Promise<ServiceItemIndividual | null> {
  return client.fetch(serviceItemIndividualQuery, { slug })
}

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
    image?: string
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
  slug
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
}

export async function getServiceItemsLinks(): Promise<ServiceItemsLinks[]> {
  return client.fetch(serviceItemsLinksQuery)
}

const serviceItemSEOQuery = `*[_type == "serviceItem" && slug.current == $slug][0] {
  _id,
  title,
  slug,
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

export interface ServiceItemSEOData {
  _id: string
  title: {
    en: string
    es: string
  }
  slug: {
    current: string
  }
  seo?: ServiceItemSEO
}

export async function getServiceItemSEO(
  slug: string,
): Promise<ServiceItemSEOData | null> {
  return client.fetch(serviceItemSEOQuery, { slug })
}

const serviceItemsWithSEOQuery = `*[_type == "serviceItem"] {
  _id,
  title,
  slug,
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

export async function getServiceItemsWithSEO(): Promise<ServiceItemWithSEO[]> {
  return client.fetch(serviceItemsWithSEOQuery)
}
