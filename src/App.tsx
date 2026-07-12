import { useEffect, useState } from 'react'
import { StoreProvider, useStore } from './store'
import TopBar from './components/TopBar'
import Rail from './components/Rail'
import Plans from './components/Plans'
import Overview from './components/Overview'
import Itinerary from './components/Itinerary'
import Budget from './components/Budget'
import MapPane from './components/MapPane'
import Snackbar from './components/Snackbar'

// This deployment is the Albania trip. The root URL loads it directly; no hub,
// no hash needed. (Other trip slugs still work as #/<slug> if ever needed.)
const DEFAULT_SLUG = 'albania-2026'

function useRouteSlug(): string {
  const read = () => {
    const h = window.location.hash.replace(/^#\/?/, '').trim()
    return h || DEFAULT_SLUG
  }
  const [slug, setSlug] = useState<string>(read)
  useEffect(() => {
    const on = () => setSlug(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return slug
}

function Shell() {
  const { view, loading, error, data, mapMobileOpen } = useStore()

  return (
    <div className="shell">
      <div className="left">
        <TopBar />
        <div className="left-body">
          <Rail />
          <div className="panel">
            {/* Plans is code-only, always available (does not wait for the DB). */}
            {view === 'plans' && <Plans />}

            {view !== 'plans' && loading && !data && (
              <div className="boot">
                <div className="boot-skel" />
                <div className="boot-skel" />
                <div className="boot-skel short" />
                <p>Loading your trip…</p>
              </div>
            )}
            {view !== 'plans' && error && !data && (
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
  const slug = useRouteSlug()
  return (
    <StoreProvider slug={slug} key={slug}>
      <Shell />
    </StoreProvider>
  )
}
