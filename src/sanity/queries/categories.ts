import { client } from "../lib/client"

export const allCategoriesQuery = `
*[_type == "blogCategory"] | order(title.en asc) {
  title,
  slug,
  description
}`

export interface Category {
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
}

export async function getAllCategories(): Promise<Category[]> {
  return await client.fetch(allCategoriesQuery)
}

export const postsByCategoryQuery = `
*[_type == "blogPost" && references(*[_type == "blogCategory" && slug.current == $categorySlug]._id)] | order(publishedAt desc) {
  title,
  slug,
  description,
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
  readTime,
  tags,
  featured
}`

export async function getPostsByCategory(categorySlug: string) {
  return await client.fetch(postsByCategoryQuery, { categorySlug })
}

export const categoryWithPostsQuery = `
*[_type == "blogCategory" && slug.current == $slug][0] {
  title,
  slug,
  description,
  "posts": *[_type == "blogPost" && references(^._id)] | order(publishedAt desc) {
    title,
    slug,
    description,
    publishedAt,
    mainImage,
    "imageUrl": mainImage.asset->url,
    readTime,
    featured
  }
}`

export async function getCategoryWithPosts(slug: string) {
  return await client.fetch(categoryWithPostsQuery, { slug })
} 