import { useState } from 'react'
import { trip } from './data/trip'
import Overview from './components/Overview'
import MapView from './components/MapView'
import Itinerary from './components/Itinerary'
import Stays from './components/Stays'
import Expenses from './components/Expenses'

type Tab = 'overview' | 'map' | 'days' | 'stays' | 'money'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'map', label: 'Map' },
  { id: 'days', label: 'Days' },
  { id: 'stays', label: 'Stays' },
  { id: 'money', label: 'Money' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('overview')

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead-text">
          <h1>{trip.title}</h1>
          <p>
            {trip.subtitle} · {trip.dates}
          </p>
        </div>
      </header>

      <nav className="tabs" aria-label="Sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={t.id === tab ? 'tab tab-active' : 'tab'}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="content">
        {tab === 'overview' && <Overview onJump={setTab} />}
        {tab === 'map' && <MapView />}
        {tab === 'days' && <Itinerary />}
        {tab === 'stays' && <Stays />}
        {tab === 'money' && <Expenses />}
      </main>

      <footer className="foot">
        <span>Built from what we actually decide. No auto-suggestions.</span>
      </footer>
    </div>
  )
}
