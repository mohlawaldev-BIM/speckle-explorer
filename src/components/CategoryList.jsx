function Badge({ children, variant = 'default' }) {
  const styles = {
    default: 'bg-white/5 text-white/50 border border-white/10',
    blue:    'bg-speckle-500/20 text-speckle-300 border border-speckle-500/30',
  }
  return (
    <span className={`tag ${styles[variant]}`}>{children}</span>
  )
}

function CategoryCard({ category, count, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded glass glass-hover transition-all duration-200 cursor-pointer
        ${isSelected ? 'selected-card' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={`font-mono text-sm font-medium truncate flex-1 min-w-0
          ${isSelected ? 'text-speckle-300' : 'text-white/80'}`}>
          {category}
        </p>
        <Badge variant={isSelected ? 'blue' : 'default'}>{count}</Badge>
      </div>

      {isSelected && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-speckle-400 pulse-dot inline-block" />
          <span className="text-xs text-speckle-400 font-mono">selected</span>
        </div>
      )}
    </button>
  )
}

export default function CategoryList({ entries, selectedCat, onSelect }) {
  return (
    <div className="flex flex-col gap-3 w-64 shrink-0">
      <p className="text-[10px] font-mono text-speckle-400/70 uppercase tracking-widest">
        Step 2 — Select Category
      </p>
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[600px] pr-1">
        {entries.map(([cat, objs]) => (
          <CategoryCard
            key={cat}
            category={cat}
            count={objs.length}
            isSelected={selectedCat === cat}
            onClick={() => onSelect(selectedCat === cat ? null : cat)}
          />
        ))}
      </div>
    </div>
  )
}
