"use client"

import { useEffect, useRef, useState, type ElementType } from "react"

interface RevealProps {
  children: React.ReactNode
  /** Extra classes merged onto the wrapper. */
  className?: string
  /** Stagger, in seconds, applied as a CSS transition-delay. */
  delay?: number
  /** Wrapper element (defaults to a div). */
  as?: ElementType
  /** Start revealing this far before the element enters the viewport. */
  rootMargin?: string
}

// Lightweight replacement for framer-motion entrance animations: renders its
// (server-rendered) children immediately for SEO/LCP, then toggles the CSS
// `.reveal` → `.is-visible` class once scrolled into view. If IntersectionObserver
// is unavailable, content shows straight away.
export function Reveal({
  children,
  className = "",
  delay = 0,
  as,
  rootMargin = "-80px",
}: RevealProps) {
  const Tag = as ?? "div"
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [visible, rootMargin])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={delay ? { ["--reveal-delay" as string]: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  )
}

export default Reveal
