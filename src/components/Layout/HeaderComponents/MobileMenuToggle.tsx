import React from "react"
import { Menu, X } from "lucide-react"
const MobileMenuToggle = ({
  isOpen,
  toggleMobileMenu,
}: {
  isOpen: boolean
  toggleMobileMenu: () => void
}) => {
  return (
    <div className="lg:hidden">
      {/* p-2.5 grows the 24px icon to a 44px tap target (WCAG 2.5.5 / Apple
          HIG minimum); the negative margin keeps the visual layout unchanged. */}
      <button
        aria-label="Toggle mobile menu"
        onClick={toggleMobileMenu}
        className="p-2.5 -m-2.5 text-slate-700 dark:text-slate-200 hover:text-orange-500 focus:outline-none focus:text-orange-500 transition-colors duration-200"
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
