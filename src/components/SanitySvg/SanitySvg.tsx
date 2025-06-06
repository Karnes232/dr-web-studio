import React, { useState, useEffect } from "react"

const svgCache = new Map()

const SanitySvg = ({
  url,
  className = "",
  ...props
}: {
  url: string
  className?: string
}) => {
  const [svgContent, setSvgContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSvg = async () => {
      if (svgCache.has(url)) {
        setSvgContent(svgCache.get(url))
        setLoading(false)
        return
      }

      try {
        const response = await fetch(url)
        let svg = await response.text()

        // More aggressive cleaning of SVG attributes and ensure proper sizing
        svg = svg
          // Remove fill attributes from all elements
          .replace(/fill="[^"]*"/g, "")
          .replace(/fill='[^']*'/g, "")
          // Remove stroke attributes
          .replace(/stroke="[^"]*"/g, "")
          .replace(/stroke='[^']*'/g, "")
          // Remove width and height attributes
          .replace(/width="[^"]*"/g, "")
          .replace(/width='[^']*'/g, "")
          .replace(/height="[^"]*"/g, "")
          .replace(/height='[^']*'/g, "")
          // Add currentColor as fill and ensure SVG scales properly
          .replace(
            /<svg([^>]*)>/,
            '<svg$1 fill="currentColor" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">',
          )

        svgCache.set(url, svg)
        setSvgContent(svg)
      } catch (error) {
        console.error("Failed to load SVG:", error)
      } finally {
        setLoading(false)
      }
    }

    if (url) {
      loadSvg()
    }
  }, [url])

  if (loading) {
    return <div className={`${className} animate-pulse bg-gray-200`} />
  }

  return (
    <div
      className={`${className} flex items-center justify-center`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}
    />
  )
}

export default SanitySvg
