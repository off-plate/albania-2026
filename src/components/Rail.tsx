import { useStore, type View } from '../store'

const ITEMS: { key: View; label: string }[] = [
  { key: 'plans', label: 'Plans' },
  { key: 'overview', label: 'Overview' },
  { key: 'itinerary', label: 'Itinerary' },
  { key: 'budget', label: 'Budget' },
]

// One hand-traced route glyph, reused. Not a Lucide icon.
function Glyph() {
  return (
    <svg className="rail-glyph" width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path d="M3 11c3 0 0-4 3-4s0-4 3-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="3" cy="11" r="1.4" fill="currentColor" />
      <circle cx="11" cy="3" r="1.4" fill="currentColor" />
    </svg>
  )
}

export default function Rail() {
  const { view, setView, canEdit, isEditor, mode } = useStore()
  return (
    <nav className="rail">
      <div className="rail-group">
        {ITEMS.map((it) => (
          <button
            key={it.key}
            className={`rail-item ${view === it.key ? 'rail-active' : ''}`}
            onClick={() => setView(it.key)}
          >
            <Glyph />
            {it.label}
          </button>
        ))}
      </div>
      <div className="rail-foot">
        <span className={`mode-pill ${canEdit ? 'mode-edit' : 'mode-view'}`}>
          <span className="mode-dot" />
          {canEdit ? 'Editing' : isEditor && mode === 'view' ? 'Viewing' : 'Viewing'}
        </span>
      </div>
    </nav>
  )
}
