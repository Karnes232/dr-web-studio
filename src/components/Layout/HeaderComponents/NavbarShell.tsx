"use client"

import React, { useState } from "react"
import MobileMenuToggle from "./MobileMenuToggle"
import MobileMenu from "./MobileMenu"
import type { LocalizedServiceLink } from "@/components/Layout/chrome"

// The only chrome state: whether the mobile menu is open. All static markup
// arrives server-rendered through the slot props, so opening/closing the menu
// never re-renders the nav content.
const NavbarShell = ({
  logo,
  desktopNav,
  desktopControls,
  mobileThemeToggle,
  services,
  phone,
}: {
  logo: React.ReactNode
  desktopNav: React.ReactNode
  desktopControls: React.ReactNode
  mobileThemeToggle: React.ReactNode
  services: LocalizedServiceLink[]
  phone?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav
      className={`bg-white dark:bg-slate-900 shadow-lg ${isOpen ? "sticky" : "md:sticky"} top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28 md:h-36">
          {logo}

          {desktopNav}

          {/* Desktop: Theme Toggle + Language Switcher + CTA Buttons */}
          <div className="hidden lg:flex items-center lg:space-x-2 xl:space-x-4">
            {desktopControls}
          </div>

          {/* Mobile: Theme Toggle + Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-3">
            {mobileThemeToggle}
            <MobileMenuToggle
              isOpen={isOpen}
              toggleMobileMenu={() => setIsOpen(open => !open)}
            />
          </div>
        </div>

        <MobileMenu
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          services={services}
          phone={phone}
        />
      </div>
    </nav>
  )
}

export default NavbarShell
