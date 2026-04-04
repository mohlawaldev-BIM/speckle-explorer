import { useState, useEffect } from 'react'

// ─── Content ────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="#36aaf5" strokeWidth="1.2" />
        <path d="M5 9c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" stroke="#0c8ee0" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="9" cy="9" r="1.5" fill="#36aaf5" />
      </svg>
    ),
    label: 'What is Speckle Explorer?',
    body: `Speckle Explorer is a lightweight browser-based tool that connects directly to the Speckle platform — an open-source data platform built for the AEC (Architecture, Engineering & Construction) industry. It lets you inspect, browse, and export the structured data inside any Speckle model without needing Revit, Rhino, or any desktop software.`,
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="3" width="14" height="12" rx="2" stroke="#36aaf5" strokeWidth="1.2" />
        <path d="M6 7h6M6 10h4" stroke="#0c8ee0" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    label: 'What problem does it solve?',
    body: `AEC models contain thousands of objects — walls, beams, doors, windows, MEP elements — each carrying rich metadata. Extracting that data traditionally requires licensed desktop tools and manual effort. Speckle Explorer cuts through that by giving anyone with a browser instant access to the raw property data behind any model, presented in a clean, navigable interface.`,
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 5h12M3 9h8M3 13h5" stroke="#36aaf5" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    label: 'How to use it',
    body: null,
    steps: [
      { n: '01', title: 'Paste a Speckle URL', desc: 'Copy the link to any Speckle model — public or private — and paste it into the input field at the top.' },
      { n: '02', title: 'Add a token (if needed)', desc: 'For private models, click the token button and enter your Personal Access Token from your Speckle profile settings.' },
      { n: '03', title: 'Load the model', desc: 'Click Load Model. The app fetches up to 2,000 objects directly from the Speckle GraphQL API and organises them by category.' },
      { n: '04', title: 'Browse categories', desc: 'All object types found in the model appear as category cards on the left — sorted by count. Click any card to inspect its objects.' },
      { n: '05', title: 'Inspect properties', desc: 'The properties panel on the right shows every flattened key-value pair for every object in that category, in a scrollable table.' },
      { n: '06', title: 'Export to Excel', desc: 'Download the selected category as a structured .xlsx file, or use Export All to get every category in one workbook with a separate sheet each.' },
    ],
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7L9 2z" stroke="#36aaf5" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Key features',
    body: null,
    features: [
      { title: 'Zero install',        desc: 'Runs entirely in the browser. No plugins, no desktop apps, no account required for public models.' },
      { title: 'GraphQL powered',     desc: 'Talks directly to the Speckle GraphQL API with proper CSRF headers and Bearer token support.' },
      { title: 'Smart pagination',    desc: 'Automatically pages through the object tree fetching up to 2,000 objects per load.' },
      { title: 'Deep flattening',     desc: 'Nested object properties are recursively flattened up to 5 levels deep, giving you every field in the table.' },
      { title: 'Category grouping',   desc: 'Objects are grouped by their category, speckle_type, type, or family field — whichever is present.' },
      { title: 'Excel export',        desc: 'Export a single category or all categories at once into a well-structured .xlsx workbook.' },
    ],
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1" stroke="#36aaf5" strokeWidth="1.2" />
        <rect x="10" y="2" width="6" height="6" rx="1" stroke="#36aaf5" strokeWidth="1.2" />
        <rect x="2" y="10" width="6" height="6" rx="1" stroke="#36aaf5" strokeWidth="1.2" />
        <rect x="10" y="10" width="6" height="6" rx="1" stroke="#0c8ee0" strokeWidth="1.2" />
      </svg>
    ),
    label: 'Technology stack',
    body: null,
    stack: [
      { name: 'Vite',         role: 'Build tool & dev server' },
      { name: 'React 18',     role: 'UI framework' },
      { name: 'Tailwind CSS', role: 'Utility-first styling' },
      { name: 'SheetJS',      role: 'Excel (.xlsx) generation' },
      { name: 'Speckle GraphQL API', role: 'Model data source' },
    ],
  },
]

