"use client"

import React from "react"
import Image from "next/image"

interface FooterLogoProps {
  logo: {
    footerLogo: {
      asset: {
        url: string
      }
      alt: string
    }
    companyName: string
  }
}

const FooterLogo = ({ logo }: FooterLogoProps) => {
  return (
    <div className="flex items-center mb-6">
      <Image
        src={logo.footerLogo.asset.url}
        alt={logo.footerLogo.alt}
        width={120}
        height={120}
        className=""
        priority
        sizes="(max-width: 640px) 100px,
           (max-width: 768px) 100px,
           (max-width: 1024px) 100px,
           100px"
      />
    </div>
  )
}

export default FooterLogo
