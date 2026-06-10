import { useEffect, useRef, useState } from "react"

/**
 * Counts from the previous value to `target` with an ease-out curve.
 * Honors prefers-reduced-motion by snapping instantly.
 */
export function useCountUp(target: number): number {
  const [val, setVal] = useState(target)
  const ref = useRef(target)

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    const start = ref.current
    const end = target
    if (reduce || start === end) {
      ref.current = end
      setVal(end)
      return
    }

    const t0 = performance.now()
    const dur = 450
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      const cur = Math.round(start + (end - start) * eased)
      setVal(cur)
      ref.current = cur
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        ref.current = end
        setVal(end)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])

  return val
}
