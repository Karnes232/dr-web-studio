import React from "react"
import { Menu, X } from "lucide-react"
const MobileMenuToggle = ({
  isOpen,
  toggleMobileMenu,
}: {
  isOpen: boolean
  toggleMobileMenu: any
}) => {
  return (
    <div className="lg:hidden">
      <button
        aria-label="Toggle mobile menu"
        onClick={toggleMobileMenu}
        className="text-slate-700 hover:text-orange-500 focus:outline-none focus:text-orange-500 transition-colors duration-200"
      >
        {isOpen ? (
          <X className="h-6 md:h-8 w-6 md:w-8" />
        ) : (
          <Menu className="h-6 md:h-8 w-6 md:w-8" />
        )}
      </button>
    </div>
  )
}

export default MobileMenuToggle
