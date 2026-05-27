import { getAllBlogPosts } from "@/sanity/queries/blog/blog"
import { getAllServiceItemsFull } from "@/sanity/queries/services/serviceItem"
import { getFaqs } from "@/sanity/queries/faqs/faqs"
import { getSEO } from "@/sanity/queries/seo"
import { localizedUrl } from "@/lib/urls"
import { slugPair } from "@/lib/slugs"
import { portableTextToMarkdown } from "@/lib/portableTextToMarkdown"
import { SITE_URL } from "@/lib/site"
import type { Locale } from "@/lib/slugs"

const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  es: "Español",
}

const FALLBACK_SUMMARY: Record<Locale, string> = {
  en:
    "DR Web Studio is a freelance web development studio building fast, modern, " +
    "multilingual websites and web apps for businesses in the Dominican Republic.",
  es:
    "DR Web Studio es un estudio freelance de desarrollo web que crea sitios y " +
    "aplicaciones web rápidos, modernos y multilingües para empresas en la República Dominicana.",
}

// Intro line pointing to the other language's full file + the index.
const CROSS_LINKS: Record<Locale, string> = {
  en: `Spanish version: ${SITE_URL}/llms-full-es.txt — Index: ${SITE_URL}/llms.txt`,
  es: `Versión en inglés: ${SITE_URL}/llms-full.txt — Índice: ${SITE_URL}/llms.txt`,
}

const HEADINGS: Record<
  Locale,
  { services: string; faqs: string; blog: string }
> = {
  en: { services: "Services", faqs: "FAQs", blog: "Blog" },
  es: {
    services: "Servicios",
    faqs: "Preguntas Frecuentes",
    blog: "Blog",
  },
}

/** Builds the full Markdown content of /llms-full.txt for a single locale. */
export async function buildLlmsFull(locale: Locale): Promise<string> {
  const [home, services, faqs, posts] = await Promise.all([
    getSEO("home"),
    getAllServiceItemsFull(),
    getFaqs(),
    getAllBlogPosts(),
  ])

  const summary = (
    home?.meta[locale].description ?? FALLBACK_SUMMARY[locale]
  ).trim()
  const labels = HEADINGS[locale]

  const sections: string[] = [
    `# DR Web Studio — Full Content (${LOCALE_LABEL[locale]})\n\n> ${summary}\n\n${CROSS_LINKS[locale]}`,
  ]

  // Services
  if (services.length > 0) {
    const items = services.map(service => {
      const url = localizedUrl(
        {
          pathname: "/our-services/[slug]",
          params: { slug: slugPair(service)[locale] },
        },
        locale,
      )
      const body = portableTextToMarkdown(
        service.pageContent?.mainDescription?.[locale],
      )
      return [
        `### ${service.title[locale]}`,
        service.description[locale],
        url,
        body,
      ]
        .filter(Boolean)
        .join("\n\n")
    })
    sections.push([`## ${labels.services}`, ...items].join("\n\n"))
  }

  // FAQs
  if (faqs.categories.length > 0) {
    const cats = faqs.categories.map(category => {
      const qa = category.questions
        .map(q => `**${q.question[locale]}**\n\n${q.answer[locale]}`)
        .join("\n\n")
      return [`### ${category.title[locale]}`, qa].filter(Boolean).join("\n\n")
    })
    sections.push([`## ${labels.faqs}`, ...cats].join("\n\n"))
  }

  // Blog (already ordered by publishedAt desc)
  if (posts.length > 0) {
    const articles = posts.map(post => {
      const url = localizedUrl(
        { pathname: "/blog/[slug]", params: { slug: slugPair(post)[locale] } },
        locale,
      )
      const body = portableTextToMarkdown(post.body[locale])
      return [`### ${post.title[locale]}`, post.description[locale], url, body]
        .filter(Boolean)
        .join("\n\n")
    })
    // Separate posts with a horizontal rule for readability.
    sections.push(`## ${labels.blog}\n\n` + articles.join("\n\n---\n\n"))
  }

  return sections.join("\n\n") + "\n"
}
