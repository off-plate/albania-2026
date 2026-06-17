import { trip } from '../data/trip'

export default function Overview({ onJump }: { onJump: (t: any) => void }) {
  const stays = trip.places.filter((p) => p.category === 'stay')
  const pins = trip.places.filter((p) => p.coords)

  return (
    <section className="overview">
      <p className="lede">{trip.summary}</p>

      <dl className="facts">
        {trip.facts.map((f) => (
          <div className="fact" key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="who">
        <span className="who-label">Travelling</span>
        <span className="who-names">
          {trip.travelers.map((t) => t.name).join(' · ')}
        </span>
      </div>

      <div className="jump">
        <button className="jump-card" onClick={() => onJump('map')}>
          <span className="jump-n">{pins.length}</span>
          <span className="jump-l">places on the map</span>
        </button>
        <button className="jump-card" onClick={() => onJump('stays')}>
          <span className="jump-n">{stays.length}</span>
          <span className="jump-l">stays in the running</span>
        </button>
        <button className="jump-card" onClick={() => onJump('days')}>
          <span className="jump-n">{trip.days.length}</span>
          <span className="jump-l">days to plan</span>
        </button>
      </div>

      <p className="note-block">
        This planner only holds what we decide together. Send a place, a link, a
        price or a note and it gets saved here for good.
      </p>
    </section>
  )
}
