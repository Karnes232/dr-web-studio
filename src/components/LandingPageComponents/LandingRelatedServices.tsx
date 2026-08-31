import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
import {
  RELATED_LANDING_PAGES,
  RELATED_LANDING_COPY,
  type RelatedLandingRoute,
} from "@/lib/indexableRoutes"
import type { Locale } from "@/lib/slugs"

interface LandingRelatedServicesProps {
  /** The current landing page's route (pathname key). */
  currentRoute: RelatedLandingRoute
  lang: Locale
}

/** Cross-links between the national "desarrollo" and "diseño" landing pages.
 *  Both were competing for each other's queries while being reachable only via
 *  /sitemap; the descriptive anchor text here is what separates them. */
export function LandingRelatedServices({
  currentRoute,
  lang,
}: LandingRelatedServicesProps) {
  const related = RELATED_LANDING_PAGES[currentRoute]
  if (!related?.length) return null

  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-6 text-center">
          {lang === "es"
            ? "También te puede interesar"
            : "You might also be looking for"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {related.map(route => {
            const copy = RELATED_LANDING_COPY[route][lang]
            return (
              <Link
                key={route}
                href={route}
                className="group block p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-400 transition-colors duration-200"
              >
                <span className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {copy.label}
                  <ArrowRight
                    size={16}
                    className="text-amber-500 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
                <span className="mt-2 block text-sm text-slate-600 dark:text-slate-400">
                  {copy.blurb}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
