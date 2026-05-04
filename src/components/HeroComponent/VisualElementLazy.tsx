"use client"
import dynamic from "next/dynamic"

const VisualElement = dynamic(() => import("./VisualElement"), {
  ssr: false,
  loading: () => <div className="relative min-h-80" aria-hidden />,
})

export default VisualElement
