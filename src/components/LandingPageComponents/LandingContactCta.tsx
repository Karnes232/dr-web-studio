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

  // Hero hrefs arrive fully localized from transformLandingPage
  // (e.g. "/es/contacto") — no prefixing or redirect hop here.
  return (
    <LandingCta
      headline={t("landingPage.ctaHeadline")}
      subtext={t("landingPage.ctaSubtext")}
      primaryBtn={hero.primaryCta || t("resources.get_quote")}
      primaryBtnHref={hero.primaryCtaHref || contactHref}
      secondaryBtn={hero.secondaryCta || t("resources.start_project")}
      secondaryBtnHref={
        hero.secondaryCtaHref ||
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
