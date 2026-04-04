import { useState, useEffect } from 'react'

// ─── Modal ───────────────────────────────────────────────────────────────────────

function Modal({ onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5, 10, 20, 0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl overflow-hidden border border-white/[0.09]"
        style={{ background: '#0d1525', animation: 'modalIn 0.28s cubic-bezier(0.16,1,0.3,1) forwards' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top gradient bar */}
        <div className="h-0.5 w-full shrink-0" style={{ background: 'linear-gradient(90deg, #006ebf, #36aaf5, #006ebf)' }} />

        {/* Header — stays fixed at top */}
        <div className="shrink-0 px-6 py-5 flex items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-speckle-500/10 border border-speckle-500/20 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="#0c8ee0" strokeWidth="1.2" />
                <path d="M5.5 9c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5" stroke="#36aaf5" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="9" cy="9" r="1.5" fill="#0c8ee0" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">About Speckle Explorer</h2>
              <p className="text-[11px] text-white/30 font-mono mt-0.5">Model Data Viewer &amp; Exporter</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

          {/* 1 — What is Speckle Explorer */}
          <section>
            <SectionHeading icon={<IconSpeckle />} title="What is Speckle Explorer?" />
            <p className="text-sm text-white/55 leading-relaxed mt-3">
              Speckle Explorer is a lightweight, browser-based tool that connects directly to the Speckle
              platform — an open-source data platform built for the AEC (Architecture, Engineering &amp;
              Construction) industry. It lets you inspect, browse, and export the structured data inside
              any Speckle model without needing Revit, Rhino, or any other desktop software.
            </p>
          </section>

          <Divider />

          {/* 2 — What problem does it solve */}
          <section>
            <SectionHeading icon={<IconProblem />} title="What problem does it solve?" />
            <p className="text-sm text-white/55 leading-relaxed mt-3">
              AEC models contain thousands of objects — walls, beams, doors, windows, MEP elements —
              each carrying rich metadata. Extracting that data traditionally requires licensed desktop
              tools and significant manual effort. Speckle Explorer removes that barrier entirely, giving
              anyone with a browser instant access to the raw property data behind any model, presented
              in a clean and navigable interface.
            </p>
          </section>

          <Divider />

          {/* 3 — How to use it */}
          <section>
            <SectionHeading icon={<IconList />} title="How to use it" />
            <div className="mt-4 flex flex-col gap-3">
              {[
                { n: '01', title: 'Paste a Speckle URL',    desc: 'Copy the link to any Speckle model — public or private — and paste it into the input field at the top of the page.' },
                { n: '02', title: 'Add a token (if needed)', desc: 'For private models, click the token button and enter your Personal Access Token from your Speckle profile settings.' },
                { n: '03', title: 'Load the model',          desc: 'Click Load Model. The app fetches up to 2,000 objects directly from the Speckle GraphQL API and organises them by category.' },
                { n: '04', title: 'Browse categories',       desc: 'All object types found in the model appear as category cards on the left, sorted by count. Click any card to inspect its objects.' },
                { n: '05', title: 'Inspect properties',      desc: 'The properties panel on the right shows every flattened key-value pair for every object in that category, in a scrollable table.' },
                { n: '06', title: 'Export to Excel',         desc: 'Download the selected category as a structured .xlsx file, or use Export All to get every category in one workbook with a separate sheet each.' },
              ].map(s => (
                <div key={s.n} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded flex items-center justify-center text-[10px] font-mono font-semibold text-speckle-400 border border-speckle-500/30 bg-speckle-500/10">
                    {s.n}
                  </span>
                  <div className="pt-0.5">
                    <p className="text-sm font-medium text-white/80">{s.title}</p>
                    <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 4 — Key features */}
          <section>
            <SectionHeading icon={<IconStar />} title="Key features" />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { title: 'Zero install',       desc: 'Runs entirely in the browser. No plugins, no desktop apps, no account required for public models.' },
                { title: 'GraphQL powered',    desc: 'Talks directly to the Speckle GraphQL API with proper CSRF headers and Bearer token support.' },
                { title: 'Smart pagination',   desc: 'Automatically pages through the object tree, fetching up to 2,000 objects per load.' },
                { title: 'Deep flattening',    desc: 'Nested object properties are recursively flattened up to 5 levels deep, surfacing every field in the table.' },
                { title: 'Category grouping',  desc: 'Objects are grouped by their category, speckle_type, type, or family field — whichever is present.' },
                { title: 'Excel export',       desc: 'Export a single category or all categories at once into a well-structured .xlsx workbook.' },
              ].map(f => (
                <div key={f.title} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-xs font-mono font-medium text-speckle-300">{f.title}</p>
                  <p className="text-xs text-white/40 mt-1 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* 5 — Technology stack */}
          <section>
            <SectionHeading icon={<IconStack />} title="Technology stack" />
            <div className="mt-4 rounded-lg border border-white/[0.06] overflow-hidden">
              {[
                { name: 'Vite',                role: 'Build tool & dev server' },
                { name: 'React 18',            role: 'UI framework' },
                { name: 'Tailwind CSS',        role: 'Utility-first styling' },
                { name: 'SheetJS (xlsx)',       role: 'Excel (.xlsx) file generation' },
                { name: 'Speckle GraphQL API', role: 'Model data source' },
              ].map((s, i, arr) => (
                <div
                  key={s.name}
                  className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
                >
                  <span className="text-sm font-mono font-medium text-white/70">{s.name}</span>
                  <span className="text-xs text-white/30">{s.role}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom breathing room */}
          <div className="h-2" />

        </div>

        {/* Footer — stays fixed at bottom */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
          <p className="text-[11px] text-white/20 font-mono">
            Built with Vite · React · Tailwind · Speckle API
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-speckle-600/80 hover:bg-speckle-500 border border-speckle-500/30 text-white text-xs font-mono transition-colors"
          >
            Got it
          </button>
        </div>

      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ─── Reusable helpers ─────────────────────────────────────────────────────────────

function Divider() {
  return <div className="border-t border-white/[0.05]" />
}

function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <h3 className="text-sm font-semibold text-white/90 tracking-tight">{title}</h3>
    </div>
  )
}

function IconSpeckle() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="#36aaf5" strokeWidth="1.2" />
      <path d="M5 9c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" stroke="#0c8ee0" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="9" cy="9" r="1.5" fill="#36aaf5" />
    </svg>
  )
}

function IconProblem() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="3" width="14" height="12" rx="2" stroke="#36aaf5" strokeWidth="1.2" />
      <path d="M6 7h6M6 10h4" stroke="#0c8ee0" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function IconList() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 5h12M3 9h8M3 13h5" stroke="#36aaf5" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7L9 2z" stroke="#36aaf5" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function IconStack() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="6" height="6" rx="1" stroke="#36aaf5" strokeWidth="1.2" />
      <rect x="10" y="2" width="6" height="6" rx="1" stroke="#36aaf5" strokeWidth="1.2" />
      <rect x="2" y="10" width="6" height="6" rx="1" stroke="#36aaf5" strokeWidth="1.2" />
      <rect x="10" y="10" width="6" height="6" rx="1" stroke="#0c8ee0" strokeWidth="1.2" />
    </svg>
  )
}

// ─── Default export: trigger button + modal ───────────────────────────────────────

export default function AboutModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded border border-white/[0.08]
                   bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20
                   text-white/50 hover:text-white/80 text-xs font-mono transition-all duration-150"
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7 6.5v3M7 4.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        About
      </button>

      {open && <Modal onClose={() => setOpen(false)} />}
    </>
  )
}
