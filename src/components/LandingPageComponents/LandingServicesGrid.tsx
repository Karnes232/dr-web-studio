import {
  Globe,
  ShoppingCart,
  Layout,
  Database,
  Wrench,
  TrendingUp,
  Code,
  Layers,
  Monitor,
  Smartphone,
  Zap,
  Search,
} from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Reveal } from "@/components/animation/Reveal"
import { RichText } from "./RichText"
import type { ServiceItem, PortableBlocks } from "./types"

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Globe,
  ShoppingCart,
  Layout,
  Database,
  Wrench,
  TrendingUp,
  Code,
  Layers,
  Monitor,
  Smartphone,
  Zap,
  Search,
}

interface LandingServicesGridProps {
  sectionTitle: string
  sectionSubtitle: PortableBlocks | string
  items: ServiceItem[]
  lang: "en" | "es"
}

export function LandingServicesGrid({
  sectionTitle,
  sectionSubtitle,
  items,
  lang,
}: LandingServicesGridProps) {
  return (
    <section className="bg-slate-50 dark:bg-slate-950 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            style={{ fontFamily: "var(--font-crimson-pro)" }}
          >
            {sectionTitle}
          </h2>
          <RichText
            value={sectionSubtitle}
            className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] ?? Globe
            const card = (
              <Reveal
                delay={i * 0.07}
                className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 flex items-center justify-center mb-6 transition-colors duration-200">
                  <Icon size={24} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <RichText
                  value={item.description}
                  linkMode="plain"
                  className="flex-1 text-slate-500 dark:text-slate-400 text-sm leading-relaxed"
                />
                {item.linkSlug && (
                  <div className="mt-6 text-amber-600 text-sm font-medium group-hover:text-amber-700 transition-colors">
                    {lang === "es" ? "Ver más →" : "Learn more →"}
                  </div>
                )}
              </Reveal>
            )

            return item.linkSlug ? (
              <Link
                key={i}
                // linkSlug is the English service slug from landing content.
                // next-intl localizes the prefix; for /es the slug stays English
                // and is 301'd to the Spanish slug (see next.config redirects).
                href={{
                  pathname: "/our-services/[slug]",
                  params: { slug: item.linkSlug },
                }}
                className="flex"
              >
                {card}
              </Link>
            ) : (
              <div key={i} className="flex">
                {card}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
