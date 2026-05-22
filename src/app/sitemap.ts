import { getAllBlogPostsSitemap } from "@/sanity/queries/blog/blog"
import { getServiceItemsSitemap } from "@/sanity/queries/services/serviceItem"
import type { MetadataRoute } from "next"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.dr-webstudio.com"
  const serviceItems = await getServiceItemsSitemap()
  const blogPosts = await getAllBlogPostsSitemap()

  const pages = [
    { url: `${baseUrl}/en`, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/es`, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/en/about-me`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/es/about-me`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/en/blog`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/es/blog`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/en/contact`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/es/contact`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/en/faqs`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/es/faqs`, lastModified: new Date(), priority: 0.8 },
    {
      url: `${baseUrl}/en/guia-completa-desarrollo-web-moderno-negocios`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/es/guia-completa-desarrollo-web-moderno-negocios`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/desarrollo-web-republica-dominicana`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/es/desarrollo-web-republica-dominicana`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/diseno-web-republica-dominicana`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/es/diseno-web-republica-dominicana`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/desarrollo-web-punta-cana`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/es/desarrollo-web-punta-cana`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/desarrollo-ecommerce-republica-dominicana`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/es/desarrollo-ecommerce-republica-dominicana`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/mantenimiento-web-republica-dominicana`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/es/mantenimiento-web-republica-dominicana`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/privacy-policy`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/es/privacy-policy`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/terms-of-service`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/es/terms-of-service`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/our-services`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/es/our-services`,
      lastModified: new Date(),
      priority: 0.8,
    },
    { url: `${baseUrl}/en/pricing`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/es/pricing`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/en/portfolio`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/es/portfolio`, lastModified: new Date(), priority: 0.8 },
    {
      url: `${baseUrl}/en/project-planner`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/es/project-planner`,
      lastModified: new Date(),
      priority: 0.8,
    },
    ...serviceItems.map(item => ({
      url: `${baseUrl}/en/our-services/${item.slug.current}`,
      lastModified: new Date(item._updatedAt),
      priority: 0.8,
    })),
    ...serviceItems.map(item => ({
      url: `${baseUrl}/es/our-services/${item.slug.current}`,
      lastModified: new Date(item._updatedAt),
      priority: 0.8,
    })),
    ...blogPosts.map(item => ({
      url: `${baseUrl}/en/blog/${item.slug.current}`,
      lastModified: new Date(item._updatedAt),
      priority: 0.8,
    })),
    ...blogPosts.map(item => ({
      url: `${baseUrl}/es/blog/${item.slug.current}`,
      lastModified: new Date(item._updatedAt),
      priority: 0.8,
    })),
  ]

  return pages.map(page => ({
    url: page.url,
    lastModified: page.lastModified,
    changeFrequency: "monthly",
    priority: page.priority,
  }))
}
