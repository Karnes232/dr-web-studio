import type { Metadata } from "next"
import { Crimson_Pro, Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { headers } from "next/headers"

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
    <html lang={lang}>
      <body className={`${crimsonPro.variable} ${inter.variable} antialiased`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y3DMZHFV9Z"
          strategy="lazyOnload"
        />
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="1+Xtrpxb01gBoWyKHrpzhQ"
          strategy="lazyOnload"
        />
        <Script id="ga-setup" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y3DMZHFV9Z');
          `}
        </Script>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
