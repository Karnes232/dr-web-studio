"use client"

import React, { useState } from "react"
import Logo from "./Logo"
import MobileMenuToggle from "./MobileMenuToggle"
import MobileMenu from "./MobileMenu"
import CTAButtons from "./CTAButtons"
import DesktopNavigation from "./DesktopNavigation"
import LanguageSwitcher from "@/components/LanguageSwitcher" // Adjust path as needed
import ThemeToggle from "@/components/theme/ThemeToggle"
import { ServiceItemsLinks } from "@/sanity/queries/services/serviceItem"

const Navbar = ({
  logo,
  serviceLinks,
  phone,
}: {
  logo: any
  serviceLinks: ServiceItemsLinks[]
  phone?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav
      className={`bg-white dark:bg-slate-900 shadow-lg ${isOpen ? "sticky" : "md:sticky"} top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28 md:h-36">
          <Logo logo={logo} />

          <DesktopNavigation
            servicesOpen={servicesOpen}
            setServicesOpen={setServicesOpen}
            serviceLinks={serviceLinks}
          />

          {/* Desktop: Theme Toggle + Language Switcher + CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle color="slate-700" />
            <LanguageSwitcher color="slate-700" />
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700"></div>
            <CTAButtons phone={phone} />
          </div>

          {/* Mobile: Theme Toggle + Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-3">
            <ThemeToggle color="slate-700" />
            <MobileMenuToggle
              isOpen={isOpen}
              toggleMobileMenu={toggleMobileMenu}
            />
          </div>
        </div>

        <MobileMenu
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          serviceLinks={serviceLinks}
          phone={phone}
        />
      </div>
    </nav>
  )
}

export default Navbar
