import { Check, type LucideIcon } from "lucide-react"

interface OptionCardProps {
  active: boolean
  onClick: () => void
  label: string
  desc?: string
  tag?: string
  /** Warm/warning tag styling (used for the rush note). */
  tagWarn?: boolean
  Icon?: LucideIcon
  /** Multi-select renders a square tick instead of a round radio. */
  multi?: boolean
}

export default function OptionCard({
  active,
  onClick,
  label,
  desc,
  tag,
  tagWarn,
  Icon,
  multi,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex w-full items-start gap-3 rounded-xl border p-4 text-left transition duration-150 outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 motion-safe:hover:-translate-y-px ${
        active
          ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10 ring-2 ring-orange-500/30 "
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600"
      }`}
    >
      {Icon && (
        <span
          className={`grid h-10 w-10 flex-none place-items-center rounded-lg transition ${
            active
              ? "bg-orange-500 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
          }`}
        >
          <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
        </span>
      )}

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] leading-tight font-semibold text-slate-900 dark:text-white">
            {label}
          </span>
          {tag && (
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${
                tagWarn
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  : "bg-teal-500/10 text-teal-700 dark:text-teal-300"
              }`}
            >
              {tag}
            </span>
          )}
        </span>
        {desc && (
          <span className="text-[13px] leading-snug text-slate-500 dark:text-slate-400">
            {desc}
          </span>
        )}
      </span>

      <span
        className={`mt-0.5 grid h-5 w-5 flex-none place-items-center border text-white transition ${
          multi ? "rounded-md" : "rounded-full"
        } ${active ? "border-orange-500 bg-orange-500" : "border-slate-300 dark:border-slate-600"}`}
        aria-hidden="true"
      >
        {active && <Check size={13} strokeWidth={3} />}
      </span>
    </button>
  )
}
