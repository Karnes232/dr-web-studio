import { getTranslations } from "next-intl/server"
import { getLayoutSchemaData } from "@/sanity/queries/layout/generalLayout"
import { LandingCta } from "./LandingCta"

interface LandingContactCtaProps {
  /** The landing page's hero slice (already locale-resolved by the query) —
   *  its CTA labels/hrefs are reused so the closing CTA stays consistent with
   *  the page's own copy. */
  hero: {
    primaryCta?: string | null
    primaryCtaHref?: string | null
    secondaryCta?: string | null
    secondaryCtaHref?: string | null
  }
  lang: "en" | "es"
}

/** Closing CTA for SEO landing pages: generic localized headline/subtext, the
 *  page's own hero CTA buttons, plus WhatsApp + click-to-call sourced from the
 *  `generalLayout` singleton. Server component so each page needs one line. */
export async function LandingContactCta({
  hero,
  lang,
}: LandingContactCtaProps) {
  const [t, layout] = await Promise.all([
    getTranslations(),
    getLayoutSchemaData(),
  ])
  const phone = layout?.telephone
  const contactHref = lang === "es" ? "/es/contacto" : "/en/contact"

  // Hero hrefs are stored unprefixed (e.g. "/contact"); prefix the locale so
  // the link stays in-language (legacy-slug redirects map e.g. /es/contact →
  // /es/contacto in one permanent hop).
  const localized = (href?: string | null) =>
    href && href.startsWith("/") && !/^\/(en|es)(\/|$)/.test(href)
      ? `/${lang}${href}`
      : (href ?? undefined)

  return (
    <LandingCta
      headline={t("landingPage.ctaHeadline")}
      subtext={t("landingPage.ctaSubtext")}
      primaryBtn={hero.primaryCta || t("resources.get_quote")}
      primaryBtnHref={localized(hero.primaryCtaHref) || contactHref}
      secondaryBtn={hero.secondaryCta || t("resources.start_project")}
      secondaryBtnHref={
        localized(hero.secondaryCtaHref) ||
        (lang === "es"
          ? "/es/planificador-de-proyectos"
          : "/en/project-planner")
      }
      whatsappNumber={phone}
      whatsappText={t("landingPage.whatsappMessage")}
      phone={phone}
      lang={lang}
    />
  )
}
