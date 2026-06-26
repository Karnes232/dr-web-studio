import type { MetadataRoute } from "next"

// Crawlers that power AI *search* surfaces — explicitly welcomed so the site
// can be cited in ChatGPT search, Claude, Perplexity, and Google AI features.
const AI_SEARCH_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
]

// Training-only / bulk-scrape crawlers that add no search visibility — denied.
const TRAINING_BOTS = ["CCBot", "anthropic-ai", "cohere-ai", "Applebot-Extended"]

const DISALLOW = ["/studio/", "/api/"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_SEARCH_BOTS, allow: "/", disallow: DISALLOW },
      { userAgent: TRAINING_BOTS, disallow: "/" },
      { userAgent: "*", allow: "/", disallow: DISALLOW },
    ],
    sitemap: "https://www.dr-webstudio.com/sitemap.xml",
  }
}
