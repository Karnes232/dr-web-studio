import { client } from "@/sanity/lib/client"

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
      }[]
    }
  }
}`

export async function getServiceItemBySlug(
  slug: string,
): Promise<ServiceItemIndividual | null> {
  return client.fetch(serviceItemIndividualQuery, { slug })
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
  }
}
