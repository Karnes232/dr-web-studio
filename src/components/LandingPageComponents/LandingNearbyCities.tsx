import { Link } from "@/i18n/navigation"
import { MapPin } from "lucide-react"
import {
  CITY_ADJACENCY,
  CITY_NAMES,
  type CityPageRoute,
} from "@/lib/indexableRoutes"

interface LandingNearbyCitiesProps {
  /** The current city page's route (pathname key). */
  currentRoute: CityPageRoute
  lang: "en" | "es"
}

/** Cross-links between neighboring city pages — city pages were orphaned from
 *  each other, and internal links are the top local organic ranking factor. */
export function LandingNearbyCities({
  currentRoute,
  lang,
}: LandingNearbyCitiesProps) {
  const nearby = CITY_ADJACENCY[currentRoute]
  if (!nearby?.length) return null

  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-6">
          {lang === "es"
            ? "También diseñamos páginas web en"
            : "We also design websites in"}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {nearby.map(route => (
            <Link
              key={route}
              href={route}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
            >
              <MapPin size={14} className="text-amber-500" />
              {CITY_NAMES[route]}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
