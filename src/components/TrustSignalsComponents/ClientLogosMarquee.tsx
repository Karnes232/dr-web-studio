import React from "react"
import Image from "next/image"

type Client = {
  companyName: string
  link?: string
  logo?: { asset?: { url?: string } }
}

function LogoMark({ client }: { client: Client }) {
  if (client.logo?.asset?.url) {
    return (
      <Image
        src={client.logo.asset.url}
        alt={`${client.companyName} logo`}
        width={150}
        height={56}
        className="h-12 w-auto max-w-[150px] object-contain grayscale opacity-80 transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-14"
      />
    )
  }
  return (
    <div className="flex h-12 w-32 items-center justify-center rounded-lg bg-slate-100 text-slate-500 md:h-14">
      <span className="text-2xl font-bold">{client.companyName.charAt(0)}</span>
    </div>
  )
}

const ClientLogosMarquee = ({ clients }: { clients: Client[] }) => {
  if (!clients?.length) return null

  // Speed scales with logo count so the perceived pace stays steady as more are added.
  const duration = `${Math.max(24, clients.length * 4.5)}s`

  return (
    <div className="logo-marquee">
      <div
        className="logo-marquee-track items-center"
        style={{ ["--marquee-duration" as string]: duration }}
      >
        {/* Real, interactive set */}
        {clients.map((client, i) => (
          <a
            key={`logo-${i}`}
            href={client.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center justify-center px-8 py-2"
          >
            <LogoMark client={client} />
          </a>
        ))}
        {/* Duplicate set — decorative, drives the seamless loop; hidden under reduced motion */}
        {clients.map((client, i) => (
          <span
            key={`logo-dup-${i}`}
            aria-hidden="true"
            className="logo-marquee-dup flex shrink-0 items-center justify-center px-8 py-2"
          >
            <LogoMark client={client} />
          </span>
        ))}
      </div>
    </div>
  )
}

export default ClientLogosMarquee
