import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import { urlFor } from "./image"

function isImageSource(
  source: unknown,
): source is SanityImageSource & { asset?: unknown } {
  return Boolean(
    source &&
      typeof source === "object" &&
      "asset" in source &&
      (source as { asset?: unknown }).asset,
  )
}

/** Grid cards, related posts, category listings (~3-col / swiper). */
export function blogListingImageUrl(source: unknown): string {
  if (!isImageSource(source)) return ""
  return urlFor(source)
    .width(1000)
    .height(667)
    .fit("crop")
    .auto("format")
    .quality(82)
    .url()
}

/** Single post hero (max-w-4xl content width, retina). */
export function blogHeroImageUrl(source: unknown): string {
  if (!isImageSource(source)) return ""
  return urlFor(source)
    .width(1280)
    .height(720)
    .fit("crop")
    .auto("format")
    .quality(85)
    .url()
}

export function blogAuthorAvatarUrl(source: unknown): string {
  if (!isImageSource(source)) return ""
  return urlFor(source)
    .width(128)
    .height(128)
    .fit("crop")
    .auto("format")
    .quality(80)
    .url()
}

/** Open Graph / Twitter card (recommended ~1200×630). */
export function blogOgImageUrl(source: unknown): string {
  if (!isImageSource(source)) return ""
  return urlFor(source)
    .width(1200)
    .height(630)
    .fit("crop")
    .auto("format")
    .quality(85)
    .url()
}
