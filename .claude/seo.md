# SEO Architecture

## Overview

Every page has a dedicated SEO document in Sanity (type `seo`, keyed by `pageName`). Pages pull this data in `generateMetadata()` and optionally inject a JSON-LD `<script>` tag. All metadata is bilingual (en/es).

---

## SEO Sanity Document

One `seo` document per page, identified by `pageName` (dropdown, not a slug).

**Registered page names** (from the schema dropdown):
`home`, `about`, `portfolio`, `pricing`, `contact`, `blog`, `services`, `project-planner`, `privacy-policy`, `terms-of-service`, `faqs`, `custom-payment`, `guia-completa-desarrollo-web-moderno-negocios`

**Fields**:
| Field | Type | Notes |
|---|---|---|
| `meta.en/es.title` | string | 50–60 chars, browser tab + search snippet |
| `meta.en/es.description` | text | 150–160 chars |
| `meta.en/es.keywords` | string[] | Optional |
| `openGraph.en/es.title` | string | Falls back to `meta.title` if empty |
| `openGraph.en/es.description` | text | Falls back to `meta.description` if empty |
| `openGraph.image` | image | Recommended 1200×630px |
| `structuredData.en` | text (JSON) | Raw JSON-LD string for English |
| `structuredData.es` | text (JSON) | Raw JSON-LD string for Spanish |
| `canonicalUrl` | string | Relative path appended to base URL |
| `noIndex` | boolean | Adds `robots: noindex` |
| `noFollow` | boolean | Adds `robots: nofollow` |

---

## Query Functions

Both live in `src/sanity/queries/seo.ts`:

```ts
// Full SEO data — use in generateMetadata()
getSEO(pageName: string): Promise<SEOData | null>

// Structured data only — use in the page component for JSON-LD
getSeoSchema(pageName: string): Promise<seoSchemaData | null>
```

`getSEO` and `getSeoSchema` are separate because `generateMetadata` runs independently of the page render — fetching only what each needs avoids double-fetching the full document.

---

## Page Implementation Pattern

Every page follows this pattern. Copy it exactly for new pages.

```ts
// 1. generateMetadata — fetches full SEO doc
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const seoData = await getSEO("home") // ← your pageName

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const canonicalUrl = seoData?.canonicalUrl
    ? `${baseUrl}/${lang}/${seoData.canonicalUrl}`
    : `${baseUrl}/${lang}`

  if (!seoData) return {}

  return {
    title: seoData.meta[lang]?.title,
    description: seoData.meta[lang]?.description,
    keywords: seoData.meta[lang]?.keywords.join(", "),
    openGraph: {
      title: seoData.openGraph[lang]?.title || seoData.meta[lang]?.title,
      description: seoData.openGraph[lang]?.description || seoData.meta[lang]?.description,
      url: canonicalUrl,
      type: "website",
      images: seoData.openGraph.image
        ? [{ url: seoData.openGraph.image.url, width: seoData.openGraph.image.width, height: seoData.openGraph.image.height }]
        : [],
    },
    robots: {
      index: !seoData.noIndex,
      follow: !seoData.noFollow,
    },
    twitter: {
      card: "summary_large_image",
      title: seoData.openGraph[lang]?.title || seoData.meta[lang]?.title,
      description: seoData.openGraph[lang]?.description || seoData.meta[lang]?.description,
      images: seoData.openGraph.image ? [seoData.openGraph.image.url] : [],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/your-page`,
        es: `${baseUrl}/es/your-page`,
        "x-default": `${baseUrl}/en/your-page`,
      },
    },
  }
}

// 2. Page component — fetches structured data for JSON-LD
export default async function MyPage({ params }: PageProps) {
  const { lang } = await params
  const [seoData, /* ...other queries */] = await Promise.all([
    getSeoSchema("home"),
    // ...
  ])

  return (
    <>
      {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )}
      <main>...</main>
    </>
  )
}
```

---

## hreflang Alternates

Every page's `generateMetadata()` must include `alternates.languages` with `en`, `es`, and `x-default` pointing to the English URL. This tells Google which locale variant to serve per region.

The `x-default` should always point to the English (`/en/...`) URL.

---

## Sitemap

`src/app/sitemap.ts` generates the XML sitemap dynamically. When adding a new page:

1. Add a static entry for both `/en/page` and `/es/page`.
2. For content-driven pages (blog, services), extend the dynamic queries in the file.

---

## Structured Data (JSON-LD)

JSON-LD is stored as raw JSON strings in Sanity (one per locale). The page renders them inline via `dangerouslySetInnerHTML`. The Sanity Studio validates that the field contains valid JSON before saving.

Common schemas used: `Organization`, `WebPage`, `BlogPosting`, `Service`, `FAQPage`.

---

## Analytics & Tracking

Loaded in root `src/app/layout.tsx` with `strategy="lazyOnload"` (does not block render):

- **Google Analytics 4**: Tag `G-Y3DMZHFV9Z`
- **Ahrefs Analytics**: `analytics.ahrefs.com/analytics.js`
- **Vercel Analytics**: `<Analytics />` component from `@vercel/analytics/next`
