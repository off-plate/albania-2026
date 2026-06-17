import type { View } from '../App'
import { trip } from '../data/trip'

const base = import.meta.env.BASE_URL

const RES_ICON: Record<string, string> = {
  flight: '✈',
  lodging: '⌂',
  car: '⛟',
  train: '☶',
  other: '⊕',
}

function czk(n: number) {
  return new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' Kč'
}

export default function Overview({
  setView,
}: {
  setView: (v: View) => void
  onPick: (id: string) => void
}) {
  const placeCount = trip.sections.flatMap((s) => s.places).length
  const spent = trip.expenses.reduce(
    (sum, e) => sum + (e.currency === 'EUR' ? e.amount * trip.eurToCzk : e.amount),
    0,
  )
  const lodging = trip.reservations.find((r) => r.kind === 'lodging')

  return (
    <div className="overview">
      <div className="hero">
        <div className="hero-card">
          <h1>{trip.title}</h1>
          <div className="hero-meta">
            <span className="hero-dates">{trip.dateRange}</span>
            <span className="avatars">
              {trip.travelers.map((t) => (
                <span className="avatar" key={t.id} title={t.name}>
                  {t.initials}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      <p className="overview-summary">{trip.summary}</p>

      <div className="ov-grid">
        <button className="ov-tile" onClick={() => setView('itinerary')}>
          <span className="ov-n">{placeCount}</span>
          <span className="ov-l">stops planned</span>
        </button>
        <button className="ov-tile" onClick={() => setView('budget')}>
          <span className="ov-n">{czk(spent)}</span>
          <span className="ov-l">logged so far</span>
        </button>
        <button className="ov-tile" onClick={() => setView('itinerary')}>
          <span className="ov-n">{trip.travelers.length}</span>
          <span className="ov-l">travellers</span>
        </button>
      </div>

      <h2 className="ov-h">Reservations</h2>
      <div className="res-row">
        {(['flight', 'lodging', 'car', 'train', 'other'] as const).map((k) => {
          const has = trip.reservations.some((r) => r.kind === k)
          return (
            <div className={has ? 'res-chip res-chip-on' : 'res-chip'} key={k}>
              <span className="res-icon">{RES_ICON[k]}</span>
              <span className="res-label">{k}</span>
            </div>
          )
        })}
      </div>

      {lodging && (
        <div className="res-detail">
          <div className="res-detail-head">
            <h3>{lodging.title}</h3>
            {lodging.dates && <span className="res-dates">{lodging.dates}</span>}
          </div>
          {lodging.detail && <p className="res-text">{lodging.detail}</p>}
          {lodging.price && <p className="res-price">{lodging.price}</p>}
          {lodging.photos && (
            <div className="res-photos">
              {lodging.photos.slice(0, 6).map((p) => (
                <img key={p} src={base + p} alt="" loading="lazy" />
              ))}
            </div>
          )}
          {lodging.link && (
            <a href={lodging.link} target="_blank" rel="noreferrer">
              View listing →
            </a>
          )}
        </div>
      )}

      <h2 className="ov-h">Notes</h2>
      <p className="notes">{trip.notes}</p>
    </div>
  )
}
