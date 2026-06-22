import { StoreProvider, useStore } from './store'
import TopBar from './components/TopBar'
import Rail from './components/Rail'
import Overview from './components/Overview'
import Itinerary from './components/Itinerary'
import Budget from './components/Budget'
import MapPane from './components/MapPane'
import Snackbar from './components/Snackbar'

function Shell() {
  const { view, loading, error, data, mapMobileOpen } = useStore()

  return (
    <div className="shell">
      <div className="left">
        <TopBar />
        <div className="left-body">
          <Rail />
          <div className="panel">
            {loading && !data && (
              <div className="boot">
                <div className="boot-skel" />
                <div className="boot-skel" />
                <div className="boot-skel short" />
                <p>Loading your trip…</p>
              </div>
            )}
            {error && !data && (
              <div className="boot-error">
                <p>We couldn’t load this trip.</p>
                <span>{error}</span>
              </div>
            )}
            {data && (
              <>
                {view === 'overview' && <Overview />}
                {view === 'itinerary' && <Itinerary />}
                {view === 'budget' && <Budget />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className={mapMobileOpen ? 'map-col map-col-open' : 'map-col'}>
        <MapPane />
      </div>

      {error && data && <div className="toast">{error}</div>}
      <Snackbar />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
