import type { Place } from '../types'
import { STOP } from '../stopTypes'

const base = import.meta.env.BASE_URL

export default function PlaceCard({
  place,
  active,
  onPick,
}: {
  place: Place
  active: boolean
  onPick: (id: string) => void
}) {
  const stop = STOP[place.type]
  return (
    <article
      className={active ? 'card card-active' : 'card'}
      onClick={() => onPick(place.id)}
    >
      <span className="card-n" style={{ background: stop.color }}>
        {place.n}
      </span>

      <div className="card-body">
        <h3 className="card-title">{place.name}</h3>
        <p className="card-type">
          <span className="dot" style={{ background: stop.color }} />
          {stop.label}: {place.blurb}
        </p>
        {place.about && <p className="card-about">{place.about}</p>}
        {place.link && (
          <a
            className="card-link"
            href={place.link}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Explore {place.name} →
          </a>
        )}
      </div>

      <div className="card-photo">
        {place.photo ? (
          <img src={base + place.photo} alt={place.name} loading="lazy" />
        ) : (
          <span
            className="card-photo-ph"
            style={{
              background: `linear-gradient(135deg, ${stop.color}22, ${stop.color}44)`,
              color: stop.color,
            }}
          >
            {place.name.slice(0, 1)}
          </span>
        )}
      </div>
    </article>
  )
}
