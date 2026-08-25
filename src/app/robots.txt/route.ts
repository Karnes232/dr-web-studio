const SITE = "https://www.dr-webstudio.com"

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
const TRAINING_BOTS = [
  "CCBot",
  "anthropic-ai",
  "cohere-ai",
  "Applebot-Extended",
]

// No trailing slashes: `/studio/` would not match the bare `/studio` path,
// leaving the Studio SPA's infinite-depth catch-all crawlable.
const DISALLOW = ["/studio", "/api"]

// Pointers to the llms.txt family. These are comments, not directives: no
// robots.txt field exists for llms.txt and no crawler is known to read them.
// They sit above the first record because a comment *inside* a group can trip
// naive parsers. Discovery still works the normal way, via the well-known path.
const LLMS_FILES: [label: string, path: string][] = [
  ["llms.txt", "/llms.txt"],
  ["llms-full.txt (EN)", "/llms-full.txt"],
  ["llms-full.txt (ES)", "/llms-full-es.txt"],
]

/** One robots.txt record: N user-agent lines, then the rules that apply to them. */
function group(
  userAgents: string[],
  { allow, disallow }: { allow?: string; disallow?: string[] },
): string {
  return [
    ...userAgents.map(ua => `User-Agent: ${ua}`),
    ...(allow ? [`Allow: ${allow}`] : []),
    ...(disallow ?? []).map(path => `Disallow: ${path}`),
  ].join("\n")
}

function buildRobotsTxt(): string {
  const header = LLMS_FILES.map(([label, path]) => `# ${label}: ${SITE}${path}`)

  const groups = [
    group(AI_SEARCH_BOTS, { allow: "/", disallow: DISALLOW }),
    group(TRAINING_BOTS, { disallow: ["/"] }),
    group(["*"], { allow: "/", disallow: DISALLOW }),
  ]

  return `${header.join("\n")}\n\n${groups.join("\n\n")}\n\nSitemap: ${SITE}/sitemap.xml\n`
}

// Statically generated at build time, like the MetadataRoute.Robots file it
// replaced. Hand-rendering the text is what buys us the comment lines above —
// Next's typed robots API can only emit rules/sitemap/host.
export const dynamic = "force-static"

export function GET(): Response {
  return new Response(buildRobotsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
