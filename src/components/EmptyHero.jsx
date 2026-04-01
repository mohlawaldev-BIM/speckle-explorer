export default function EmptyHero() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-16 text-center fade-in">
      <div className="w-20 h-20 rounded-full border border-speckle-500/20 flex items-center justify-center">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="4"  fill="#0c8ee0"  opacity="0.8" />
          <circle cx="18" cy="18" r="10" stroke="#0c8ee0" strokeWidth="1" opacity="0.3" />
          <circle cx="18" cy="18" r="16" stroke="#0c8ee0" strokeWidth="0.5" opacity="0.15" />
          <path d="M10 18c0-4.418 3.582-8 8-8" stroke="#36aaf5" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      <div>
        <p className="text-white/40 font-mono text-sm">Paste a Speckle model URL above</p>
        <p className="text-white/20 font-mono text-xs mt-1">and click Load Model to begin</p>
      </div>

      <div className="glass rounded px-4 py-3 text-left max-w-md">
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-2">Supported format</p>
        <p className="text-xs font-mono text-white/30">
          https://app.speckle.systems/projects/
          <span className="text-speckle-400/60">ID</span>
          /models/
          <span className="text-speckle-400/60">ID</span>
        </p>
      </div>
    </div>
  )
}
