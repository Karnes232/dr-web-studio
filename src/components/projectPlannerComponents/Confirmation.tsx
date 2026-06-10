import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react"
import type { Locale } from "@/lib/planner/types"
import { formatCurrency } from "@/lib/planner/format"
import type { PlannerState, ProjectPlannerData } from "./types"

interface ConfirmationProps {
  data: ProjectPlannerData
  locale: Locale
  selections: PlannerState
  total: number
  contactEmail: string
  onRestart: () => void
}

export default function Confirmation({
  data,
  locale,
  selections,
  total,
  contactEmail,
  onRestart,
}: ConfirmationProps) {
  const { config } = data
  const c = config.confirmation
  const symbol = config.estimateSettings.currencySymbol
  const fmt = (n: number) => formatCurrency(n, { currencySymbol: symbol })

  const firstName = selections.name?.trim().split(" ")[0] || ""
  const heading = c.headingTemplate[locale].replace("{name}", firstName).replace("  ", " ")

  const service = data.services.find(s => s.key === selections.service)
  const chips: string[] = []
  if (service) chips.push(service.title[locale])
  const design = data.designStyles.find(d => d.key === selections.design)
  if (design) chips.push(design.title[locale])
  if (service?.pageBased) {
    const tier = data.sizeTiers.find(t => t.key === selections.sizeTier)
    if (tier) chips.push(tier.label[locale])
    if (selections.content === "need")
      chips.push(config.estimatePanel.contentLine[locale])
  }
  for (const addonKey of selections.addons) {
    const addon = data.addons.find(a => a.service === selections.service && a.key === addonKey)
    if (addon) chips.push(addon.title[locale])
  }
  if (selections.rush) chips.push(config.steps.timeline.rushLabel[locale])

  const footParts = c.footTemplate[locale].split("{email}")

  return (
    <div className="mx-auto mt-2 max-w-[620px] px-4 text-center sm:px-6">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-teal-500/12 text-teal-600">
        <CheckCircle2 size={30} strokeWidth={2} aria-hidden="true" />
      </div>

      <h2
        className="text-[clamp(1.5rem,4vw,2rem)] leading-tight font-bold text-slate-900"
        style={{ fontFamily: "var(--font-crimson-pro)" }}
      >
        {heading}
      </h2>
      <p className="mx-auto mt-3 max-w-[46ch] text-[15px] leading-relaxed text-slate-500">
        {c.subtitle[locale]}
      </p>

      <div className="mx-auto my-6 max-w-[380px] rounded-2xl bg-slate-900 p-6 text-white">
        <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.12em] text-orange-300 uppercase">
          <Sparkles size={13} strokeWidth={2.2} aria-hidden="true" /> {c.estKicker[locale]}
        </div>
        <div className="mt-2.5 text-[12px] tracking-wide text-slate-400 uppercase">
          {config.estimatePanel.startingFromLabel[locale]}
        </div>
        <div className="mt-1 text-[32px] font-semibold tracking-tight tabular-nums">
          {fmt(total)}
        </div>
        <div className="mt-2 text-[12px] text-slate-400">{c.estNote[locale]}</div>
      </div>

      {chips.length > 0 && (
        <div className="mb-2 flex flex-wrap justify-center gap-2">
          {chips.map((chip, i) => (
            <span
              key={i}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6 text-left">
        <div className="mb-3.5 text-[14px] font-semibold text-slate-900">
          {c.nextTitle[locale]}
        </div>
        <ol className="flex flex-col gap-3.5">
          {c.nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3.5 text-[14px] leading-snug">
              <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-orange-100 text-[12px] font-semibold text-orange-700">
                {i + 1}
              </span>
              <span className="text-slate-600">
                <strong className="font-semibold text-slate-900">
                  {step.title[locale]}
                </strong>{" "}
                {step.body[locale]}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-[13.5px] text-slate-500">
        {footParts[0]}
        <a
          href={`mailto:${contactEmail}`}
          className="font-semibold text-orange-600 hover:underline"
        >
          {contactEmail}
        </a>
        {footParts[1] ?? ""}
      </p>

      <button
        type="button"
        onClick={onRestart}
        className="mx-auto mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-[14px] font-semibold text-slate-700 transition outline-none hover:border-slate-300 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-orange-500/40"
      >
        <ArrowLeft size={15} strokeWidth={2.2} aria-hidden="true" /> {c.restartLabel[locale]}
      </button>
    </div>
  )
}
