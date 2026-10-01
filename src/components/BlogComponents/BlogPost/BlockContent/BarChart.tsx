import React from "react"

export interface BarChartValue {
  title: string
  unit?: string
  max?: number
  bars: { _key: string; label: string; value: number; n?: number; highlight?: boolean }[]
  note?: string
}

// Horizontal bars drawn with plain elements: no chart library, renders on the server,
// and the numbers stay in the HTML for readers, screen readers and search engines.
const BarChart = ({ value }: { value: BarChartValue }) => {
  const unit = value.unit || ""
  const max = value.max || Math.max(...value.bars.map(b => b.value), 1)
  const fmt = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(1)}${unit}`
  const summary = value.bars.map(b => `${b.label}: ${fmt(b.value)}`).join("; ")

  return (
    <figure className="my-8 mx-5 max-w-5xl lg:mx-auto lg:p-2">
      <p className="mb-4 font-semibold text-gray-900 dark:text-slate-100">{value.title}</p>
      <div role="img" aria-label={`${value.title}. ${summary}`} className="grid gap-2">
        {value.bars.map(b => (
          <div
            key={b._key}
            className="grid grid-cols-[minmax(7rem,38%)_1fr] items-center gap-3 text-sm"
            aria-hidden="true"
          >
            <span className="text-right text-gray-700 dark:text-slate-300">
              {b.label}
              {b.n != null && (
                <span className="ml-1 text-xs text-gray-500 dark:text-slate-400">(n={b.n})</span>
              )}
            </span>
            <span className="flex items-center gap-2">
              <span className="min-w-0 flex-1">
                <span
                  className={`block h-5 rounded-r ${
                    b.highlight ? "bg-amber-500 dark:bg-amber-400" : "bg-teal-600 dark:bg-teal-400"
                  }`}
                  style={{ width: `${Math.max((b.value / max) * 100, 1)}%` }}
                />
              </span>
              <span className="w-14 shrink-0 tabular-nums font-medium text-gray-900 dark:text-slate-100">
                {fmt(b.value)}
              </span>
            </span>
          </div>
        ))}
      </div>
      {/* same numbers as a table for screen readers */}
      <table className="sr-only">
        <caption>{value.title}</caption>
        <tbody>
          {value.bars.map(b => (
            <tr key={b._key}>
              <th scope="row">{b.label}</th>
              <td>{fmt(b.value)}</td>
              {b.n != null && <td>n={b.n}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {value.note && (
        <figcaption className="mt-3 text-sm text-gray-600 dark:text-slate-400">
          {value.note}
        </figcaption>
      )}
    </figure>
  )
}

export default BarChart
