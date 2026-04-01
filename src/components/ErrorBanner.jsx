export default function ErrorBanner({ message }) {
  const isNetwork =
    message.includes('Network error') ||
    message.includes('CORS') ||
    message.includes('fetch')

  return (
    <div className="fade-in glass rounded-lg p-4 border-red-500/20 bg-red-500/5">
      <div className="flex items-start gap-3">
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className="shrink-0 mt-0.5 text-red-400"
        >
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-red-400 font-medium">Failed to load model</p>
          <p className="text-xs text-red-400/80 mt-1 break-words">{message}</p>

          {isNetwork ? (
            <div className="mt-3 space-y-1 text-xs text-white/30">
              <p className="font-mono font-medium text-white/40">To fix this:</p>
              <p>1. Make sure you ran <code className="bg-white/5 px-1 rounded">npm run dev</code> and opened the app at <code className="bg-white/5 px-1 rounded">http://localhost:5173</code></p>
              <p>2. For private models, add your Personal Access Token via the token button above.</p>
            </div>
          ) : (
            <p className="text-xs text-white/30 mt-2">
              If this is a private model, add your Personal Access Token via the token button above.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
