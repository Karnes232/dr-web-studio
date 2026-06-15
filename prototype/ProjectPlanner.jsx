import { useState, useEffect, useRef } from "react"
import {
  Briefcase,
  ShoppingCart,
  LayoutGrid,
  Newspaper,
  MousePointerClick,
  HeartHandshake,
  Mail,
  CalendarClock,
  CreditCard,
  FileText,
  Globe,
  Search,
  BarChart3,
  Lock,
  Send,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Sparkles,
  Pencil,
  CheckCircle2,
  Minus,
  Plus,
  X,
  Layers,
} from "lucide-react"

/* ---------------------------------- data ---------------------------------- */

const TYPES = [
  {
    id: "business",
    label: "Business Website",
    desc: "A professional home for your company",
    base: 2500,
    Icon: Briefcase,
  },
  {
    id: "ecommerce",
    label: "E-commerce Store",
    desc: "Sell products online",
    base: 4000,
    Icon: ShoppingCart,
  },
  {
    id: "portfolio",
    label: "Portfolio",
    desc: "Showcase your work",
    base: 1500,
    Icon: LayoutGrid,
  },
  {
    id: "blog",
    label: "Blog / News",
    desc: "Publish content regularly",
    base: 2000,
    Icon: Newspaper,
  },
  {
    id: "landing",
    label: "Landing Page",
    desc: "One focused page for a campaign",
    base: 800,
    Icon: MousePointerClick,
  },
  {
    id: "nonprofit",
    label: "Non-Profit",
    desc: "Tell your cause's story, raise support",
    base: 2200,
    Icon: HeartHandshake,
  },
]

const PAGE_OPTS = [
  {
    id: "s1",
    label: "Up to 5 pages",
    desc: "A focused, essential site",
    amount: 0,
  },
  { id: "s2", label: "6 – 10 pages", desc: "Room to grow", amount: 900 },
  { id: "s3", label: "11 – 20 pages", desc: "A larger site", amount: 2000 },
  { id: "s4", label: "20+ pages", desc: "Extensive content", amount: 3500 },
]
const PRODUCT_OPTS = [
  { id: "p1", label: "Up to 25 products", desc: "A small catalog", amount: 0 },
  {
    id: "p2",
    label: "26 – 100 products",
    desc: "A growing store",
    amount: 800,
  },
  { id: "p3", label: "100+ products", desc: "A large catalog", amount: 2000 },
]
const SIZE_OPTS = [
  {
    id: "simple",
    label: "Just the essentials",
    desc: "One clear screen",
    amount: 0,
  },
  {
    id: "standard",
    label: "A few sections",
    desc: "Features, proof, a call to action",
    amount: 400,
  },
  {
    id: "detailed",
    label: "Long-form page",
    desc: "Detailed, scroll-rich storytelling",
    amount: 900,
  },
]

const DESIGNS = [
  {
    id: "minimal",
    label: "Clean & minimal",
    desc: "Calm, spacious, content-first",
    amount: 0,
  },
  {
    id: "corporate",
    label: "Corporate & professional",
    desc: "Structured and trustworthy",
    amount: 400,
  },
  {
    id: "bold",
    label: "Bold & distinctive",
    desc: "Strong type, color, motion",
    amount: 600,
  },
  {
    id: "custom",
    label: "Fully custom",
    desc: "Designed from scratch, uniquely yours",
    amount: 1500,
  },
]

const FEATURES = [
  {
    id: "forms",
    label: "Contact forms",
    desc: "Let visitors reach you",
    amount: 150,
    Icon: Mail,
  },
  {
    id: "booking",
    label: "Booking / scheduling",
    desc: "Take appointments online",
    amount: 800,
    Icon: CalendarClock,
  },
  {
    id: "payments",
    label: "Online payments",
    desc: "Accept cards & checkout",
    amount: 900,
    Icon: CreditCard,
  },
  {
    id: "cms",
    label: "Blog / CMS",
    desc: "Edit content yourself",
    amount: 700,
    Icon: FileText,
  },
  {
    id: "multilingual",
    label: "Multilingual",
    desc: "Reach more than one language",
    amount: 0,
    Icon: Globe,
  },
  {
    id: "seo",
    label: "SEO setup",
    desc: "Get found on Google",
    amount: 400,
    Icon: Search,
  },
  {
    id: "analytics",
    label: "Analytics",
    desc: "See how visitors behave",
    amount: 200,
    Icon: BarChart3,
  },
  {
    id: "membership",
    label: "Accounts / login",
    desc: "Members-only areas",
    amount: 1200,
    Icon: Lock,
  },
  {
    id: "newsletter",
    label: "Newsletter",
    desc: "Collect & email subscribers",
    amount: 200,
    Icon: Send,
  },
]

const TIMELINES = [
  {
    id: "flexible",
    label: "Flexible",
    desc: "No fixed deadline",
    note: "Best value",
  },
  { id: "standard", label: "Standard", desc: "4 – 8 weeks", note: "" },
  { id: "asap", label: "ASAP", desc: "Under 4 weeks", note: "+20% rush" },
]

const BANDS = [
  { id: "b1", label: "Under $1,500", max: 1500 },
  { id: "b2", label: "$1,500 – $3,000", max: 3000 },
  { id: "b3", label: "$3,000 – $5,000", max: 5000 },
  { id: "b4", label: "$5,000 – $8,000", max: 8000 },
  { id: "b5", label: "$8,000+", max: Infinity },
]

