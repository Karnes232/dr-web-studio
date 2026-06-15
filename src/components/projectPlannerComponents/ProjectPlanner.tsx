"use client"

import { useMemo, useRef, useState } from "react"
import Botpoison from "@botpoison/browser"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Pencil,
  X,
  Zap,
} from "lucide-react"
import type { Locale } from "@/lib/planner/types"
import { computeEstimate } from "@/lib/planner/computeEstimate"
import { formatCurrency } from "@/lib/planner/format"
import { iconFor } from "./icons"
import { useCountUp } from "./useCountUp"
import StepHead from "./StepHead"
import OptionCard from "./OptionCard"
import Field from "./Field"
import EstimatePanel from "./EstimatePanel"
import Confirmation from "./Confirmation"
import {
  initialPlannerState,
  toPricing,
  type PlannerState,
  type ProjectPlannerData,
} from "./types"

const BOTPOISON_PUBLIC_KEY = "pk_de02a196-39ef-4d2b-8691-40646ab2d702"
const isEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())

type StepKey = "service" | "addons" | "design" | "size" | "timeline" | "contact"

interface ProjectPlannerProps {
  data: ProjectPlannerData
  locale: Locale
  contactEmail: string
}

export default function ProjectPlanner({
  data,
  locale,
  contactEmail,
}: ProjectPlannerProps) {
  const { config } = data
  const pricing = useMemo(() => toPricing(data), [data])
  const symbol = config.estimateSettings.currencySymbol
  const fmt = (n: number) => formatCurrency(n, { currencySymbol: symbol })

  const [stepIndex, setStepIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [showSheet, setShowSheet] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [s, setS] = useState<PlannerState>(initialPlannerState)

  // Root of the planner; we scroll back to it on every step change so the user
  // isn't left at the bottom of a long step after advancing.
  const topRef = useRef<HTMLDivElement>(null)
  const scrollToTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

  const set = (patch: Partial<PlannerState>) =>
    setS(prev => ({ ...prev, ...patch }))

  const est = useMemo(
    () => computeEstimate(s, pricing, locale),
    [s, pricing, locale],
  )
  const service = data.services.find(x => x.key === s.service)
  const hasService = !!service
  const total = useCountUp(est.total)

  const serviceAddons = useMemo(
    () => data.addons.filter(a => a.service === s.service),
    [data.addons, s.service],
  )

  // Dynamic step list — page-based services get the Size & Content step.
  const stepKeys = useMemo<StepKey[]>(() => {
    const keys: StepKey[] = ["service", "addons", "design"]
    if (service?.pageBased) keys.push("size")
    keys.push("timeline", "contact")
    return keys
  }, [service?.pageBased])

  const totalSteps = stepKeys.length
  const idx = Math.min(stepIndex, totalSteps - 1)
  const stepKey = stepKeys[idx]

  const botpoison = useMemo(
    () => new Botpoison({ publicKey: BOTPOISON_PUBLIC_KEY }),
    [],
  )

  const canContinue = (key: StepKey): boolean => {
    switch (key) {
      case "service":
        return !!s.service
      case "design":
        return !!s.design
      case "size":
        return !!s.sizeTier && !!s.content
      case "contact":
        return s.name.trim().length > 0 && isEmail(s.email)
      default:
        return true
    }
  }

  const toggleAddon = (key: string) =>
    set({
      addons: s.addons.includes(key)
        ? s.addons.filter(a => a !== key)
        : [...s.addons, key],
    })

  const next = () => {
    if (!canContinue(stepKey)) return
    if (idx === totalSteps - 1) {
      handleSubmit()
      return
    }
    setStepIndex(idx + 1)
    scrollToTop()
  }
  const back = () => {
    setStepIndex(Math.max(0, idx - 1))
    scrollToTop()
  }
  const goto = (i: number) => {
    if (i < idx) {
      setStepIndex(i)
      scrollToTop()
    }
  }

  const restart = () => {
    setDone(false)
    setStepIndex(0)
    setSubmitError(null)
    setS(initialPlannerState)
  }

  async function handleSubmit() {
    setSubmitError(null)
    try {
      const { solution } = await botpoison.challenge()
      if (!solution) {
        setSubmitError(config.contactFields.nameInvalid[locale])
        return
      }
      setSubmitting(true)

      const enEst = computeEstimate(s, pricing, "en")
      const addonTitles = s.addons
        .map(k => serviceAddons.find(a => a.key === k)?.title.en)
        .filter((x): x is string => !!x)
      const designStyle = data.designStyles.find(d => d.key === s.design)?.title
        .en
      const sizeTier = service?.pageBased
        ? data.sizeTiers.find(t => t.key === s.sizeTier)?.label.en
        : undefined
      const references = s.references
        .split(/\r?\n/)
        .map(r => r.trim())
        .filter(Boolean)

      const res = await fetch("/api/project-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: s.name,
          email: s.email,
          company: s.company,
          message: s.message,
          locale,
          service: service?.title.en ?? s.service,
          serviceKey: s.service,
          addons: addonTitles,
          design: designStyle,
          references,
          size: sizeTier,
          content: service?.pageBased ? s.content : undefined,
          rush: s.rush,
          timeline: service?.timeline.en ?? "",
          estimate: {
            total: est.total,
            currency: config.estimateSettings.currencyCode,
            currencySymbol: symbol,
            items: enEst.items,
          },
          _botpoison: solution,
        }),
      })

      if (!res.ok) {
        setSubmitError(config.contactFields.nameInvalid[locale])
        return
      }
      setDone(true)
      setStepIndex(0)
      if (typeof window !== "undefined")
        window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {
      setSubmitError(config.contactFields.nameInvalid[locale])
    } finally {
      setSubmitting(false)
    }
  }

  const panelProps = {
    panel: config.estimatePanel,
    locale,
    currencySymbol: symbol,
    hasService,
    items: est.items,
    total,
    included: service?.included ?? [],
    timeline: service?.timeline[locale],
  }

  /* -------------------------------- render -------------------------------- */

  return (
    <div
      ref={topRef}
      className="mx-auto max-w-[1120px] scroll-mt-32 px-4 pb-28 sm:px-6 md:scroll-mt-40 lg:px-8 lg:pb-0"
    >
      <header className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <span
            className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-crimson-pro)" }}
          >
            DR
          </span>
          <span className="text-[15px] font-semibold text-slate-900 dark:text-white">
            {config.intro.title[locale]}{" "}
            <span className="font-medium text-slate-400">
              · {config.intro.kicker[locale]}
            </span>
          </span>
        </div>
        {!done && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-[12.5px] text-slate-500 dark:text-slate-400">
            <Clock size={13} strokeWidth={2.1} aria-hidden="true" />
            {config.intro.timeLabel[locale]}
          </div>
        )}
      </header>

      {done ? (
        <Confirmation
          data={data}
          locale={locale}
          selections={s}
          total={est.total}
          contactEmail={contactEmail}
          onRestart={restart}
        />
      ) : (
        <>
          {/* progress */}
          <div className="flex items-center gap-4 pt-1">
            <div className="flex flex-1 gap-1.5">
              {stepKeys.map((_, i) => {
                const state =
                  i < idx
                    ? "bg-teal-500"
                    : i === idx
                      ? "bg-orange-500"
                      : "bg-slate-200"
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goto(i)}
                    disabled={i >= idx}
                    aria-label={config.nav.progressTemplate[locale]
                      .replace("{current}", String(i + 1))
                      .replace("{total}", String(totalSteps))}
                    className={`h-1.5 flex-1 rounded-full transition ${state} ${
                      i < idx ? "cursor-pointer" : "cursor-default"
                    } outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50`}
                  />
                )
              })}
            </div>
            <div className="text-[12px] whitespace-nowrap text-slate-500 dark:text-slate-400 tabular-nums">
              {config.nav.progressTemplate[locale]
                .replace("{current}", String(idx + 1))
                .replace("{total}", String(totalSteps))}
            </div>
          </div>

          <div className="mt-5 grid items-start gap-7 lg:grid-cols-[1fr_350px]">
            <main className="min-w-0">
              <div
                key={stepKey}
                className="planner-card-in rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8"
              >
                {/* Service */}
                {stepKey === "service" && (
                  <>
                    <StepHead
                      kicker={config.steps.service.kicker[locale]}
                      title={config.steps.service.title[locale]}
                      sub={config.steps.service.subtitle[locale]}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      {data.services.map(svc => (
                        <OptionCard
                          key={svc.key}
                          active={s.service === svc.key}
                          Icon={iconFor(svc.icon)}
                          label={svc.title[locale]}
                          desc={svc.description[locale]}
                          tag={fmt(svc.basePrice)}
                          onClick={() =>
                            set({
                              service: svc.key,
                              addons: [],
                              sizeTier: "",
                              content: "",
                            })
                          }
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Add-ons */}
                {stepKey === "addons" && (
                  <>
                    <StepHead
                      kicker={config.steps.addons.kicker[locale]}
                      title={config.steps.addons.title[locale]}
                      sub={config.steps.addons.subtitle[locale]}
                    />
                    {serviceAddons.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {serviceAddons.map(addon => (
                          <OptionCard
                            key={addon.key}
                            multi
                            active={s.addons.includes(addon.key)}
                            label={addon.title[locale]}
                            desc={addon.description?.[locale]}
                            tag={`+${fmt(addon.price)}`}
                            onClick={() => toggleAddon(addon.key)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-5 text-[14px] text-slate-500 dark:text-slate-400">
                        {config.steps.addons.emptyNote?.[locale]}
                      </p>
                    )}
                  </>
                )}

                {/* Design & inspiration */}
                {stepKey === "design" && (
                  <>
                    <StepHead
                      kicker={config.steps.design.kicker[locale]}
                      title={config.steps.design.title[locale]}
                      sub={config.steps.design.subtitle[locale]}
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      {data.designStyles.map(ds => (
                        <OptionCard
                          key={ds.key}
                          active={s.design === ds.key}
                          label={ds.title[locale]}
                          desc={ds.description[locale]}
                          onClick={() => set({ design: ds.key })}
                        />
                      ))}
                    </div>
                    <div className="mt-6">
                      <Field
                        id="planner-references"
                        label={config.steps.design.referencesLabel[locale]}
                        placeholder={
                          config.steps.design.referencesPlaceholder[locale]
                        }
                        value={s.references}
                        onChange={v => set({ references: v })}
                        multiline
                        optionalLabel={
                          config.contactFields.company.placeholder[locale]
                        }
                      />
                    </div>
                  </>
                )}

                {/* Size & content */}
                {stepKey === "size" && (
                  <>
                    <StepHead
                      kicker={config.steps.size.kicker[locale]}
                      title={config.steps.size.title[locale]}
                      sub={config.steps.size.subtitle[locale]}
                    />
                    <div className="mb-3 text-[15px] font-semibold text-slate-900 dark:text-white">
                      {config.steps.size.sizeHeading[locale]}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {data.sizeTiers.map(tier => (
                        <OptionCard
                          key={tier.key}
                          active={s.sizeTier === tier.key}
                          label={tier.label[locale]}
                          tag={
                            tier.priceModifier === 0
                              ? config.estimatePanel.includedHeading[locale]
                              : `+${fmt(tier.priceModifier)}`
                          }
                          onClick={() => set({ sizeTier: tier.key })}
                        />
                      ))}
                    </div>

                    <div className="mt-6 mb-3 text-[15px] font-semibold text-slate-900 dark:text-white">
                      {config.steps.size.contentHeading[locale]}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <OptionCard
                        active={s.content === "ready"}
                        Icon={CheckCircle2}
                        label={config.steps.size.contentReadyLabel[locale]}
                        desc={config.steps.size.contentReadyDesc[locale]}
                        onClick={() => set({ content: "ready" })}
                      />
                      <OptionCard
                        active={s.content === "need"}
                        Icon={Pencil}
                        label={config.steps.size.contentNeedLabel[locale]}
                        desc={config.steps.size.contentNeedDesc[locale]}
                        tag={`${fmt(config.estimateSettings.contentPerPagePrice)}/pg`}
                        onClick={() => set({ content: "need" })}
                      />
                    </div>
                  </>
                )}

                {/* Timeline & rush */}
                {stepKey === "timeline" && (
                  <>
                    <StepHead
                      kicker={config.steps.timeline.kicker[locale]}
                      title={config.steps.timeline.title[locale]}
                      sub={config.steps.timeline.subtitle[locale]}
                    />
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3.5">
                      <Clock
                        size={18}
                        strokeWidth={2}
                        className="text-slate-500 dark:text-slate-400"
                        aria-hidden="true"
                      />
                      <span className="text-[13px] text-slate-500 dark:text-slate-400">
                        {config.steps.timeline.estimatedTimelineLabel[locale]}:
                      </span>
                      <span className="text-[15px] font-semibold text-slate-900 dark:text-white">
                        {service?.timeline[locale]}
                      </span>
                    </div>
                    <OptionCard
                      multi
                      active={s.rush}
                      Icon={Zap}
                      label={config.steps.timeline.rushLabel[locale]}
                      desc={config.steps.timeline.rushDesc[locale]}
                      tag={config.steps.timeline.rushTag[locale]}
                      tagWarn
                      onClick={() => set({ rush: !s.rush })}
                    />
                  </>
                )}

                {/* Contact */}
                {stepKey === "contact" && (
                  <>
                    <StepHead
                      kicker={config.steps.contact.kicker[locale]}
                      title={config.steps.contact.title[locale]}
                      sub={config.steps.contact.subtitle[locale]}
                    />
                    <div className="flex flex-col gap-4">
                      <Field
                        id="planner-name"
                        label={config.contactFields.name.label[locale]}
                        placeholder={
                          config.contactFields.name.placeholder[locale]
                        }
                        value={s.name}
                        onChange={v => set({ name: v })}
                        required
                      />
                      <Field
                        id="planner-email"
                        label={config.contactFields.email.label[locale]}
                        placeholder={
                          config.contactFields.email.placeholder[locale]
                        }
                        value={s.email}
                        onChange={v => set({ email: v })}
                        required
                        note={config.contactFields.email.note[locale]}
                        invalid={s.email.length > 0 && !isEmail(s.email)}
                        invalidMessage={
                          config.contactFields.nameInvalid[locale]
                        }
                      />
                      <Field
                        id="planner-company"
                        label={config.contactFields.company.label[locale]}
                        placeholder={
                          config.contactFields.company.placeholder[locale]
                        }
                        value={s.company}
                        onChange={v => set({ company: v })}
                      />
                      <Field
                        id="planner-message"
                        label={config.contactFields.message.label[locale]}
                        placeholder={
                          config.contactFields.message.placeholder[locale]
                        }
                        value={s.message}
                        onChange={v => set({ message: v })}
                        multiline
                      />
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-teal-500/25 bg-teal-500/[0.07] px-3.5 py-3 text-[13px] text-teal-700">
                      <Layers size={15} strokeWidth={2.2} aria-hidden="true" />
                      {config.contactFields.reassurance[locale]}
                    </div>
                  </>
                )}

                {submitError && (
                  <p className="mt-4 text-[13px] text-red-600" role="alert">
                    {submitError}
                  </p>
                )}

                {/* nav */}
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-700 pt-5">
                  <button
                    type="button"
                    onClick={back}
                    disabled={idx === 0}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-5 py-3 text-[14.5px] font-semibold text-slate-600 dark:text-slate-400 transition outline-none hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white focus-visible:ring-2 focus-visible:ring-orange-500/40 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
                    {config.nav.backLabel[locale]}
                  </button>

                  <button
                    type="button"
                    onClick={next}
                    disabled={submitting || !canContinue(stepKey)}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-[14.5px] font-semibold text-white transition outline-none hover:bg-orange-600 focus-visible:ring-2 focus-visible:ring-orange-500/50 motion-safe:hover:-translate-y-px disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:translate-y-0"
                  >
                    {stepKey === "addons" && s.addons.length === 0
                      ? config.nav.skipLabel[locale]
                      : idx === totalSteps - 1
                        ? config.nav.submitLabel[locale]
                        : config.nav.continueLabel[locale]}
                    <ArrowRight
                      size={16}
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </main>

            {/* desktop estimate */}
            <aside className="hidden lg:block">
              <div className="sticky top-5">
                <EstimatePanel {...panelProps} />
              </div>
            </aside>
          </div>

          {/* mobile estimate bar */}
          <button
            type="button"
            onClick={() => setShowSheet(true)}
            className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 bg-slate-900 px-4 py-3.5 text-left text-white shadow-[0_-10px_30px_-16px_rgba(0,0,0,0.5)] sm:px-6 lg:hidden"
          >
            <span className="flex flex-col gap-0.5">
              <span className="inline-flex items-center gap-1.5 text-[9.5px] font-semibold tracking-[0.1em] text-orange-300 uppercase">
                <Layers size={11} strokeWidth={2.4} aria-hidden="true" />
                {config.estimatePanel.mobileKicker[locale]}
              </span>
              <span className="text-[17px] font-semibold tabular-nums">
                {hasService ? fmt(total) : `${symbol}—`}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/12 px-3.5 py-2 text-[13px] font-semibold">
              {config.estimatePanel.mobileCta[locale]}
              <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
            </span>
          </button>

          {showSheet && (
            <div
              className="fixed inset-0 z-50 flex items-end bg-slate-900/50 lg:hidden"
              onClick={() => setShowSheet(false)}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="relative max-h-[82vh] w-full overflow-auto"
                onClick={e => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setShowSheet(false)}
                  aria-label="Close"
                  className="absolute top-3.5 right-3.5 z-10 grid h-8 w-8 place-items-center rounded-lg bg-white/12 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <X size={18} />
                </button>
                <EstimatePanel {...panelProps} compact />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
