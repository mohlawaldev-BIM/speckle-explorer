import { useState } from 'react'

const DEFAULT_URL = 'https://app.speckle.systems/projects/4d6186be26/models/af994cab37'

export default function UrlInput({ onLoad, isLoading }) {
  const [url, setUrl]           = useState(DEFAULT_URL)
  const [token, setToken]       = useState('')
  const [showToken, setShowToken] = useState(false)

  const handleLoad = () => onLoad(url, token)

  return (
    <div className="glass rounded-lg p-5 fade-in">
      <p className="text-[10px] font-mono text-speckle-400/70 uppercase tracking-widest mb-3">
        Step 1 — Connect Model
      </p>

      <div className="flex flex-col gap-3">
        {/* URL row */}
        <div className="flex gap-3 items-center">
          <div
            className="flex-1 flex items-center gap-2 bg-white/[0.03] border border-white/[0.08]
                       rounded px-3 py-2.5 focus-within:border-speckle-500/50 transition-colors"
          >
            <LinkIcon />
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoad()}
              placeholder="https://app.speckle.systems/projects/.../models/..."
              className="flex-1 bg-transparent text-sm text-white/80 font-mono min-w-0"
            />
          </div>

          <button
            onClick={() => setShowToken(v => !v)}
            title="Optional: Personal Access Token for private models"
            className={`px-3 py-2.5 rounded border text-xs font-mono transition-colors whitespace-nowrap
              ${showToken
                ? 'bg-speckle-500/20 border-speckle-500/40 text-speckle-300'
                : 'bg-white/[0.03] border-white/[0.08] text-white/30 hover:border-white/20'}`}
          >
            token
          </button>

          <button
            onClick={handleLoad}
            disabled={isLoading}
            className="px-5 py-2.5 rounded bg-speckle-600 hover:bg-speckle-500 disabled:opacity-40
                       text-white text-sm font-mono font-medium transition-colors whitespace-nowrap
                       border border-speckle-500/30 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading…' : 'Load Model'}
          </button>
        </div>

        {/* Token row */}
        {showToken && (
          <div
            className="fade-in flex items-center gap-2 bg-white/[0.02] border border-white/[0.06]
                       rounded px-3 py-2.5"
          >
            <LockIcon />
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="Personal access token (for private models)"
              className="flex-1 bg-transparent text-sm text-white/70 font-mono"
            />
          </div>
        )}

        {/* Progress bar */}
        <div className="overflow-hidden h-0.5 rounded-full bg-white/5 w-full">
          {isLoading && <div className="progress-bar rounded-full" />}
        </div>
      </div>
    </div>
  )
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-white/30">
      <path
        d="M6 3.5H4a2.5 2.5 0 000 5h2M10 3.5h2a2.5 2.5 0 010 5h-2M5 8h6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 text-white/20">
      <rect x="5" y="7" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 7V5.5a3 3 0 016 0V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
