import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/webhooks/stripe",
        destination: "/api/webhooks/stripe",
      },
    ]
  },
}

export default nextConfig
