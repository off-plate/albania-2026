export default function TopBar({
  onToggleMap,
  mapOpen,
}: {
  onToggleMap: () => void
  mapOpen: boolean
}) {
  return (
    <header className="topbar">
      <div className="topbar-l">
        <span className="brand">
          <span className="brand-mark" aria-hidden>
            ◍
          </span>
          Italy 2026
        </span>
        <span className="saved">Saved</span>
      </div>
      <div className="topbar-r">
        <button className="btn-map-toggle" onClick={onToggleMap}>
          {mapOpen ? 'List' : 'Map'}
        </button>
        <button className="btn-ghost">Share</button>
      </div>
    </header>
  )
}
