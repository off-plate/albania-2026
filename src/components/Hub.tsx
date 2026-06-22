import { useEffect, useState } from 'react'
import { loadTripSummaries } from '../lib/api'
import { asset } from '../lib/asset'
import { fmtCZK, fmtDateRange } from '../lib/format'
import type { TripSummary } from '../types'

export default function Hub() {
  const [trips, setTrips] = useState<TripSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTripSummaries()
      .then(setTrips)
      .catch((e) => setError(e?.message ?? 'Could not load trips.'))
  }, [])

  return (
    <div className="hub">
      <header className="hub-head">
        <span className="hub-brand">
          <span className="hub-mark">◇</span> Trips
        </span>
        <h1 className="hub-title">Choose a trip</h1>
        <p className="hub-sub">Each one opens its own planner: map, day-by-day itinerary and budget.</p>
      </header>

      {error && <div className="hub-error">{error}</div>}

      {!trips && !error && (
        <div className="hub-list">
          <div className="hub-card hub-skel" />
          <div className="hub-card hub-skel" />
        </div>
      )}

      {trips && (
        <div className="hub-list">
          {trips.map((t) => (
            <a className="hub-card" key={t.id} href={`#/${t.slug}`}>
              <div
                className="hub-card-img"
                style={{ backgroundImage: t.heroPhoto ? `url(${asset(t.heroPhoto)})` : undefined }}
              />
              <div className="hub-card-body">
                <h2 className="hub-card-title">{t.title}</h2>
                {t.dateStart && <div className="hub-card-dates">{fmtDateRange(t.dateStart, t.dateEnd)}</div>}
                <div className="hub-card-meta">
                  <span className="hub-price">{fmtCZK(t.totalCzk)}</span>
                  <span className="hub-dot">·</span>
                  <span>{t.days} days</span>
                  <span className="hub-dot">·</span>
                  <span className="hub-transport">{t.transport || 'Car'}</span>
                </div>
                <span className="hub-open">Open planner →</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
