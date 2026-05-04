import type { Metadata } from "next"
import { Crimson_Pro, Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { headers } from "next/headers"
import DeferredAnalytics from "@/components/Analytics/DeferredAnalytics"

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const lang = headersList.get("x-locale") || "en"

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className={`${crimsonPro.variable} ${inter.variable} antialiased`}>
        {children}
        <DeferredAnalytics />
        <Analytics />
      </body>
    </html>
  )
}
