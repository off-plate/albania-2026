import type { View } from '../App'

export default function Rail({
  view,
  setView,
}: {
  view: View
  setView: (v: View) => void
}) {
  return (
    <nav className="rail" aria-label="Sections">
      <div className="rail-group">
        <button
          className={view === 'overview' ? 'rail-head rail-active' : 'rail-head'}
          onClick={() => setView('overview')}
        >
          Overview
        </button>
        <button className="rail-sub" onClick={() => setView('overview')}>
          Explore
        </button>
        <button className="rail-sub" onClick={() => setView('overview')}>
          Notes
        </button>
        <button className="rail-sub" onClick={() => setView('itinerary')}>
          Reservations
        </button>
      </div>

      <div className="rail-group">
        <button
          className={view === 'itinerary' ? 'rail-head rail-active' : 'rail-head'}
          onClick={() => setView('itinerary')}
        >
          Itinerary
        </button>
      </div>

      <div className="rail-group">
        <button
          className={view === 'budget' ? 'rail-head rail-active' : 'rail-head'}
          onClick={() => setView('budget')}
        >
          Budget
        </button>
        <button className="rail-sub" onClick={() => setView('budget')}>
          View
        </button>
      </div>
    </nav>
  )
}
