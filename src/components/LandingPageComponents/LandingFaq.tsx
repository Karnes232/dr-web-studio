"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { RichText } from "./RichText"
import type { FaqItem, PortableBlocks } from "./types"

interface LandingFaqProps {
  sectionTitle: string
  sectionSubtitle: PortableBlocks | string
  items: FaqItem[]
  bgColor?: string
}

function FaqAccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-slate-100 dark:border-slate-700 last:border-0">
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-slate-900 dark:text-white font-medium group-hover:text-amber-600 transition-colors">
          {item.question}
        </span>
        <span className="flex-shrink-0 w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 group-hover:border-amber-300 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/10 flex items-center justify-center transition-all duration-200">
          {open ? (
            <Minus size={14} className="text-amber-600" />
          ) : (
            <Plus
              size={14}
              className="text-slate-400 group-hover:text-amber-600"
            />
          )}
        </span>
      </button>
      {/* Always rendered (collapsed via CSS) so the answer ships in SSR HTML. */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <RichText
            value={item.answer}
            className="pb-5 text-slate-500 dark:text-slate-400 leading-relaxed text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export function LandingFaq({
  sectionTitle,
  sectionSubtitle,
  items,
  bgColor,
}: LandingFaqProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  if (!items.length) return null

  return (
    <section
      className={`${bgColor ? bgColor : "bg-white dark:bg-slate-900"} py-24 px-6`}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            style={{ fontFamily: "var(--font-crimson-pro)" }}
          >
            {sectionTitle}
          </h2>
          <RichText
            value={sectionSubtitle}
            className="text-lg text-slate-500 dark:text-slate-400"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${bgColor ? bgColor : "bg-slate-50 dark:bg-slate-900"} rounded-2xl px-8 py-2`}
        >
          {items.map((item, i) => (
            <FaqAccordionItem key={i} item={item} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
