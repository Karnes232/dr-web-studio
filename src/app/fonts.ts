import { Crimson_Pro, Inter } from "next/font/google"

// Shared font definitions. Defined once here so every layout that renders a
// <body> (the localized layout, the studio shell, the 404) can apply the same
// CSS variables without re-initialising next/font in multiple files.
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-crimson-pro",
})
