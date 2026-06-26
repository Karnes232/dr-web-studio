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

// Social cards want 1.91:1; the Sanity source is square (3200×3200), which
// Facebook/LinkedIn/X center-crop unpredictably. Serve a deterministic
// 1200×630 crop via Sanity's CDN transform params instead.
const OG_WIDTH = 1200
const OG_HEIGHT = 630

function socialImage(
  img?: SEOData["openGraph"]["image"],
): SEOData["openGraph"]["image"] | undefined {
  if (!img?.url) return img
  const base = img.url.split("?")[0]
  return {
    ...img,
    url: `${base}?w=${OG_WIDTH}&h=${OG_HEIGHT}&fit=crop&auto=format`,
    width: OG_WIDTH,
    height: OG_HEIGHT,
  }
}

/** Trim a localized {title, description, ...} block's description in place. */
function trimDescription<T extends { description?: string }>(block?: T): T | undefined {
  if (!block || typeof block.description !== "string") return block
  return { ...block, description: block.description.trim() }
}

/** Normalize raw Sanity SEO: trim stray whitespace and produce a social OG image. */
function normalizeSEO(data: SEOData): SEOData {
  return {
    ...data,
    meta: {
      ...data.meta,
      en: trimDescription(data.meta?.en) as SEOData["meta"]["en"],
      es: trimDescription(data.meta?.es) as SEOData["meta"]["es"],
    },
    openGraph: {
      ...data.openGraph,
      en: trimDescription(data.openGraph?.en) as SEOData["openGraph"]["en"],
      es: trimDescription(data.openGraph?.es) as SEOData["openGraph"]["es"],
      image: socialImage(data.openGraph?.image) as SEOData["openGraph"]["image"],
    },
  }
}

export const getSEO = cache(
  async (pageName: string): Promise<SEOData | null> => {
    const data = await client.fetch<SEOData | null>(seoQuery, { pageName })
    return data ? normalizeSEO(data) : null
  },
)
