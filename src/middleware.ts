import createMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  // For the root `/` requested by a client with no locale signal — no
  // NEXT_LOCALE cookie and a wildcard/absent Accept-Language, which is the
  // signature of crawlers — issue a cacheable 308 to the default locale. This
  // consolidates the redirect (and link equity) onto /en instead of re-running
  // next-intl's uncacheable 307 on every crawl. Real browsers send a concrete
  // Accept-Language and fall through to per-visitor locale negotiation below.
  if (request.nextUrl.pathname === "/") {
    const hasLocaleCookie = request.cookies.has("NEXT_LOCALE")
    const acceptLanguage = request.headers.get("accept-language")?.trim()
    const noLocaleSignal =
      !hasLocaleCookie && (!acceptLanguage || acceptLanguage === "*")
    if (noLocaleSignal) {
      const url = new URL(`/${routing.defaultLocale}`, request.url)
      return NextResponse.redirect(url, 308)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  // Run on everything except API routes, Next internals, the embedded Sanity
  // Studio, and static/generated files (sitemap.xml, robots.txt, llms.txt,
  // favicon, the Google verification file, etc.). These must be excluded so the
  // locale middleware doesn't redirect e.g. /llms.txt → /en/llms.txt.
  matcher: [
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|studio|sitemap.xml|robots.txt|llms.txt|llms-full.txt|llms-full-es.txt|indexnow-key.txt|mvfe1er9ft7d5qc7a67h5gcwqh9u6eu7.txt).*)",
  ],
}
