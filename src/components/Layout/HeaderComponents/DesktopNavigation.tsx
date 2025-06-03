import React from "react"
import ServicesDropdown from "./ServicesDropdown"

const DesktopNavigation = ({
  servicesOpen,
  setServicesOpen,
}: {
  servicesOpen: boolean
  setServicesOpen: any
}) => {
  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#pricing", label: "Pricing" },
    { href: "#blog", label: "Blog" },
    { href: "#contact", label: "Contact" },
  ]
  return (
    <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 ">
      {navItems.slice(0, 2).map((item, index) => (
        <a
          key={index}
          href={item.href}
          className="text-slate-700 hover:text-orange-500 font-medium xl:text-lg transition-colors duration-200"
        >
          {item.label}
        </a>
      ))}

      <ServicesDropdown
        servicesOpen={servicesOpen}
        setServicesOpen={setServicesOpen}
      />

      {navItems.slice(2).map((item, index) => (
        <a
          key={index + 2}
          href={item.href}
          className="text-slate-700 hover:text-orange-500 font-medium transition-colors duration-200"
        >
          {item.label}
        </a>
      ))}
    </div>
  )
}

export default DesktopNavigation
