"use client"
import dynamic from "next/dynamic"

// Placeholder mirrors VisualElement's hydrated card (same wrapper + 16/10 image
// box + caption space) so swapping the client carousel in doesn't shift the
// layout. A flat min-height here under-reserved the space and caused CLS.
const VisualElement = dynamic(() => import("./VisualElement"), {
  ssr: false,
  loading: () => (
    <div className="relative" aria-hidden>
      <div className="rounded-2xl border border-white/15 bg-white/10 p-2.5 shadow-2xl backdrop-blur-lg">
        <div className="aspect-[16/10] w-full rounded-xl bg-slate-900/60" />
        <div className="px-2 pb-1 pt-3">
          <div className="h-20" />
        </div>
      </div>
    </div>
  ),
})

export default VisualElement
