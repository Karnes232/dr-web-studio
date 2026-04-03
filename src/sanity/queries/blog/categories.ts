import { blogListingImageUrl } from "../../lib/blogImageUrls"
import { client } from "../../lib/client"

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
    image
  },
  "categories": categories[]-> {
    title,
    slug,
    description
  },
  publishedAt,
  mainImage,
  readTime,
  tags,
  featured
}`

export async function getPostsByCategory(categorySlug: string) {
  const posts = await client.fetch(postsByCategoryQuery, { categorySlug })
  return posts.map((post: { mainImage?: unknown }) => ({
    ...post,
    imageUrl: blogListingImageUrl(post.mainImage),
  }))
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
    readTime,
    featured
  }
}`

export async function getCategoryWithPosts(slug: string) {
  const data = await client.fetch(categoryWithPostsQuery, { slug })
  if (!data?.posts?.length) return data
  return {
    ...data,
    posts: data.posts.map((post: { mainImage?: unknown }) => ({
      ...post,
      imageUrl: blogListingImageUrl(post.mainImage),
    })),
  }
}
