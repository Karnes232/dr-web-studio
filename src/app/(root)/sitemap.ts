import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://www.webdev-solutions.com"

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
        { url: `${baseUrl}/en/privacy-policy`, lastModified: new Date(), priority: 0.8 },
        { url: `${baseUrl}/es/privacy-policy`, lastModified: new Date(), priority: 0.8 },
        { url: `${baseUrl}/en/terms-of-service`, lastModified: new Date(), priority: 0.8 },
        { url: `${baseUrl}/es/terms-of-service`, lastModified: new Date(), priority: 0.8 },
        { url: `${baseUrl}/en/our-services`, lastModified: new Date(), priority: 0.8 },
        { url: `${baseUrl}/es/our-services`, lastModified: new Date(), priority: 0.8 },
        { url: `${baseUrl}/en/pricing`, lastModified: new Date(), priority: 0.8 },
        { url: `${baseUrl}/es/pricing`, lastModified: new Date(), priority: 0.8 },
        { url: `${baseUrl}/en/portfolio`, lastModified: new Date(), priority: 0.8 },
        { url: `${baseUrl}/es/portfolio`, lastModified: new Date(), priority: 0.8 },
        { url: `${baseUrl}/en/project-planner`, lastModified: new Date(), priority: 0.8 },
        { url: `${baseUrl}/es/project-planner`, lastModified: new Date(), priority: 0.8 },


    ]

    return pages.map((page) => ({
        url: page.url,
        lastModified: page.lastModified,
        changeFrequency: "monthly",
        priority: page.priority,
    }))
}