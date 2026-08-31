import Link from "next/link"
import { ArrowRight, Phone, MessageCircle } from "lucide-react"
import { Reveal } from "@/components/animation/Reveal"
import TrackedLink from "@/components/Analytics/TrackedLink"
import { telHref, waHref } from "@/lib/contact"

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
  const whatsappHref = whatsappNumber
    ? waHref(whatsappNumber, whatsappText)
    : undefined

  return (
    <section className="relative bg-slate-950 py-28 px-6 overflow-hidden">
      {/* Background accent */}
      <div
        className="hidden md:block absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(201,150,58,0.4) 0%, transparent 70%)`,
        }}
      />

      <Reveal className="relative z-10 max-w-4xl mx-auto text-center">
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          style={{ fontFamily: "var(--font-crimson-pro)" }}
        >
          {headline}
        </h2>

        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
          {subtext}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
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
        </div>

        {/* Contact options */}
        {(whatsappHref || phone) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-slate-800">
            {whatsappHref && (
              <TrackedLink
                event="contact_whatsapp"
                eventParams={{ location: "landing_cta", lang }}
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-colors text-sm"
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </TrackedLink>
            )}
            {phone && (
              <TrackedLink
                event="contact_phone"
                eventParams={{ location: "landing_cta", lang }}
                href={telHref(phone)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <Phone size={16} />
                <span>{phone}</span>
              </TrackedLink>
            )}
          </div>
        )}
      </Reveal>
    </section>
  )
}
