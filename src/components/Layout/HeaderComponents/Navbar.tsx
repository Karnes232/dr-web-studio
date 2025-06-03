"use client"

import React, { useState } from "react"
import Logo from "./Logo"
import MobileMenuToggle from "./MobileMenuToggle"
import MobileMenu from "./MobileMenu"
import CTAButtons from "./CTAButtons"
import DesktopNavigation from "./DesktopNavigation"

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

          <CTAButtons className="hidden lg:flex" />

          <MobileMenuToggle
            isOpen={isOpen}
            toggleMobileMenu={toggleMobileMenu}
          />
        </div>

        <MobileMenu isOpen={isOpen} />
      </div>
    </nav>
  )
}

export default Navbar
