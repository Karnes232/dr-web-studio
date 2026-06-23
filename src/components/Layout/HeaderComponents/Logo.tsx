import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
const Logo = ({ logo }: { logo: any }) => {
  return (
    <div className="flex-shrink-0 flex items-center">
      <Link href="/" className="no-underline">
        {/* Light-mode brand logo */}
        <Image
          src={logo.logo.asset.url}
          alt={logo.logo.alt}
          width={400}
          height={400}
          className="w-full h-full object-contain dark:hidden"
          sizes="(max-width: 640px) 100px,
             (max-width: 768px) 150px,
             (max-width: 1024px) 150px,
             150px"
        />
        {/* Dark-mode logo: reuses the footer asset, which reads on dark surfaces */}
        <Image
          src={logo.footerLogo.asset.url}
          alt={logo.footerLogo.alt}
          width={400}
          height={400}
          className="w-full h-full object-contain hidden dark:block"
          sizes="(max-width: 640px) 100px,
             (max-width: 768px) 150px,
             (max-width: 1024px) 150px,
             150px"
        />
      </Link>
    </div>
  )
}

export default Logo
