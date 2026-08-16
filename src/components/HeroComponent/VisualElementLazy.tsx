"use client"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import type { LocalizedProject } from "@/sanity/queries/portfolio/project"

// Placeholder mirrors VisualElement's hydrated card (same wrapper + 16/10 image
// box + caption space) so swapping the client carousel in doesn't shift the
// layout. A flat min-height here under-reserved the space and caused CLS.
// backdrop-blur is desktop-only to match the card and keep mobile paint cheap.
function Placeholder() {
  return (
    <div className="relative" aria-hidden>
      <div className="rounded-2xl border border-white/15 bg-white/10 p-2.5 shadow-2xl lg:backdrop-blur-lg">
        <div className="aspect-[16/10] w-full rounded-xl bg-slate-900/60" />
        <div className="px-2 pb-1 pt-3">
          <div className="h-20" />
        </div>
      </div>
    </div>
  )
}

const VisualElement = dynamic(() => import("./VisualElement"), {
  ssr: false,
  loading: () => <Placeholder />,
})

interface VisualElementLazyProps {
  projects: LocalizedProject[]
}

// Swiper (~40 KiB) isn't needed to paint the hero. The previous idle-timeout
// gate (requestIdleCallback timeout 2500ms) fired at its deadline on a busy
// page — right inside the LCP window — so Swiper's parse/mount landed exactly
// when the hero image wanted to paint. Gate on viewport proximity instead: on
// mobile the carousel sits below the fold and loads only when scrolled near;
// on desktop it's in view at mount, so the observer fires on the next frame,
// after paint. First interaction still force-loads as a fallback.
export default function VisualElementLazy(props: VisualElementLazyProps) {
  const [ready, setReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ready) return

    const load = () => setReady(true)

    let observer: IntersectionObserver | undefined
    if (typeof IntersectionObserver === "function" && containerRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) load()
        },
        // No preload margin: on a phone the card sits just below the fold, and
        // any positive margin makes the observer fire at load time — putting
        // Swiper's parse right back in the LCP window. In view at mount
        // (desktop) it still loads immediately.
        { rootMargin: "0px" },
      )
      observer.observe(containerRef.current)
    } else {
      load()
    }

    const opts = { once: true, passive: true } as const
    window.addEventListener("pointerdown", load, opts)
    window.addEventListener("touchstart", load, opts)
    window.addEventListener("keydown", load, opts)

    return () => {
      observer?.disconnect()
      window.removeEventListener("pointerdown", load)
      window.removeEventListener("touchstart", load)
      window.removeEventListener("keydown", load)
    }
  }, [ready])

  if (!ready) {
    return (
      <div ref={containerRef}>
        <Placeholder />
      </div>
    )
  }
  return <VisualElement {...props} />
}
