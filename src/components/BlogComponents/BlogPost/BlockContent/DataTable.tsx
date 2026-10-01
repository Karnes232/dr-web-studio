import React from "react"

export interface DataTableValue {
  caption: string
  headers: string[]
  numericColumns?: number[]
  rows: { _key: string; cells?: string[] }[]
  note?: string
}

const DataTable = ({ value }: { value: DataTableValue }) => {
  const numeric = new Set(value.numericColumns || [])
  const align = (i: number) => (numeric.has(i) ? "text-right tabular-nums" : "text-left")

  return (
    <figure className="my-8 mx-5 max-w-5xl lg:mx-auto lg:p-2">
      {/* wide tables scroll inside their own box so the page never scrolls sideways */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm lg:text-base">
          <caption className="mb-3 text-left font-semibold text-gray-900 dark:text-slate-100">
            {value.caption}
          </caption>
          <thead>
            <tr>
              {value.headers.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`${align(i)} border-b-2 border-gray-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:border-slate-600 dark:text-slate-400`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {value.rows.map(row => (
              <tr key={row._key}>
                {(row.cells || []).map((c, i) =>
                  i === 0 ? (
                    <th
                      key={i}
                      scope="row"
                      className={`${align(i)} border-b border-gray-200 px-3 py-2 font-medium text-gray-900 dark:border-slate-700 dark:text-slate-100`}
                    >
                      {c}
                    </th>
                  ) : (
                    <td
                      key={i}
                      className={`${align(i)} border-b border-gray-200 px-3 py-2 text-gray-700 dark:border-slate-700 dark:text-slate-200`}
                    >
                      {c}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {value.note && (
        <figcaption className="mt-2 text-sm text-gray-600 dark:text-slate-400">
          {value.note}
        </figcaption>
      )}
    </figure>
  )
}

export default DataTable
