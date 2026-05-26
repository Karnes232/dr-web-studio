// The Sanity Studio is excluded from the locale middleware and is not
// localized, so it gets its own English document shell. The root layout no
// longer renders <html>/<body>, so this route must provide them itself.
export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
