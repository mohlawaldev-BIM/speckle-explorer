export default function ModelInfo({ projectName, modelName, objectCount, categoryCount, onExportAll }) {
  return (
    <div className="slide-up glass rounded-lg p-4 flex flex-wrap items-center gap-4">
      <Stat label="Project" value={projectName} />
      <Divider />
      <Stat label="Model"   value={modelName} />
      <Divider />
      <Stat label="Objects"    value={objectCount.toLocaleString()} accent />
      <Divider />
      <Stat label="Categories" value={categoryCount} accent />

      <div className="ml-auto">
        <button
          onClick={onExportAll}
          className="flex items-center gap-2 px-4 py-2 rounded bg-emerald-600/20 hover:bg-emerald-600/30
                     border border-emerald-500/30 text-emerald-400 text-xs font-mono transition-colors"
        >
          <DownloadIcon />
          Export All
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div>
      <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{label}</p>
      <p className={`text-sm font-medium mt-0.5 ${accent ? 'text-speckle-300 font-mono' : 'text-white/80'}`}>
        {value}
      </p>
    </div>
  )
}

function Divider() {
  return <div className="w-px h-8 bg-white/10" />
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 10v3h12v-3M8 2v8M5 7l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
