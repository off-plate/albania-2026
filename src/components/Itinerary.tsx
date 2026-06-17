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
          <h2 className="sec-title">{section.title}</h2>
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