const TOTAL_STEPS = 6

/* -------------------------------- helpers --------------------------------- */

const roundTo = (n, s) => Math.round(n / s) * s
const fmt = n => "$" + Math.round(n).toLocaleString("en-US")
const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())
const bandFor = mid => BANDS.find(b => mid < b.max) || BANDS[BANDS.length - 1]

function computeEstimate(s) {
  const type = TYPES.find(t => t.id === s.type)
  if (!type) return { items: [], subtotal: 0, total: 0, low: 0, high: 0 }
  const items = [{ key: "type", label: type.label, amount: type.base }]

  if (s.type === "landing") {
    const o = SIZE_OPTS.find(x => x.id === s.size)
    if (o) items.push({ key: "scope", label: o.label, amount: o.amount })
  } else if (s.type === "ecommerce") {
    const o = PRODUCT_OPTS.find(x => x.id === s.products)
    if (o) items.push({ key: "scope", label: o.label, amount: o.amount })
  } else {
    const o = PAGE_OPTS.find(x => x.id === s.pages)
    if (o) items.push({ key: "scope", label: o.label, amount: o.amount })
  }

  if (s.content === "help")
    items.push({
      key: "content",
      label: "Copywriting & content help",
      amount: 700,
    })

  const d = DESIGNS.find(x => x.id === s.design)
  if (d) items.push({ key: "design", label: d.label, amount: d.amount })

  ;(s.features || []).forEach(fid => {
    const f = FEATURES.find(x => x.id === fid)
    if (!f) return
    if (fid === "multilingual") {
      const langs = Math.max(2, s.languages || 2)
      items.push({
        key: "multilingual",
        label: "Multilingual · " + langs + " languages",
        amount: (langs - 1) * 450,
      })
    } else {
      items.push({ key: fid, label: f.label, amount: f.amount })
    }
  })

  const subtotal = items.reduce((a, b) => a + b.amount, 0)
  let total = subtotal
  if (s.timeline === "asap") {
    const rush = Math.round(subtotal * 0.2)
    items.push({ key: "rush", label: "Rush delivery (+20%)", amount: rush })
    total = subtotal + rush
  }
  const low = roundTo(total * 0.9, 50)
  const high = roundTo(total * 1.15, 50)
  return { items, subtotal, total, low, high }
}

function canContinue(step, s) {
  switch (step) {
    case 1:
      return !!s.type
    case 2: {
      const scopeOK =
        s.type === "landing"
          ? !!s.size
          : s.type === "ecommerce"
            ? !!s.products
            : !!s.pages
      return scopeOK && !!s.content
    }
    case 3:
      return !!s.design
    case 4:
      return true
    case 5:
      return !!s.timeline && !!s.budget
    case 6:
      return s.name.trim().length > 0 && isEmail(s.email)
    default:
      return true
  }
}

