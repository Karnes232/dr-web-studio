import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Run on everything except API routes, Next internals, the embedded Sanity
  // Studio, and static files (sitemap.xml, robots.txt, favicon, the Google
  // verification file, etc.).
  matcher: [
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|studio|sitemap.xml|robots.txt|mvfe1er9ft7d5qc7a67h5gcwqh9u6eu7.txt).*)",
  ],
}
