import {
  Globe,
  Languages,
  Clock,
  Rocket,
  Check,
  Shield,
  Heart,
  Users,
  Star,
  Award,
  Lightbulb,
  MessageCircle,
} from "lucide-react"
import { Reveal } from "@/components/animation/Reveal"
import { RichText } from "./RichText"
import type { WhyUsItem, PortableBlocks } from "./types"

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Globe,
  Languages,
  Clock,
  Rocket,
  Check,
  Shield,
  Heart,
  Users,
  Star,
  Award,
  Lightbulb,
  MessageCircle,
}

interface LandingWhyUsProps {
  sectionTitle: string
  sectionSubtitle: PortableBlocks | string
  items: WhyUsItem[]
}

export function LandingWhyUs({
  sectionTitle,
  sectionSubtitle,
  items,
}: LandingWhyUsProps) {
  return (
    <section className="bg-slate-950 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-crimson-pro)" }}
          >
            {sectionTitle}
          </h2>
          <RichText
            value={sectionSubtitle}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          />
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = ICON_MAP[item.icon] ?? Check
            return (
              <Reveal
                key={i}
                delay={i * 0.1}
                className="group relative bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-amber-500/40 hover:bg-slate-900 transition-all duration-300"
              >
                {/* Gold top border accent on hover */}
                <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/60 transition-all duration-300" />

                <div className="w-12 h-12 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 flex items-center justify-center mb-6 transition-colors duration-200">
                  <Icon size={22} className="text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <RichText
                  value={item.description}
                  className="text-slate-400 text-sm leading-relaxed"
                />
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
