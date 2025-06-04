"use client"

import React, { useState } from "react"
import Logo from "./Logo"
import MobileMenuToggle from "./MobileMenuToggle"
import MobileMenu from "./MobileMenu"
import CTAButtons from "./CTAButtons"
import DesktopNavigation from "./DesktopNavigation"
import LanguageSwitcher from "@/components/LanguageSwitcher" // Adjust path as needed

const Navbar = ({ logo }: { logo: any }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28 md:h-36">
          <Logo logo={logo} />

          <DesktopNavigation
            servicesOpen={servicesOpen}
            setServicesOpen={setServicesOpen}
          />

          {/* Desktop: Language Switcher + CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSwitcher />
            <div className="w-px h-6 bg-slate-300"></div>
            <CTAButtons />
          </div>

          {/* Mobile: Language Switcher + Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* <div className="sm:block hidden">
              <LanguageSwitcher />
            </div> */}
            <MobileMenuToggle
              isOpen={isOpen}
              toggleMobileMenu={toggleMobileMenu}
            />
          </div>
        </div>

        <MobileMenu isOpen={isOpen} />
      </div>
    </nav>
  )
}

export default Navbar