import { slugForLocale, type Locale } from "@/lib/slugs"
import type { ServiceItemsLinks } from "@/sanity/queries/services/serviceItem"

/** Locale-resolved service link for the chrome (header/footer): the client
 *  islands receive only the active language's title + slug instead of the
 *  dual-locale Sanity shape. */
export interface LocalizedServiceLink {
  _id: string
  title: string
  slug: string
}

export function localizeServiceLinks(
  links: ServiceItemsLinks[],
  lang: Locale,
): LocalizedServiceLink[] {
  return links.map(s => ({
    _id: s._id,
    title: s.title[lang],
    slug: slugForLocale(s, lang),
  }))
}
