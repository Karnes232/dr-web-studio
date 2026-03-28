import type { Metadata } from "next"
import { Crimson_Pro, Inter } from "next/font/google"
import "../globals.css"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-Y3DMZHFV9Z`}
        strategy="lazyOnload"
      />
      <script
        src="https://analytics.ahrefs.com/analytics.js"
        data-key="1+Xtrpxb01gBoWyKHrpzhQ"
        async
      ></script>
      <Script id="ga-setup" strategy="lazyOnload">
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y3DMZHFV9Z');
            `}
      </Script>
      <body className={`${crimsonPro.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
      <Analytics />
    </html>
  )
}
