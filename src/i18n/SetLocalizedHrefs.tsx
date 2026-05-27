"use client"

import { useEffect } from "react"
import { setLocalizedHrefs } from "./localizedSlugs"

/**
 * Publishes a detail page's per-locale slugs to the language switcher so it can
 * switch to the target locale's slug instead of reusing the current one. Renders
 * nothing; clears the published value on unmount. Takes primitive props so its
 * effect deps stay stable across re-renders.
 */
export default function SetLocalizedHrefs({
  pathname,
  enSlug,
  esSlug,
}: {
  pathname: string
  enSlug: string
  esSlug: string
}) {
  useEffect(() => {
    setLocalizedHrefs({
      en: { pathname, params: { slug: enSlug } },
      es: { pathname, params: { slug: esSlug } },
    })
    return () => setLocalizedHrefs(null)
  }, [pathname, enSlug, esSlug])

  return null
}