// ─── Sub-components ─────────────────────────────────────────────────────────────

function StepItem({ n, title, desc }) {
  return (
    <div className="flex gap-4">
      <span
        className="shrink-0 w-8 h-8 rounded flex items-center justify-center text-[10px]
                   font-mono font-semibold text-speckle-400 border border-speckle-500/30
                   bg-speckle-500/10"
      >
        {n}
      </span>
      <div className="pt-0.5">
        <p className="text-sm font-medium text-white/80">{title}</p>
        <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function FeatureItem({ title, desc }) {
  return (
    <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06]">
      <p className="text-xs font-mono font-medium text-speckle-300">{title}</p>
      <p className="text-xs text-white/40 mt-1 leading-relaxed">{desc}</p>
    </div>
  )
}

function StackRow({ name, role }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
      <span className="text-xs font-mono font-medium text-white/70">{name}</span>
      <span className="text-xs text-white/30">{role}</span>
    </div>
  )
}

function Section({ section, isOpen, onToggle }) {
  return (
    <div className="border border-white/[0.07] rounded-lg overflow-hidden">
      {/* Accordion header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left
                   hover:bg-white/[0.02] transition-colors duration-150"
      >
        <div className="flex items-center gap-3">
          {section.icon}
          <span className="text-sm font-medium text-white/80">{section.label}</span>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          className={`shrink-0 text-white/30 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Accordion body */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-5 pb-5 pt-1 border-t border-white/[0.05]">

          {/* Plain text */}
          {section.body && (
            <p className="text-sm text-white/50 leading-relaxed">{section.body}</p>
          )}

          {/* Steps */}
          {section.steps && (
            <div className="flex flex-col gap-4 mt-1">
              {section.steps.map(s => <StepItem key={s.n} {...s} />)}
            </div>
          )}

          {/* Features grid */}
          {section.features && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {section.features.map(f => <FeatureItem key={f.title} {...f} />)}
            </div>
          )}

          {/* Stack table */}
          {section.stack && (
            <div className="mt-1">
              {section.stack.map(s => <StackRow key={s.name} {...s} />)}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ─── Modal ──────────────────────────────────────────────────────────────────────

function Modal({ onClose }) {
  const [openIndex, setOpenIndex] = useState(0)

  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function toggle(i) {
    setOpenIndex(prev => (prev === i ? null : i))
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(5, 10, 20, 0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl overflow-hidden
                   border border-white/[0.09]"
        style={{ background: '#0d1525', animation: 'modalIn 0.28s cubic-bezier(0.16,1,0.3,1) forwards' }}
        onClick={e => e.stopPropagation()}
      >

        {/* Gradient top bar */}
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #006ebf, #36aaf5, #006ebf)' }} />

        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-speckle-500/10 border border-speckle-500/20
                            flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="#0c8ee0" strokeWidth="1.2" />
                <path d="M5.5 9c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5"
                  stroke="#36aaf5" strokeWidth="1.2" strokeLinecap="round" />
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
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30
                       hover:text-white/70 hover:bg-white/[0.06] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3">
          {SECTIONS.map((section, i) => (
            <Section
              key={i}
              section={section}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
          <p className="text-[11px] text-white/20 font-mono">
            Built with Vite · React · Tailwind · Speckle API
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-speckle-600/80 hover:bg-speckle-500 border border-speckle-500/30
                       text-white text-xs font-mono transition-colors"
          >
            Got it
          </button>
        </div>

      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ─── Exported component: trigger button + modal ──────────────────────────────────

export default function AboutModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Trigger button — drop this anywhere */}
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

      {/* Portal-style modal rendered at root level */}
      {open && <Modal onClose={() => setOpen(false)} />}
    </>
  )
}
