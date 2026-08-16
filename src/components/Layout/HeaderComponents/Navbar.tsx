import React from "react"
import Logo from "./Logo"
import NavbarShell from "./NavbarShell"
import CTAButtons from "./CTAButtons"
import DesktopNavigation from "./DesktopNavigation"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import ThemeToggle from "@/components/theme/ThemeToggle"
import { localizeServiceLinks } from "@/components/Layout/chrome"
import type { ServiceItemsLinks } from "@/sanity/queries/services/serviceItem"
import type { Locale } from "@/lib/slugs"

// Server component: all static chrome (logo, nav links, CTAs) renders on the
// server; only the open/close state lives in the NavbarShell client island.
const Navbar = ({
  logo,
  serviceLinks,
  phone,
  lang,
}: {
  logo: any
  serviceLinks: ServiceItemsLinks[]
  phone?: string
  lang: Locale
}) => {
  const services = localizeServiceLinks(serviceLinks, lang)

  return (
    <NavbarShell
      logo={<Logo logo={logo} />}
      desktopNav={<DesktopNavigation services={services} lang={lang} />}
      desktopControls={
        <>
          <ThemeToggle color="slate-700" />
          <LanguageSwitcher color="slate-700" />
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>
          <CTAButtons phone={phone} lang={lang} />
        </>
      }
      mobileThemeToggle={<ThemeToggle color="slate-700" />}
      services={services}
      phone={phone}
    />
  )
}

export default Navbar
