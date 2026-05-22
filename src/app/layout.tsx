import type { Metadata } from "next"
import { Crimson_Pro, Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import DeferredAnalytics from "@/components/Analytics/DeferredAnalytics"
import HtmlLangSync from "@/components/Layout/HtmlLangSync"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-crimson-pro",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dr-webstudio.com"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className={`${crimsonPro.variable} ${inter.variable} antialiased`}>
        <HtmlLangSync />
        {children}
        <DeferredAnalytics />
        <Analytics />
      </body>
    </html>
  )
}
