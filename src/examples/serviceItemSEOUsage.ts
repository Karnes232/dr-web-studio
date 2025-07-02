import { 
  getServiceItems, 
  getServiceItemsWithSEO, 
  getServiceItemBySlug, 
  getServiceItemSEO,
  type ServiceItemWithSEO,
  type ServiceItemSEOData 
} from "@/sanity/queries/services/serviceItem"
import { Metadata } from "next"

/**
 * Example usage of Service Item SEO queries
 * 
 * This file demonstrates how to use the SEO queries in different scenarios
 */

// Example 1: Generate metadata for a service item page
export async function generateServiceItemMetadata(
  slug: string, 
  lang: "en" | "es"
): Promise<Metadata> {
  const serviceSEO = await getServiceItemSEO(slug)
  
  if (!serviceSEO) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found."
    }
  }

  // Use SEO data if available, otherwise fall back to basic service data
  const metaTitle = serviceSEO.seo?.meta[lang]?.title || serviceSEO.title[lang]
  const metaDescription = serviceSEO.seo?.meta[lang]?.description || ""
  const ogTitle = serviceSEO.seo?.openGraph[lang]?.title || metaTitle
  const ogDescription = serviceSEO.seo?.openGraph[lang]?.description || metaDescription

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: serviceSEO.seo?.meta[lang]?.keywords,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: serviceSEO.seo?.openGraph.image ? [serviceSEO.seo.openGraph.image] : [],
    },
    robots: {
      index: !serviceSEO.seo?.noIndex,
      follow: !serviceSEO.seo?.noFollow,
    },
    ...(serviceSEO.seo?.canonicalUrl && { canonical: serviceSEO.seo.canonicalUrl }),
    alternates: {
      canonical: serviceSEO.seo?.canonicalUrl,
    },
  }
}

// Example 2: Generate sitemap data for service items
export async function generateServiceItemsSitemap() {
  const servicesWithSEO = await getServiceItemsWithSEO()
  
  return servicesWithSEO
    .filter(service => !service.seo?.noIndex) // Exclude no-index services
    .map(service => ({
      url: `/our-services/${service.slug.current}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      // Add SEO data for sitemap
      title: service.seo?.meta.en?.title || service.title.en,
      description: service.seo?.meta.en?.description || service.description.en,
    }))
}

// Example 3: Get structured data for a service item
export async function getServiceItemStructuredData(slug: string, lang: "en" | "es") {
  const service = await getServiceItemBySlug(slug)
  
  if (!service) return null

  // If custom structured data is provided, use it
  if (service.seo?.structuredData?.[lang]) {
    try {
      return JSON.parse(service.seo.structuredData[lang])
    } catch (error) {
      console.error('Invalid JSON in structured data:', error)
    }
  }

  // Otherwise, generate default structured data
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title[lang],
    "description": service.description[lang],
    "provider": {
      "@type": "Organization",
      "name": "Your Company Name"
    },
    "areaServed": "Worldwide",
    "serviceType": service.categories.map(cat => cat.name[lang]).join(", "),
    "url": `https://yoursite.com/our-services/${service.slug.current}`,
    ...(service.seo?.canonicalUrl && { "sameAs": service.seo.canonicalUrl })
  }
}

// Example 4: Get all services for SEO analysis
export async function getServicesForSEOAnalysis() {
  const servicesWithSEO = await getServiceItemsWithSEO()
  
  return servicesWithSEO.map(service => ({
    slug: service.slug.current,
    title: service.title,
    hasSEOTitle: !!service.seo?.meta.en?.title && !!service.seo?.meta.es?.title,
    hasSEODescription: !!service.seo?.meta.en?.description && !!service.seo?.meta.es?.description,
    hasKeywords: !!service.seo?.meta.en?.keywords?.length || !!service.seo?.meta.es?.keywords?.length,
    hasOpenGraph: !!service.seo?.openGraph.en?.title || !!service.seo?.openGraph.es?.title,
    hasStructuredData: !!service.seo?.structuredData?.en || !!service.seo?.structuredData?.es,
    isNoIndex: service.seo?.noIndex || false,
    isNoFollow: service.seo?.noFollow || false,
    hasCanonicalUrl: !!service.seo?.canonicalUrl,
  }))
}

// Example 5: Validate SEO data completeness
export function validateServiceItemSEO(service: ServiceItemWithSEO) {
  const issues: string[] = []
  
  if (!service.seo) {
    issues.push("No SEO data configured")
    return issues
  }

  // Check English SEO
  if (!service.seo.meta.en?.title) {
    issues.push("Missing English meta title")
  }
  if (!service.seo.meta.en?.description) {
    issues.push("Missing English meta description")
  }
  if (!service.seo.meta.en?.keywords?.length) {
    issues.push("Missing English keywords")
  }

  // Check Spanish SEO
  if (!service.seo.meta.es?.title) {
    issues.push("Missing Spanish meta title")
  }
  if (!service.seo.meta.es?.description) {
    issues.push("Missing Spanish meta description")
  }
  if (!service.seo.meta.es?.keywords?.length) {
    issues.push("Missing Spanish keywords")
  }

  // Check OpenGraph
  if (!service.seo.openGraph.image) {
    issues.push("Missing OpenGraph image")
  }

  return issues
}

// Example 6: Get services by category with SEO
export async function getServicesByCategoryWithSEO(categorySlug: string) {
  const servicesWithSEO = await getServiceItemsWithSEO()
  
  return servicesWithSEO.filter(service => 
    service.categories.some(cat => cat.slug.current === categorySlug)
  )
}

// Example 7: Generate breadcrumb structured data
export async function generateServiceBreadcrumbData(slug: string, lang: "en" | "es") {
  const service = await getServiceItemBySlug(slug)
  
  if (!service) return null

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": lang === "en" ? "Home" : "Inicio",
        "item": "https://yoursite.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": lang === "en" ? "Services" : "Servicios",
        "item": "https://yoursite.com/our-services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": service.title[lang],
        "item": `https://yoursite.com/our-services/${service.slug.current}`
      }
    ]
  }
} 