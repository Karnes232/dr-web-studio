import React from "react"
import Image from "next/image"
import Link from "next/link"
const Logo = ({ logo }: { logo: any }) => {
  return (
    <div className="flex-shrink-0 flex items-center">
      <Link href="/" className="no-underline">
        <Image
          src={logo.logo.asset.url}
          alt={logo.logo.alt}
          width={400}
          height={400}
          className="w-full h-full"
          priority
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
