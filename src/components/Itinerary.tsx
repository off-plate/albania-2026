import { trip } from '../data/trip'
import PlaceCard from './PlaceCard'

export default function Itinerary({
  activeId,
  onPick,
}: {
  activeId: string | null
  onPick: (id: string) => void
}) {
  return (
    <div className="itinerary">
      <header className="panel-head">
        <h1>{trip.title}</h1>
        <p>{trip.dateRange}</p>
      </header>

      {trip.sections.map((section) => (
        <section className="sec" key={section.id}>
          <div className="sec-head">
            <div className="sec-when">
              {section.dayLabel && <span className="sec-day">{section.dayLabel}</span>}
              {section.dateLabel && <span className="sec-date">{section.dateLabel}</span>}
            </div>
            <h2 className="sec-focus">{section.title}</h2>
          </div>
          <div className="cards">
            {section.places.map((p) => (
              <PlaceCard
                key={p.id}
                place={p}
                active={p.id === activeId}
                onPick={onPick}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
