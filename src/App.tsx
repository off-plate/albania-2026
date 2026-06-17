import { useMemo, useState } from 'react'
import { trip } from './data/trip'
import type { Place } from './types'
import TopBar from './components/TopBar'
import Rail from './components/Rail'
import Overview from './components/Overview'
import Itinerary from './components/Itinerary'
import Budget from './components/Budget'
import MapPane from './components/MapPane'

export type View = 'overview' | 'itinerary' | 'budget'

export default function App() {
  const [view, setView] = useState<View>('overview')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showMapMobile, setShowMapMobile] = useState(false)

  const allPlaces = useMemo<Place[]>(
    () => trip.sections.flatMap((s) => s.places).filter((p) => p.coords),
    [],
  )

  return (
    <div className="shell">
      <div className="left">
        <TopBar onToggleMap={() => setShowMapMobile((v) => !v)} mapOpen={showMapMobile} />
        <div className="left-body">
          <Rail view={view} setView={setView} />
          <div className="panel">
            {view === 'overview' && <Overview setView={setView} onPick={setActiveId} />}
            {view === 'itinerary' && (
              <Itinerary activeId={activeId} onPick={setActiveId} />
            )}
            {view === 'budget' && <Budget />}
          </div>
        </div>
      </div>

      <div className={showMapMobile ? 'map-col map-col-open' : 'map-col'}>
        <MapPane places={allPlaces} activeId={activeId} onPick={setActiveId} />
      </div>
    </div>
  )
}
