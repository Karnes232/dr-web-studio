"use client"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import type { Project } from "@/sanity/queries/portfolio/project"

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
  projects: Project[]
  currentLocale: string
}

// Swiper (~40 KiB) isn't needed to paint the hero. Loading it on mount put its
// parse/execute right in the LCP paint window and fed the long main-thread task
// PageSpeed flagged. Gate the dynamic import behind idle time (or the first user
// interaction, whichever comes first) so the hero paints before Swiper runs.
export default function VisualElementLazy(props: VisualElementLazyProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (ready) return

    const load = () => setReady(true)
    const w = window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number },
      ) => number
      cancelIdleCallback?: (id: number) => void
    }

    let idleId: number
    let usedIdle = false
    if (typeof w.requestIdleCallback === "function") {
      usedIdle = true
      idleId = w.requestIdleCallback(load, { timeout: 2500 })
    } else {
      idleId = window.setTimeout(load, 1500)
    }

    const opts = { once: true, passive: true } as const
    window.addEventListener("pointerdown", load, opts)
    window.addEventListener("touchstart", load, opts)
    window.addEventListener("keydown", load, opts)

    return () => {
      if (usedIdle) w.cancelIdleCallback?.(idleId)
      else window.clearTimeout(idleId)
      window.removeEventListener("pointerdown", load)
      window.removeEventListener("touchstart", load)
      window.removeEventListener("keydown", load)
    }
  }, [ready])

  if (!ready) return <Placeholder />
  return <VisualElement {...props} />
}
