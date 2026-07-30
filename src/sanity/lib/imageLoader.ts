// Global next/image loader: srcset candidates point directly at cdn.sanity.io
// instead of the Vercel /_next/image optimizer. Cold optimizer misses paid a
// multi-second on-demand AVIF encode (the 6.7s mobile LCP on PageSpeed);
// Sanity's pipeline transforms cold widths in ~0.5s, caches them immutably on
// its global CDN, and auto=format serves WebP per-browser.
export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string {
  if (!src.startsWith("https://cdn.sanity.io/")) return src
  const url = new URL(src)
  // Sanity serves SVGs as-is; raster params would 400.
  if (url.pathname.endsWith(".svg")) return src

  // Preserve crop aspect for URLs built with .width().height().fit("crop")
  // (see src/sanity/lib/blogImageUrls.ts): rescale h proportionally.
  const w = url.searchParams.get("w")
  const h = url.searchParams.get("h")
  if (w && h) {
    url.searchParams.set(
      "h",
      String(Math.round((Number(h) / Number(w)) * width)),
    )
  }
  url.searchParams.set("w", String(width))
  url.searchParams.set("q", String(quality ?? 75))
  url.searchParams.set("auto", "format")
  if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max")
  return url.toString()
}
