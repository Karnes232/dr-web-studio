import React from "react"
import Image from "next/image"
import { client } from "@/sanity/lib/client"
const FooterLogo = async () => {
  const logo = await client.fetch(`
        *[_type == "generalLayout"][0] {
          footerLogo {
            asset->{
              url,
              metadata {
                dimensions,
                lqip,
                palette
              }
            },
            alt,
            hotspot,
            crop
          },
          companyName
        }
      `)
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
