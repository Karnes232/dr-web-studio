import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Run on everything except API routes, Next internals, the embedded Sanity
  // Studio, and static/generated files (sitemap.xml, robots.txt, llms.txt,
  // favicon, the Google verification file, etc.). These must be excluded so the
  // locale middleware doesn't redirect e.g. /llms.txt → /en/llms.txt.
  matcher: [
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|studio|sitemap.xml|robots.txt|llms.txt|llms-full.txt|llms-full-es.txt|mvfe1er9ft7d5qc7a67h5gcwqh9u6eu7.txt).*)",
  ],
}