function useCountUp(target) {
  const [val, setVal] = useState(target)
  const ref = useRef(target)
  useEffect(() => {
    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const start = ref.current,
      end = target
    if (reduce || start === end) {
      ref.current = end
      setVal(end)
      return
    }
    const t0 = performance.now(),
      dur = 450
    let raf
    const tick = t => {
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

/* ------------------------------- components -------------------------------- */

function StepHead({ kicker, title, sub }) {
  return (
    <div className="head">
      <div className="kicker">{kicker}</div>
      <h2>{title}</h2>
      {sub && <p className="sub">{sub}</p>}
    </div>
  )
}

function OptionCard({ active, onClick, Icon, label, desc, tag, multi }) {
  return (
    <button
      type="button"
      className={"opt" + (active ? " on" : "")}
      onClick={onClick}
      aria-pressed={active}
    >
      {Icon && (
        <span className="optIcon">
          <Icon size={20} strokeWidth={1.9} />
        </span>
      )}
      <span className="optBody">
        <span className="optTop">
          <span className="optLabel">{label}</span>
          {tag && <span className="optTag">{tag}</span>}
        </span>
        {desc && <span className="optDesc">{desc}</span>}
      </span>
      <span className={"tick" + (multi ? " sq" : "")}>
        {active && <Check size={13} strokeWidth={3} />}
      </span>
    </button>
  )
}

function EstimatePanel({ est, hasType, low, high, midBand, compact }) {
  return (
    <div className={"panel" + (compact ? " compact" : "")}>
      <div className="grid" aria-hidden="true" />
      <div className="panelInner">
        <div className="estKicker">
          <Layers size={13} strokeWidth={2.2} /> Your estimate
        </div>
        {hasType ? (
          <>
            <div className="estBig">
              {fmt(low)} <span className="dash">–</span> {fmt(high)}
            </div>
            <div className="estNote">
              Working ballpark · updates as you choose
            </div>
            <div className="rule" />
            <ul className="lines">
              {est.items.map(it => (
                <li
                  key={it.key}
                  className={"line" + (it.key === "rush" ? " rush" : "")}
                >
                  <span className="lineLabel">{it.label}</span>
                  <span className="lineAmt">
                    {it.amount === 0 ? "Included" : "+" + fmt(it.amount)}
                  </span>
                </li>
              ))}
            </ul>
            {midBand && (
              <div className="estBand">
                Lands in the <strong>{midBand.label}</strong> range
              </div>
            )}
          </>
        ) : (
          <div className="estEmpty">
            <div className="estBig muted">$—</div>
            <p>
              Pick a website type to start building your estimate. Each choice
              updates the total in real time.
            </p>
          </div>
        )}
        <div className="estFoot">
          A ballpark from your choices. Your final quote is fixed after we talk
          — no surprises.
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- app ------------------------------------ */

export default function ProjectPlanner() {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [showSheet, setShowSheet] = useState(false)
  const [s, setS] = useState({
    type: "",
    pages: "",
    products: "",
    size: "",
    content: "",
    design: "",
    features: [],
    languages: 2,
    timeline: "",
    budget: "",
    name: "",
    email: "",
    company: "",
    message: "",
  })

  const set = patch => setS(p => ({ ...p, ...patch }))
  const est = computeEstimate(s)
  const hasType = !!s.type
  const midBand = hasType ? bandFor(est.total) : null
  const low = useCountUp(est.low)
  const high = useCountUp(est.high)

  // pre-select the budget band that matches the estimate when reaching step 5
  useEffect(() => {
    if (step === 5 && !s.budget && hasType)
      set({ budget: bandFor(est.total).id })
    // eslint-disable-next-line
  }, [step])

  const next = () => {
    if (!canContinue(step, s)) return
    if (step === TOTAL_STEPS) {
      setDone(true)
      return
    }
    setStep(x => Math.min(TOTAL_STEPS, x + 1))
  }
  const back = () => setStep(x => Math.max(1, x - 1))
  const goto = i => {
    if (i < step) setStep(i)
  }

  const scopeOpts =
    s.type === "landing"
      ? SIZE_OPTS
      : s.type === "ecommerce"
        ? PRODUCT_OPTS
        : PAGE_OPTS
  const scopeKey =
    s.type === "landing"
      ? "size"
      : s.type === "ecommerce"
        ? "products"
        : "pages"
  const scopeTitle =
    s.type === "landing"
      ? "How much goes on the page?"
      : s.type === "ecommerce"
        ? "How many products will you sell?"
        : "How big is the site?"

  const toggleFeature = id =>
    set({
      features: s.features.includes(id)
        ? s.features.filter(f => f !== id)
        : [...s.features, id],
    })

  const restart = () => {
    setDone(false)
    setStep(1)
    setS({
      type: "",
      pages: "",
      products: "",
      size: "",
      content: "",
      design: "",
      features: [],
      languages: 2,
      timeline: "",
      budget: "",
      name: "",
      email: "",
      company: "",
      message: "",
    })
  }

  return (
    <div className="root">
      <style>{CSS}</style>

      <header className="topbar">
        <div className="brand">
          <span className="logo">DR</span>
          <span className="brandText">
            DR Web Studio <span className="brandSub">· Project Planner</span>
          </span>
        </div>
        {!done && (
          <div className="timeHint">
            <Clock size={13} strokeWidth={2.1} /> About 2 minutes
          </div>
        )}
      </header>

      {done ? (
        <Confirmation
          s={s}
          est={est}
          low={est.low}
          high={est.high}
          onRestart={restart}
        />
      ) : (
        <>
          {/* progress */}
          <div className="progress">
            <div className="segs">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                const n = i + 1
                const state = n < step ? "done" : n === step ? "now" : "todo"
                return (
                  <button
                    key={n}
                    className={"seg " + state}
                    onClick={() => goto(n)}
                    disabled={n >= step}
                    aria-label={"Step " + n}
                  />
                )
              })}
            </div>
            <div className="progLabel">
              Step {step} of {TOTAL_STEPS}
            </div>
          </div>

          <div className="layout">
            <main className="main">
              <div className="stepCard" key={step}>
                {step === 1 && (
                  <>
                    <StepHead
                      kicker="01 · Project"
                      title="What are you building?"
                      sub="Pick the type that fits best — you can refine the details next."
                    />
                    <div className="grid2">
                      {TYPES.map(t => (
                        <OptionCard
                          key={t.id}
                          active={s.type === t.id}
                          Icon={t.Icon}
                          label={t.label}
                          desc={t.desc}
                          onClick={() =>
                            set({
                              type: t.id,
                              pages: "",
                              products: "",
                              size: "",
                            })
                          }
                        />
                      ))}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <StepHead
                      kicker="02 · Scope"
                      title={scopeTitle}
                      sub="An honest range is fine — we'll confirm the exact scope together."
                    />
                    <div className="stack">
                      {scopeOpts.map(o => (
                        <OptionCard
                          key={o.id}
                          active={s[scopeKey] === o.id}
                          label={o.label}
                          desc={o.desc}
                          tag={
                            o.amount === 0 ? "Included" : "+" + fmt(o.amount)
                          }
                          onClick={() => set({ [scopeKey]: o.id })}
                        />
                      ))}
                    </div>
                    <div className="subhead">Is your content ready?</div>
                    <div className="grid2">
                      <OptionCard
                        active={s.content === "ready"}
                        Icon={CheckCircle2}
                        label="Yes, it's ready"
                        desc="I have my text and images"
                        onClick={() => set({ content: "ready" })}
                      />
                      <OptionCard
                        active={s.content === "help"}
                        Icon={Pencil}
                        label="I'll need help"
                        desc="Copywriting & content support"
                        tag="+$700"
                        onClick={() => set({ content: "help" })}
                      />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <StepHead
                      kicker="03 · Design"
                      title="What should it feel like?"
                      sub="Your visual direction. We'll bring real options to the first call."
                    />
                    <div className="stack">
                      {DESIGNS.map(d => (
                        <OptionCard
                          key={d.id}
                          active={s.design === d.id}
                          label={d.label}
                          desc={d.desc}
                          tag={
                            d.amount === 0 ? "Included" : "+" + fmt(d.amount)
                          }
                          onClick={() => set({ design: d.id })}
                        />
                      ))}
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <StepHead
                      kicker="04 · Features"
                      title="What does it need to do?"
                      sub="Select everything you'll need. Unsure about something? Leave it — we can add it later."
                    />
                    <div className="grid2 feat">
                      {FEATURES.map(f => (
                        <OptionCard
                          key={f.id}
                          multi
                          active={s.features.includes(f.id)}
                          Icon={f.Icon}
                          label={f.label}
                          desc={f.desc}
                          tag={
                            f.id === "multilingual"
                              ? "set count"
                              : f.amount === 0
                                ? "Included"
                                : "+" + fmt(f.amount)
                          }
                          onClick={() => toggleFeature(f.id)}
                        />
                      ))}
                    </div>
                    {s.features.includes("multilingual") && (
                      <div className="stepper">
                        <span className="stepperLabel">
                          <Globe size={15} strokeWidth={2} /> How many
                          languages?
                        </span>
                        <div className="stepperCtrl">
                          <button
                            onClick={() =>
                              set({ languages: Math.max(2, s.languages - 1) })
                            }
                            aria-label="Fewer languages"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="stepperVal">{s.languages}</span>
                          <button
                            onClick={() =>
                              set({ languages: Math.min(8, s.languages + 1) })
                            }
                            aria-label="More languages"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {step === 5 && (
                  <>
                    <StepHead
                      kicker="05 · Timeline & budget"
                      title="When do you need it?"
                      sub="Timing shapes the plan — and the price."
                    />
                    <div className="grid3">
                      {TIMELINES.map(t => (
                        <button
                          key={t.id}
                          type="button"
                          className={
                            "tcard" + (s.timeline === t.id ? " on" : "")
                          }
                          onClick={() => set({ timeline: t.id })}
                          aria-pressed={s.timeline === t.id}
                        >
                          <span className="tlabel">{t.label}</span>
                          <span className="tdesc">{t.desc}</span>
                          {t.note && (
                            <span
                              className={
                                "tnote" + (t.id === "asap" ? " warn" : "")
                              }
                            >
                              {t.note}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="subhead">
                      Your estimate lands around{" "}
                      <strong>{fmt(est.total)}</strong>. What's your budget?
                    </div>
                    <div className="bands">
                      {BANDS.map(b => {
                        const isMatch = midBand && b.id === midBand.id
                        return (
                          <button
                            key={b.id}
                            type="button"
                            className={
                              "band" +
                              (s.budget === b.id ? " on" : "") +
                              (isMatch ? " match" : "")
                            }
                            onClick={() => set({ budget: b.id })}
                            aria-pressed={s.budget === b.id}
                          >
                            {b.label}
                            {isMatch && (
                              <span className="bandTag">matches estimate</span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}

                {step === 6 && (
                  <>
                    <StepHead
                      kicker="06 · Almost done"
                      title="Where do we send your estimate?"
                      sub="We'll reply within one business day with a fixed, itemized quote."
                    />
                    <div className="fields">
                      <Field
                        label="Your name"
                        required
                        value={s.name}
                        onChange={v => set({ name: v })}
                        placeholder="Jane Rivera"
                      />
                      <Field
                        label="Email"
                        required
                        value={s.email}
                        onChange={v => set({ email: v })}
                        placeholder="jane@company.com"
                        invalid={s.email.length > 0 && !isEmail(s.email)}
                        note="So we can send your quote."
                      />
                      <Field
                        label="Business name"
                        value={s.company}
                        onChange={v => set({ company: v })}
                        placeholder="Optional"
                      />
                      <div className="field">
                        <label>
                          Anything else? <span className="opt">Optional</span>
                        </label>
                        <textarea
                          rows={3}
                          value={s.message}
                          onChange={e => set({ message: e.target.value })}
                          placeholder="Links, references, questions — anything that helps."
                        />
                      </div>
                    </div>
                    <div className="reassure">
                      <CheckCircle2 size={15} strokeWidth={2.2} /> Free, no
                      obligation. We'll never share your email or send spam.
                    </div>
                  </>
                )}

                <div className="nav">
                  <button
                    className="btn ghost"
                    onClick={back}
                    disabled={step === 1}
                  >
                    <ArrowLeft size={16} strokeWidth={2.2} /> Back
                  </button>
                  {step === 4 && s.features.length === 0 ? (
                    <button className="btn primary" onClick={next}>
                      Skip — none of these{" "}
                      <ArrowRight size={16} strokeWidth={2.2} />
                    </button>
                  ) : (
                    <button
                      className="btn primary"
                      onClick={next}
                      disabled={!canContinue(step, s)}
                    >
                      {step === TOTAL_STEPS ? "Get my estimate" : "Continue"}{" "}
                      <ArrowRight size={16} strokeWidth={2.2} />
                    </button>
                  )}
                </div>
              </div>
            </main>

            {/* desktop estimate */}
            <aside className="aside">
              <div className="asideSticky">
                <EstimatePanel
                  est={est}
                  hasType={hasType}
                  low={low}
                  high={high}
                  midBand={midBand}
                />
              </div>
            </aside>
          </div>

          {/* mobile estimate bar */}
          <button className="mbar" onClick={() => setShowSheet(true)}>
            <span className="mbarLeft">
              <span className="mbarKicker">
                <Layers size={11} strokeWidth={2.4} /> Estimate
              </span>
              <span className="mbarVal">
                {hasType ? fmt(low) + " – " + fmt(high) : "$—"}
              </span>
            </span>
            <span className="mbarCta">
              View breakdown <ArrowRight size={14} strokeWidth={2.2} />
            </span>
          </button>

          {showSheet && (
            <div className="sheetWrap" onClick={() => setShowSheet(false)}>
              <div className="sheet" onClick={e => e.stopPropagation()}>
                <button
                  className="sheetClose"
                  onClick={() => setShowSheet(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
                <EstimatePanel
                  est={est}
                  hasType={hasType}
                  low={low}
                  high={high}
                  midBand={midBand}
                  compact
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
  note,
  invalid,
}) {
  return (
    <div className="field">
      <label>
        {label}{" "}
        {required ? (
          <span className="req">*</span>
        ) : (
          <span className="opt">Optional</span>
        )}
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={invalid ? "bad" : ""}
      />
      {invalid ? (
        <span className="fieldErr">
          Enter a valid email so we can reach you.
        </span>
      ) : (
        note && <span className="fieldNote">{note}</span>
      )}
    </div>
  )
}

function Confirmation({ s, est, low, high, onRestart }) {
  const type = TYPES.find(t => t.id === s.type)
  const design = DESIGNS.find(d => d.id === s.design)
  const tl = TIMELINES.find(t => t.id === s.timeline)
  const first = s.name.trim().split(" ")[0] || "there"
  const chips = [
    type && type.label,
    design && design.label,
    s.features.length
      ? s.features.length + " feature" + (s.features.length > 1 ? "s" : "")
      : null,
    s.features.includes("multilingual") ? s.languages + " languages" : null,
    tl && tl.label + " timeline",
  ].filter(Boolean)

  return (
    <div className="done">
      <div className="doneBadge">
        <CheckCircle2 size={30} strokeWidth={2} />
      </div>
      <h2>Your plan is ready, {first}.</h2>
      <p className="doneSub">
        Here's the shape of your project. We've sent a copy to your inbox and
        we'll follow up within one business day.
      </p>

      <div className="doneEst">
        <div className="doneEstKicker">
          <Sparkles size={13} strokeWidth={2.2} /> Estimated investment
        </div>
        <div className="doneEstBig">
          {fmt(low)} – {fmt(high)}
        </div>
        <div className="doneEstNote">
          Itemized and fixed once we confirm scope on a short call.
        </div>
      </div>

      <div className="chips">
        {chips.map((c, i) => (
          <span key={i} className="chip">
            {c}
          </span>
        ))}
      </div>

      <div className="next">
        <div className="nextTitle">What happens next</div>
        <ol className="nextList">
          <li>
            <span className="nstep">1</span>
            <div>
              <strong>We review your plan.</strong> Within one business day.
            </div>
          </li>
          <li>
            <span className="nstep">2</span>
            <div>
              <strong>You get a fixed quote.</strong> Itemized, no surprises.
            </div>
          </li>
          <li>
            <span className="nstep">3</span>
            <div>
              <strong>We book a short call.</strong> To lock scope and timeline.
            </div>
          </li>
        </ol>
      </div>

      <div className="doneFoot">
        Questions in the meantime? Email{" "}
        <a href="mailto:james@dr-webstudio.com">james@dr-webstudio.com</a>.
      </div>
      <button className="btn ghost restart" onClick={onRestart}>
        <ArrowLeft size={15} strokeWidth={2.2} /> Start over
      </button>
    </div>
  )
}

/* ---------------------------------- css ------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');

.root{
  --ink:#0F1622; --ink2:#3A4458; --muted:#6B7484; --canvas:#EAEEF4; --surface:#FFFFFF;
  --line:#DCE2EC; --primary:#1B4DFF; --primary-deep:#0B2DB0; --primary-tint:#EEF2FF;
  --jade:#00B383; --jade-deep:#05875F; --ring:rgba(27,77,255,.32);
  font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  color:var(--ink); background:var(--canvas);
  min-height:100%; box-sizing:border-box; padding:0 0 120px;
  -webkit-font-smoothing:antialiased;
}
.root *{box-sizing:border-box;}
.root button{font-family:inherit; cursor:pointer;}
.root h2{font-family:'Sora',sans-serif; font-weight:700; letter-spacing:-.02em; margin:0;}

/* topbar */
.topbar{display:flex; align-items:center; justify-content:space-between; gap:16px;
  padding:18px clamp(16px,5vw,48px); max-width:1120px; margin:0 auto;}
.brand{display:flex; align-items:center; gap:11px;}
.logo{width:34px; height:34px; border-radius:9px; background:var(--ink); color:#fff;
  font-family:'Sora',sans-serif; font-weight:700; font-size:14px; letter-spacing:-.03em;
  display:grid; place-items:center;}
.brandText{font-family:'Sora',sans-serif; font-weight:600; font-size:15px; letter-spacing:-.01em;}
.brandSub{color:var(--muted); font-weight:500;}
.timeHint{display:inline-flex; align-items:center; gap:6px; font-size:12.5px; color:var(--muted);
  background:var(--surface); border:1px solid var(--line); padding:6px 11px; border-radius:999px;}

/* progress */
.progress{max-width:1120px; margin:6px auto 0; padding:0 clamp(16px,5vw,48px);
  display:flex; align-items:center; gap:16px;}
.segs{display:flex; gap:6px; flex:1;}
.seg{flex:1; height:5px; border-radius:999px; border:0; background:var(--line); padding:0; transition:.3s;}
.seg.done{background:var(--jade);}
.seg.now{background:var(--primary);}
.seg.done:not(:disabled){cursor:pointer;}
.progLabel{font-size:12px; color:var(--muted); white-space:nowrap; font-variant-numeric:tabular-nums;}

/* layout */
.layout{max-width:1120px; margin:22px auto 0; padding:0 clamp(16px,5vw,48px);
  display:grid; grid-template-columns:1fr 350px; gap:28px; align-items:start;}
.main{min-width:0;}
.stepCard{background:var(--surface); border:1px solid var(--line); border-radius:20px;
  padding:clamp(22px,3.5vw,34px); box-shadow:0 1px 2px rgba(16,22,34,.04), 0 18px 40px -28px rgba(16,22,34,.22);
  animation:cardIn .42s cubic-bezier(.2,.7,.2,1);}
@keyframes cardIn{from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:none;}}

.head{margin-bottom:22px;}
.kicker{font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600; letter-spacing:.14em;
  text-transform:uppercase; color:var(--primary); margin-bottom:10px;}
.head h2{font-size:clamp(21px,3vw,27px); line-height:1.12;}
.sub{margin:9px 0 0; color:var(--muted); font-size:14.5px; line-height:1.5; max-width:52ch;}
.subhead{margin:24px 0 12px; font-family:'Sora',sans-serif; font-weight:600; font-size:15px;}
.subhead strong{color:var(--primary-deep);}

/* option grids */
.grid2{display:grid; grid-template-columns:1fr 1fr; gap:11px;}
.grid3{display:grid; grid-template-columns:repeat(3,1fr); gap:11px;}
.stack{display:flex; flex-direction:column; gap:10px;}

.opt{position:relative; display:flex; align-items:flex-start; gap:13px; text-align:left;
  background:var(--surface); border:1.5px solid var(--line); border-radius:14px;
  padding:15px 15px 15px 15px; transition:.16s; width:100%;}
.opt:hover{border-color:#BFC9DA; transform:translateY(-1px);}
.opt.on{border-color:var(--primary); background:var(--primary-tint);
  box-shadow:0 0 0 3px var(--ring);}
.opt:focus-visible{outline:none; box-shadow:0 0 0 3px var(--ring);}
.optIcon{flex:none; width:38px; height:38px; border-radius:10px; display:grid; place-items:center;
  background:#F1F4F9; color:var(--ink2); transition:.16s;}
.opt.on .optIcon{background:var(--primary); color:#fff;}
.optBody{display:flex; flex-direction:column; gap:3px; min-width:0; flex:1;}
.optTop{display:flex; align-items:center; gap:8px; flex-wrap:wrap;}
.optLabel{font-family:'Sora',sans-serif; font-weight:600; font-size:14.5px; line-height:1.2;}
.optDesc{font-size:12.5px; color:var(--muted); line-height:1.35;}
.optTag{font-family:'JetBrains Mono',monospace; font-size:10.5px; font-weight:600; color:var(--jade-deep);
  background:rgba(0,179,131,.1); padding:2px 7px; border-radius:6px; white-space:nowrap;}
.tick{flex:none; width:20px; height:20px; border-radius:50%; border:1.5px solid var(--line);
  display:grid; place-items:center; color:#fff; transition:.16s; margin-top:2px;}
.tick.sq{border-radius:6px;}
.opt.on .tick{background:var(--primary); border-color:var(--primary);}
.feat .optDesc{display:block;}

/* stepper */
.stepper{margin-top:14px; display:flex; align-items:center; justify-content:space-between;
  background:var(--primary-tint); border:1.5px solid var(--primary); border-radius:14px; padding:13px 16px;
  animation:cardIn .3s;}
.stepperLabel{display:inline-flex; align-items:center; gap:8px; font-weight:600; font-size:14px; color:var(--primary-deep);}
.stepperCtrl{display:flex; align-items:center; gap:14px;}
.stepperCtrl button{width:32px; height:32px; border-radius:9px; border:1.5px solid var(--primary);
  background:var(--surface); color:var(--primary); display:grid; place-items:center;}
.stepperCtrl button:hover{background:var(--primary); color:#fff;}
.stepperVal{font-family:'JetBrains Mono',monospace; font-weight:600; font-size:18px; min-width:18px; text-align:center;}

/* timeline cards */
.tcard{display:flex; flex-direction:column; gap:4px; align-items:flex-start; text-align:left;
  background:var(--surface); border:1.5px solid var(--line); border-radius:14px; padding:16px 15px; transition:.16s;}
.tcard:hover{border-color:#BFC9DA; transform:translateY(-1px);}
.tcard.on{border-color:var(--primary); background:var(--primary-tint); box-shadow:0 0 0 3px var(--ring);}
.tcard:focus-visible{outline:none; box-shadow:0 0 0 3px var(--ring);}
.tlabel{font-family:'Sora',sans-serif; font-weight:700; font-size:16px;}
.tdesc{font-size:12.5px; color:var(--muted);}
.tnote{margin-top:5px; font-family:'JetBrains Mono',monospace; font-size:10.5px; font-weight:600;
  color:var(--jade-deep); background:rgba(0,179,131,.1); padding:2px 7px; border-radius:6px;}
.tnote.warn{color:#B45309; background:rgba(245,158,11,.12);}

/* bands */
.bands{display:flex; flex-wrap:wrap; gap:9px;}
.band{position:relative; border:1.5px solid var(--line); background:var(--surface); border-radius:11px;
  padding:11px 15px; font-weight:600; font-size:13.5px; color:var(--ink2); transition:.16s;}
.band:hover{border-color:#BFC9DA;}
.band.on{border-color:var(--primary); background:var(--primary-tint); color:var(--primary-deep); box-shadow:0 0 0 3px var(--ring);}
.band:focus-visible{outline:none; box-shadow:0 0 0 3px var(--ring);}
.band.match{border-style:dashed; border-color:var(--jade);}
.band.match.on{border-style:solid;}
.bandTag{position:absolute; top:-9px; left:12px; font-family:'JetBrains Mono',monospace; font-size:9px;
  font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:#fff; background:var(--jade);
  padding:2px 6px; border-radius:5px;}

/* fields */
.fields{display:flex; flex-direction:column; gap:15px;}
.field{display:flex; flex-direction:column; gap:6px;}
.field label{font-size:13px; font-weight:600;}
.field .req{color:var(--primary);}
.field .opt{color:var(--muted); font-weight:500; font-size:12px;}
.field input, .field textarea{font-family:inherit; font-size:14.5px; color:var(--ink);
  border:1.5px solid var(--line); border-radius:11px; padding:12px 14px; background:var(--surface); transition:.16s; resize:vertical;}
.field input::placeholder, .field textarea::placeholder{color:#A9B2C2;}
.field input:focus, .field textarea:focus{outline:none; border-color:var(--primary); box-shadow:0 0 0 3px var(--ring);}
.field input.bad{border-color:#E0483B; box-shadow:0 0 0 3px rgba(224,72,59,.16);}
.fieldNote{font-size:12px; color:var(--muted);}
.fieldErr{font-size:12px; color:#C2362B;}
.reassure{display:flex; align-items:center; gap:8px; margin-top:16px; font-size:13px; color:var(--jade-deep);
  background:rgba(0,179,131,.07); border:1px solid rgba(0,179,131,.22); padding:11px 13px; border-radius:11px;}

/* nav */
.nav{display:flex; justify-content:space-between; gap:12px; margin-top:26px; padding-top:22px; border-top:1px solid var(--line);}
.btn{display:inline-flex; align-items:center; gap:8px; font-family:'Sora',sans-serif; font-weight:600;
  font-size:14.5px; border-radius:11px; padding:12px 20px; border:1.5px solid transparent; transition:.16s;}
.btn:focus-visible{outline:none; box-shadow:0 0 0 3px var(--ring);}
.btn.primary{background:var(--ink); color:#fff;}
.btn.primary:hover:not(:disabled){background:var(--primary); transform:translateY(-1px);}
.btn.primary:disabled{background:#C3CAD7; cursor:not-allowed;}
.btn.ghost{background:transparent; color:var(--ink2); border-color:var(--line);}
.btn.ghost:hover:not(:disabled){border-color:#BFC9DA; color:var(--ink);}
.btn.ghost:disabled{opacity:.4; cursor:not-allowed;}

/* estimate panel */
.aside{}
.asideSticky{position:sticky; top:18px;}
.panel{position:relative; overflow:hidden; background:var(--ink); color:#fff; border-radius:20px;
  box-shadow:0 24px 50px -26px rgba(15,22,34,.6);}
.panel .grid{position:absolute; inset:0; opacity:.5;
  background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);
  background-size:24px 24px; pointer-events:none;
  -webkit-mask-image:radial-gradient(120% 80% at 70% 0%,#000,transparent 75%);
          mask-image:radial-gradient(120% 80% at 70% 0%,#000,transparent 75%);}
.panelInner{position:relative; padding:22px;}
.estKicker{display:inline-flex; align-items:center; gap:7px; font-family:'JetBrains Mono',monospace;
  font-size:10.5px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:#8FA6FF; margin-bottom:14px;}
.estBig{font-family:'JetBrains Mono',monospace; font-weight:600; font-size:30px; letter-spacing:-.02em;
  line-height:1; font-variant-numeric:tabular-nums;}
.estBig .dash{color:#5C6B8C; font-weight:500;}
.estBig.muted{color:#46506B;}
.estNote{margin-top:9px; font-size:12px; color:#93A0BC;}
.rule{height:1px; background:rgba(255,255,255,.1); margin:18px 0 14px;}
.lines{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:9px;}
.line{display:flex; justify-content:space-between; align-items:baseline; gap:14px; font-size:13px;
  animation:lineIn .32s cubic-bezier(.2,.7,.2,1);}
@keyframes lineIn{from{opacity:0; transform:translateX(8px);} to{opacity:1; transform:none;}}
.lineLabel{color:#CFD6E6;}
.lineAmt{font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600; color:#fff; white-space:nowrap;}
.line.rush .lineLabel{color:#FBBF77;}
.line.rush .lineAmt{color:#FBBF77;}
.estBand{margin-top:16px; font-size:12.5px; color:#CFD6E6; background:rgba(143,166,255,.12);
  border:1px solid rgba(143,166,255,.25); padding:9px 12px; border-radius:10px;}
.estBand strong{color:#fff;}
.estEmpty p{color:#93A0BC; font-size:13px; line-height:1.5; margin:12px 0 0;}
.estFoot{margin-top:18px; font-size:11px; color:#6E7C9B; line-height:1.5; border-top:1px solid rgba(255,255,255,.08); padding-top:14px;}

/* mobile estimate bar + sheet */
.mbar{display:none;}
.sheetWrap{display:none;}

/* confirmation */
.done{max-width:620px; margin:30px auto 0; padding:0 clamp(16px,5vw,48px); text-align:center;
  animation:cardIn .5s;}
.doneBadge{width:64px; height:64px; border-radius:50%; margin:0 auto 18px; display:grid; place-items:center;
  background:rgba(0,179,131,.12); color:var(--jade-deep);}
.done h2{font-size:clamp(24px,4vw,32px); line-height:1.1;}
.doneSub{color:var(--muted); font-size:15px; line-height:1.55; margin:12px auto 0; max-width:46ch;}
.doneEst{margin:26px auto; background:var(--ink); color:#fff; border-radius:18px; padding:22px; max-width:380px;}
.doneEstKicker{display:inline-flex; align-items:center; gap:7px; font-family:'JetBrains Mono',monospace;
  font-size:10.5px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:#8FA6FF;}
.doneEstBig{font-family:'JetBrains Mono',monospace; font-weight:600; font-size:30px; margin-top:10px; letter-spacing:-.02em;}
.doneEstNote{font-size:12px; color:#93A0BC; margin-top:8px;}
.chips{display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:8px;}
.chip{font-size:12.5px; font-weight:500; color:var(--ink2); background:var(--surface);
  border:1px solid var(--line); padding:6px 12px; border-radius:999px;}
.next{text-align:left; background:var(--surface); border:1px solid var(--line); border-radius:16px;
  padding:20px 22px; margin:22px 0;}
.nextTitle{font-family:'Sora',sans-serif; font-weight:600; font-size:14px; margin-bottom:14px;}
.nextList{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:13px;}
.nextList li{display:flex; gap:13px; align-items:flex-start; font-size:14px; line-height:1.45; color:var(--ink2);}
.nextList strong{color:var(--ink);}
.nstep{flex:none; width:24px; height:24px; border-radius:50%; background:var(--primary-tint); color:var(--primary-deep);
  font-family:'JetBrains Mono',monospace; font-weight:600; font-size:12px; display:grid; place-items:center;}
.doneFoot{font-size:13.5px; color:var(--muted);}
.doneFoot a{color:var(--primary); font-weight:600; text-decoration:none;}
.doneFoot a:hover{text-decoration:underline;}
.restart{margin:22px auto 0;}

/* responsive */
@media (max-width:880px){
  .layout{grid-template-columns:1fr;}
  .aside{display:none;}
  .root{padding-bottom:90px;}
  .mbar{display:flex; position:fixed; bottom:0; left:0; right:0; z-index:40; align-items:center;
    justify-content:space-between; gap:12px; background:var(--ink); color:#fff; border:0;
    padding:13px clamp(16px,5vw,28px); box-shadow:0 -10px 30px -16px rgba(0,0,0,.5); text-align:left;}
  .mbarLeft{display:flex; flex-direction:column; gap:3px;}
  .mbarKicker{display:inline-flex; align-items:center; gap:5px; font-family:'JetBrains Mono',monospace;
    font-size:9.5px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#8FA6FF;}
  .mbarVal{font-family:'JetBrains Mono',monospace; font-weight:600; font-size:17px;}
  .mbarCta{display:inline-flex; align-items:center; gap:5px; font-family:'Sora',sans-serif; font-weight:600;
    font-size:13px; color:#fff; background:rgba(255,255,255,.12); padding:8px 13px; border-radius:9px;}
  .sheetWrap{display:flex; position:fixed; inset:0; z-index:50; background:rgba(15,22,34,.5);
    align-items:flex-end; animation:fadeIn .2s;}
  .sheet{position:relative; width:100%; max-height:82vh; overflow:auto; animation:sheetUp .3s cubic-bezier(.2,.7,.2,1);}
  .sheet .panel{border-radius:20px 20px 0 0;}
  .sheetClose{position:absolute; top:14px; right:14px; z-index:2; width:32px; height:32px; border-radius:9px;
    border:0; background:rgba(255,255,255,.12); color:#fff; display:grid; place-items:center;}
  @keyframes fadeIn{from{opacity:0;} to{opacity:1;}}
  @keyframes sheetUp{from{transform:translateY(100%);} to{transform:none;}}
}
@media (max-width:560px){
  .grid2{grid-template-columns:1fr;}
  .grid3{grid-template-columns:1fr;}
  .topbar{padding-top:14px;}
}
@media (prefers-reduced-motion:reduce){
  .stepCard,.line,.done,.sheet,.sheetWrap{animation:none !important;}
  .opt,.tcard,.btn{transition:none !important;}
}
`
