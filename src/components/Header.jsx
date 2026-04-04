import AboutModal from './AboutModal'

export default function Header({ objectCount, status }) {
  return (
    <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
      {/* Left — logo + title */}
      <div className="flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke="#0c8ee0" strokeWidth="1.5" />
          <path
            d="M8 14c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6"
            stroke="#36aaf5"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="14" cy="14" r="2.5" fill="#0c8ee0" />
        </svg>
        <div>
          <h1 className="font-mono text-sm font-semibold text-white tracking-tight">
            Speckle Explorer
          </h1>
          <p className="text-[10px] text-white/30 font-mono">Model Data Viewer &amp; Exporter</p>
        </div>
      </div>

      {/* Right — status pill + about button */}
      <div className="flex items-center gap-3">
        {status === 'done' && (
          <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            {objectCount.toLocaleString()} objects loaded
          </div>
        )}
        <AboutModal />
      </div>
    </header>
  )
}
