import { trip } from '../data/trip'

export default function Itinerary() {
  return (
    <section className="itinerary">
      {trip.days.map((day, i) => (
        <article className="day" key={i}>
          <div className="day-rail">
            <span className="day-dot" />
            {i < trip.days.length - 1 && <span className="day-line" />}
          </div>
          <div className="day-body">
            <header className="day-head">
              <h2>{day.title}</h2>
              {day.date && <time>{day.date}</time>}
              {day.base && <span className="day-base">sleep: {day.base}</span>}
            </header>
            <ul className="stops">
              {day.stops.map((s, j) => (
                <li key={j}>
                  {s.time && <span className="stop-time">{s.time}</span>}
                  <span className="stop-label">{s.label}</span>
                  {s.note && <span className="stop-note">{s.note}</span>}
                </li>
              ))}
            </ul>
            {day.note && <p className="day-note">{day.note}</p>}
          </div>
        </article>
      ))}
    </section>
  )
}
