import { useMemo } from 'react'
import { flattenObject, collectKeys } from '../lib/utils'

function PropertiesTable({ objects }) {
  const keys = useMemo(() => collectKeys(objects).slice(0, 30), [objects])

  const rows = useMemo(
    () => objects.map(obj => ({ id: obj.id, flat: flattenObject(obj.data || {}) })),
    [objects]
  )

  return (
    <div className="overflow-auto max-h-[500px]">
      <table className="w-full text-xs font-mono border-collapse">
        <thead className="sticky top-0 z-10">
          <tr>
            <th className="text-left px-3 py-2.5 text-white/30 font-normal whitespace-nowrap
                           bg-[#0a0f1a] border-b border-white/5 border-r border-white/5 w-28">
              Object ID
            </th>
            {keys.map(k => (
              <th
                key={k}
                className="text-left px-3 py-2.5 text-speckle-400/80 font-medium
                           whitespace-nowrap bg-[#0a0f1a] border-b border-white/5
                           border-r border-white/5 max-w-[160px]"
              >
                <span className="block truncate max-w-[140px]" title={k}>{k}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ id, flat }) => (
            <tr key={id} className="table-row border-b border-white/[0.03]">
              <td className="px-3 py-2 text-white/20 border-r border-white/5 whitespace-nowrap">
                {id.substring(0, 8)}…
              </td>
              {keys.map(k => (
                <td
                  key={k}
                  className="px-3 py-2 text-white/60 border-r border-white/5
                             max-w-[160px] transition-colors duration-100"
                >
                  <span className="block truncate max-w-[140px]" title={String(flat[k] ?? '')}>
                    {flat[k] !== undefined ? String(flat[k]) : '—'}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="glass rounded-lg flex-1 flex flex-col items-center justify-center gap-3 text-center px-12 py-20">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="opacity-20">
        <rect x="6"  y="6"  width="12" height="12" rx="2" stroke="white"    strokeWidth="1.5" />
        <rect x="22" y="6"  width="12" height="12" rx="2" stroke="white"    strokeWidth="1.5" />
        <rect x="6"  y="22" width="12" height="12" rx="2" stroke="white"    strokeWidth="1.5" />
        <rect x="22" y="22" width="12" height="12" rx="2" stroke="#0c8ee0"  strokeWidth="1.5" />
      </svg>
      <p className="text-white/20 text-sm font-mono">
        Select a category from the left<br />to view its properties
      </p>
    </div>
  )
}

export default function PropertiesPanel({ selectedCat, objects, onExport }) {
  if (!selectedCat) return <EmptyState />

  return (
    <div className="flex flex-col gap-3 flex-1 min-w-0 fade-in">
      {/* Heading row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono text-speckle-400/70 uppercase tracking-widest">
            Step 3 — Properties
          </p>
          <p className="text-sm font-mono text-white/70 mt-1">
            {selectedCat}
            <span className="text-white/30 ml-2">— {objects.length} objects</span>
          </p>
        </div>

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded bg-speckle-600 hover:bg-speckle-500
                     border border-speckle-500/40 text-white text-xs font-mono font-medium transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 10v3h12v-3M8 2v8M5 7l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Export as Excel
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-lg overflow-hidden flex-1">
        {objects.length > 0
          ? <PropertiesTable objects={objects} />
          : (
            <div className="flex items-center justify-center h-40 text-white/20 text-sm font-mono">
              No property data available for this category
            </div>
          )
        }
      </div>
    </div>
  )
}
