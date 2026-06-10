interface StepHeadProps {
  kicker: string
  title: string
  sub?: string
}

export default function StepHead({ kicker, title, sub }: StepHeadProps) {
  return (
    <div className="mb-6">
      <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-600">
        {kicker}
      </div>
      <h2
        className="text-2xl leading-tight font-bold text-slate-900 md:text-[1.7rem]"
        style={{ fontFamily: "var(--font-crimson-pro)" }}
      >
        {title}
      </h2>
      {sub && (
        <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-slate-500">
          {sub}
        </p>
      )}
    </div>
  )
}
