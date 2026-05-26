import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dr-webstudio.com"),
}

// Pass-through root layout. The <html>/<body> document shell is rendered by the
// descendant that knows the locale — `(root)/[lang]/layout.tsx` for public pages,
// and `studio/layout.tsx` / `not-found.tsx` for the non-localized routes — so the
// `lang` attribute is correct server-side per route.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
