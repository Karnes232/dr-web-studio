import {
  blogAuthorAvatarUrl,
  blogHeroImageUrl,
  blogListingImageUrl,
  blogOgImageUrl,
} from "../../lib/blogImageUrls"
import { client } from "../../lib/client"

export const allBlogPostsQuery = `
*[_type == "blogPost"] | order(publishedAt desc) {
  title,
  slug,
  "author": author->{
    name,
    slug,
    image
  },
  "categories": categories[]-> {
    title,
    slug,
    description
  },
  publishedAt,
  mainImage,
  body,
  readTime,
  tags,
  featured,
  description
}`

export interface BlogPost {
  title: {
    en: string
    es: string
  }
  slug: {
    current: string
  }
  author: {
    name: string
    slug: {
      current: string
    }
    image: any
    imageUrl: string
  }
  categories: Array<{
    title: {
      en: string
      es: string
    }
    slug: {
      current: string
    }
    description: {
      en: string
      es: string
    }
  }>
  publishedAt: string
  mainImage: any
  imageUrl?: string
  body: {
    en: any[]
    es: any[]
  }
  readTime: number
  tags: {
    en: string[]
    es: string[]
  }
  featured: boolean
  description: {
    en: string
    es: string
  }
  seo: {
    structuredData: {
      en: string
      es: string
    }
  }
}

function mapBlogPostListItem(post: BlogPost): BlogPost {
  return {
    ...post,
    imageUrl: blogListingImageUrl(post.mainImage),
    author: post.author
      ? {
          ...post.author,
          imageUrl: blogAuthorAvatarUrl(post.author.image),
        }
      : post.author,
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await client.fetch(allBlogPostsQuery)
  return posts.map(mapBlogPostListItem)
}

// Query for fetching a single blog post by slug
export const blogPostBySlugQuery = `
*[_type == "blogPost" && slug.current == $slug][0] {
  title,
  slug,
  "author": author->{
    name,
    slug,
    image,
    bio,
    socialLinks
  },
  "categories": categories[]-> {
    title,
    slug,
    description
  },
  publishedAt,
  mainImage,
  body,
  readTime,
  tags,
  featured,
  description,
  seo {
    structuredData {
      en,
      es
    }
  }
}`

function mapBlogPostFull(post: BlogPost | null): BlogPost | null {
  if (!post) return null
  return {
    ...post,
    imageUrl: blogHeroImageUrl(post.mainImage),
    author: post.author
      ? {
          ...post.author,
          imageUrl: blogAuthorAvatarUrl(post.author.image),
        }
      : post.author,
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const post = await client.fetch(blogPostBySlugQuery, { slug })
  return mapBlogPostFull(post)
}

const relatedBlogPostsQuery = `
*[_type == "blogPost" && slug.current != $currentSlug && (
  count($categorySlugs) == 0 ||
  count((categories[]->slug.current)[@ in $categorySlugs]) > 0
)] | order(publishedAt desc)[0...$limit] {
  title,
  slug,
  "categories": categories[]-> {
    title,
    slug,
    description
  },
  publishedAt,
  mainImage,
  readTime,
  tags,
  description
}
`

export async function getRelatedBlogPosts(
  currentSlug: string,
  categorySlugs: string[],
  limit = 3,
): Promise<BlogPost[]> {
  const posts = await client.fetch(relatedBlogPostsQuery, {
    currentSlug,
    categorySlugs: categorySlugs ?? [],
    limit,
  })
  return posts.map(mapBlogPostListItem)
}

interface BlogPostSEO {
  title: string
  publishedAt?: string
  _updatedAt?: string
  author?: { name: string }
  seo: {
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
    canonicalUrl: string
    noIndex: boolean
    noFollow: boolean
  }
}

const blogPostBySlugQuerySeo = `
*[_type == "blogPost" && slug.current == $slug][0] {
  title,
  publishedAt,
  _updatedAt,
  author-> { name },
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
      "image": image {
        asset,
        crop,
        hotspot,
        alt
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

export async function getBlogPostSEO(
  slug: string,
): Promise<BlogPostSEO | null> {
  const data = await client.fetch(blogPostBySlugQuerySeo, { slug })
  if (!data) return null
  const rawImage = data.seo?.openGraph?.image as
    | { asset?: unknown; alt?: string }
    | undefined
  if (rawImage?.asset && data.seo?.openGraph) {
    const url = blogOgImageUrl(rawImage)
    if (url) {
      data.seo.openGraph.image = {
        url,
        alt: rawImage.alt,
        width: 1200,
        height: 630,
      }
    }
  }
  return data
}

export const allBlogPostsSitemapQuery = `
*[_type == "blogPost"] {
  title,
  slug,
  _updatedAt
}`

export interface BlogPostSitemap {
  title: {
    en: string
    es: string
  }
  slug: {
    current: string
  }
  _updatedAt: string
}

export async function getAllBlogPostsSitemap(): Promise<BlogPostSitemap[]> {
  return await client.fetch(allBlogPostsSitemapQuery)
}
