"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { waHref } from "@/lib/contact"

interface LandingCtaProps {
  headline: string
  subtext: string
  primaryBtn: string
  primaryBtnHref: string
  secondaryBtn: string
  secondaryBtnHref: string
  whatsappNumber?: string
  /** Prefilled, already-localized wa.me message. */
  whatsappText?: string
  phone?: string
  lang: "en" | "es"
}

export function LandingCta({
  headline,
  subtext,
  primaryBtn,
  primaryBtnHref,
  secondaryBtn,
  secondaryBtnHref,
  whatsappNumber,
  whatsappText,
  phone,
  lang,
}: LandingCtaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const whatsappHref = whatsappNumber
    ? waHref(whatsappNumber, whatsappText)
    : undefined

  return (
    <section className="relative bg-slate-950 py-28 px-6 overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(201,150,58,0.4) 0%, transparent 70%)`,
        }}
      />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          style={{ fontFamily: "var(--font-crimson-pro)" }}
        >
          {headline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto"
        >
          {subtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <Link
            href={primaryBtnHref}
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-0.5"
          >
            {primaryBtn}
            <ArrowRight size={18} />
          </Link>
          <Link
            href={secondaryBtnHref}
            className="inline-flex items-center gap-2 px-8 py-4 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-200"
          >
            {secondaryBtn}
          </Link>
        </motion.div>

        {/* Contact options */}
        {(whatsappHref || phone) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-slate-800"
          >
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors text-sm"
              >
                <FaWhatsapp size={16} />
                <span>WhatsApp</span>
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <Phone size={16} />
                <span>{phone}</span>
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
