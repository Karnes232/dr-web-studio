import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react"
import type { HeroData } from "./types"
import { Link } from "@/i18n/navigation"

interface PillarHeroProps {
  data: HeroData
  language?: "en" | "es"
}

// Server component: the headline is the LCP element, so it renders from the
// server HTML immediately (no framer-motion opacity:0 entrance gating it behind
// hydration). The mouse-follow gradient and scroll parallax were removed — they
// forced re-renders/reflows on every pointer/scroll event and did nothing on
// touch devices. Decorative blurred orbs are desktop-only to spare mobile GPUs.
export function PillarHero({ data, language = "es" }: PillarHeroProps) {
  const ctaText =
    language === "es" ? "Solicitar Auditoría Gratuita" : "Request Free Audit"

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Static ambient gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 30%, rgba(249, 115, 22, 0.25) 0%, transparent 50%)`,
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid pattern (desktop only) */}
      <div className="hidden md:block absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Floating orbs — desktop only (blur-3xl is costly to paint on mobile) */}
      <div className="hidden md:block absolute top-20 left-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-orange-500/20 to-yellow-500/20 blur-3xl" />
      <div className="hidden md:block absolute bottom-20 right-[15%] w-96 h-96 rounded-full bg-gradient-to-br from-teal-500/20 to-teal-400/20 blur-3xl" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 lg:backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-white/90">
                {data.lastUpdated} • {data.readingTime}
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center text-white mb-6 leading-[1.1] text-balance">
            {data.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-300 text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            {data.subheadline}
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mb-16">
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-slate-950 font-semibold text-lg overflow-hidden shadow-2xl shadow-orange-500/30 transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">{ctaText}</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
            {data.stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator (desktop only, CSS bounce) */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>
    </section>
  )
}

// Stat Card — hover effects are pure CSS now (no framer-motion / hover state).
function StatCard({
  stat,
  index,
}: {
  stat: { value: string; label: string }
  index: number
}) {
  const icons = [TrendingUp, Zap, Sparkles]
  const Icon = icons[index % icons.length]

  return (
    <div className="group relative">
      {/* Card background with gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

      <div className="relative h-full p-8 rounded-2xl bg-white/5 border border-white/10 lg:backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-white/20">
        {/* Icon */}
        <div className="relative z-10 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-yellow-500/20 mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
          <Icon className="w-6 h-6 text-orange-400" />
        </div>

        {/* Value */}
        <div className="relative z-10 text-5xl md:text-6xl font-bold mb-2 text-white">
          {stat.value}
        </div>

        {/* Label */}
        <p className="relative z-10 text-slate-300 text-sm md:text-base leading-snug">
          {stat.label}
        </p>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  )
}

export default PillarHero
