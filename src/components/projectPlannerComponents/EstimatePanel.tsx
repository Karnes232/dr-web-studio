import { Check, Clock, Layers } from "lucide-react"
import type { PlannerConfig } from "@/sanity/queries/project-planner/plannerConfig"
import type { EstimateItem, Locale, LocalizedString } from "@/lib/planner/types"
import { formatCurrency } from "@/lib/planner/format"

interface EstimatePanelProps {
  panel: PlannerConfig["estimatePanel"]
  locale: Locale
  currencySymbol: string
  hasService: boolean
  items: EstimateItem[]
  total: number
  included: LocalizedString[]
  timeline?: string
  compact?: boolean
}

export default function EstimatePanel({
  panel,
  locale,
  currencySymbol,
  hasService,
  items,
  total,
  included,
  timeline,
  compact,
}: EstimatePanelProps) {
  const fmt = (n: number) => formatCurrency(n, { currencySymbol })

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-2xl ${
        compact ? "rounded-b-none" : ""
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(120%_80%_at_70%_0%,#000,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative p-6">
        <div className="mb-3.5 inline-flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.12em] text-orange-300 uppercase">
          <Layers size={13} strokeWidth={2.2} aria-hidden="true" /> {panel.kicker[locale]}
        </div>

        {hasService ? (
          <>
            <div className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
              {panel.startingFromLabel[locale]}
            </div>
            <div
              className="mt-1 text-[34px] leading-none font-semibold tracking-tight tabular-nums"
              aria-live="polite"
            >
              {fmt(total)}
            </div>
            <div className="mt-2 text-[12px] text-slate-400">
              {panel.ballparkNote[locale]}
            </div>

            <div className="my-4 h-px bg-white/10" />

            <ul className="flex flex-col gap-2.5">
              {items.map(it => {
                const isRush = it.key === "rush"
                return (
                  <li
                    key={it.key}
                    className={`flex items-baseline justify-between gap-4 text-[13px] ${
                      isRush ? "text-amber-300" : ""
                    }`}
                  >
                    <span className={isRush ? "" : "text-slate-300"}>{it.label}</span>
                    <span
                      className={`tabular-nums whitespace-nowrap ${
                        isRush ? "text-amber-300" : "font-semibold text-white"
                      }`}
                    >
                      {`+${fmt(it.amount)}`}
                    </span>
                  </li>
                )
              })}
            </ul>

            {timeline && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12.5px] text-slate-200">
                <Clock size={13} strokeWidth={2.1} aria-hidden="true" />
                <span className="text-slate-400">{panel.timelineLabel[locale]}:</span>
                <span className="font-medium text-white">{timeline}</span>
              </div>
            )}

            {included.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-[10.5px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                  {panel.includedHeading[locale]}
                </div>
                <ul className="flex flex-col gap-1.5">
                  {included.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12.5px] text-slate-300">
                      <Check
                        size={13}
                        strokeWidth={2.6}
                        className="mt-0.5 flex-none text-teal-400"
                        aria-hidden="true"
                      />
                      {inc[locale]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div>
            <div className="text-[34px] leading-none font-semibold text-slate-600">
              {currencySymbol}—
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-400">
              {panel.emptyBody[locale]}
            </p>
          </div>
        )}

        <div className="mt-5 border-t border-white/10 pt-3.5 text-[11px] leading-relaxed text-slate-500">
          {panel.footnote[locale]}
        </div>
      </div>
    </div>
  )
}
