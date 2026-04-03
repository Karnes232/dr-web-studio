import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { fallbackLng, languages } from "./i18n/settings"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith("/studio")) {
    return NextResponse.next()
  }

  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
    return NextResponse.next()
  }

  const pathnameIsMissingLocale = languages.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${fallbackLng}${pathname}`, request.url),
    )
  }

  const locale =
    languages.find(
      l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`,
    ) || fallbackLng

  const response = NextResponse.next()
  response.headers.set("x-locale", locale)
  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|studio|sitemap.xml|robots.txt|mvfe1er9ft7d5qc7a67h5gcwqh9u6eu7.txt).*)",
  ],
}
