import { client } from "../lib/client"

export const allBlogPostsQuery = `
*[_type == "blogPost"] | order(publishedAt desc) {
  title,
  slug,
  "author": author->{
    name,
    slug,
    image,
    "imageUrl": image.asset->url
  },
  "categories": categories[]-> {
    title,
    slug,
    description
  },
  publishedAt,
  mainImage,
  "imageUrl": mainImage.asset->url,
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
  imageUrl: string
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
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return await client.fetch(allBlogPostsQuery)
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
    "imageUrl": image.asset->url,
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
  "imageUrl": mainImage.asset->url,
  body,
  readTime,
  tags,
  featured,
  description
}`

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return await client.fetch(blogPostBySlugQuery, { slug })
} 