interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  optionalLabel?: string
  note?: string
  invalid?: boolean
  invalidMessage?: string
  multiline?: boolean
}

export default function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  optionalLabel,
  note,
  invalid,
  invalidMessage,
  multiline,
}: FieldProps) {
  const ring =
    "w-full rounded-lg border bg-white px-3.5 py-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:ring-2"
  const state = invalid
    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/25"
    : "border-slate-200 focus-visible:border-orange-500 focus-visible:ring-orange-500/30"

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-slate-800">
        {label}{" "}
        {required ? (
          <span className="text-orange-600">*</span>
        ) : (
          optionalLabel && (
            <span className="text-[12px] font-medium text-slate-400">
              {optionalLabel}
            </span>
          )
        )}
      </label>

      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${ring} ${state} resize-y`}
          aria-invalid={invalid || undefined}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${ring} ${state}`}
          aria-invalid={invalid || undefined}
          aria-describedby={
            invalid && invalidMessage ? `${id}-err` : note ? `${id}-note` : undefined
          }
        />
      )}

      {invalid && invalidMessage ? (
        <span id={`${id}-err`} className="text-[12px] text-red-600">
          {invalidMessage}
        </span>
      ) : (
        note && (
          <span id={`${id}-note`} className="text-[12px] text-slate-500">
            {note}
          </span>
        )
      )}
    </div>
  )
}
