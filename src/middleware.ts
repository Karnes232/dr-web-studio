import createMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  // For the root `/` requested by a client with no locale signal — no
  // NEXT_LOCALE cookie and a wildcard/absent Accept-Language, which is the
  // signature of crawlers — issue a cacheable 308 to the default locale
  // (`/${routing.defaultLocale}`). This consolidates the redirect (and link
  // equity) onto one URL instead of re-running next-intl's uncacheable 307 on
  // every crawl. Real browsers send a concrete Accept-Language and fall
  // through to per-visitor locale negotiation below.
  if (request.nextUrl.pathname === "/") {
    const hasLocaleCookie = request.cookies.has("NEXT_LOCALE")
    const acceptLanguage = request.headers.get("accept-language")?.trim()
    const noLocaleSignal =
      !hasLocaleCookie && (!acceptLanguage || acceptLanguage === "*")
    if (noLocaleSignal) {
      const url = new URL(`/${routing.defaultLocale}`, request.url)
      const response = NextResponse.redirect(url, 308)
      response.headers.set("Vary", "Accept-Language, Cookie")
      return response
    }
  }

  const response = intlMiddleware(request)
  // The root response is content-negotiated (Accept-Language + NEXT_LOCALE
  // cookie pick the redirect target), so caches must key on both.
  if (request.nextUrl.pathname === "/") {
    response.headers.append("Vary", "Accept-Language, Cookie")
  }
  return response
}

export const config = {
  // Run on everything except API routes, Next internals, the embedded Sanity
  // Studio, and any path with a file extension. Files must bypass the locale
  // middleware or it redirects them to a 404 (e.g. /data/x.csv → /es/data/x.csv).
  // This used to be an explicit list of filenames, which silently missed
  // manifest.json, the app icons and /data/*. No page route or blog slug
  // contains a dot, so excluding dotted paths is safe.
  matcher: ["/((?!api|_next|_vercel|studio|.*\\..*).*)"],
}
