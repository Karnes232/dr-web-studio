import { Crimson_Pro, Inter } from "next/font/google"

// Shared font definitions. Defined once here so every layout that renders a
// <body> (the localized layout, the studio shell, the 404) can apply the same
// CSS variables without re-initialising next/font in multiple files.
// `adjustFontFallback` (default true for next/font/google) auto-generates a
// size-adjusted fallback @font-face so the fallback → web-font swap shifts
// layout minimally. Kept explicit to document the CLS-conscious choice.
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-inter",
})

export const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
  variable: "--font-crimson-pro",
})
