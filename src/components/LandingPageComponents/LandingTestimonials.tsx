import { Star, Quote } from "lucide-react"
import { Reveal } from "@/components/animation/Reveal"
import type { TestimonialItem } from "./types"

interface LandingTestimonialsProps {
  sectionTitle: string
  items: TestimonialItem[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating ? "text-amber-400 fill-amber-400" : "text-slate-600"
          }
        />
      ))}
    </div>
  )
}

export function LandingTestimonials({
  sectionTitle,
  items,
}: LandingTestimonialsProps) {
  if (!items.length) return null

  return (
    <section className="bg-slate-900 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-crimson-pro)" }}
          >
            {sectionTitle}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <Reveal
              key={i}
              delay={i * 0.1}
              className="relative bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:border-amber-500/30 transition-colors duration-300"
            >
              <Quote size={28} className="text-amber-500/30 mb-4" />
              <StarRating rating={item.rating} />
              <blockquote className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 font-bold text-sm">
                    {item.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {item.author}
                  </p>
                  <p className="text-slate-400 text-xs">{item.company}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
