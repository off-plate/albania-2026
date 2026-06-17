import { useState } from 'react'
import { trip } from '../data/trip'
import type { Place } from '../types'

const base = import.meta.env.BASE_URL

function Gallery({ photos, name }: { photos: string[]; name: string }) {
  const [active, setActive] = useState(0)
  return (
    <div className="gallery">
      <img className="gallery-main" src={base + photos[active]} alt={`${name} ${active + 1}`} />
      <div className="gallery-strip">
        {photos.map((p, i) => (
          <button
            key={p}
            className={i === active ? 'thumb thumb-active' : 'thumb'}
            onClick={() => setActive(i)}
          >
            <img src={base + p} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}

function StayCard({ p }: { p: Place }) {
  return (
    <article className="stay">
      <header className="stay-head">
        <h2>{p.name}</h2>
        {p.status && <span className={`tag tag-${p.status}`}>{p.status}</span>}
      </header>
      {p.note && <p className="stay-note">{p.note}</p>}
      {p.photos && p.photos.length > 0 && <Gallery photos={p.photos} name={p.name} />}
      {p.price && (
        <p className="stay-price">
          <span>Price</span> {p.price}
        </p>
      )}
      {p.detail && <p className="stay-detail">{p.detail}</p>}
      {p.links && (
        <div className="stay-links">
          {p.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
              {l.label} →
            </a>
          ))}
        </div>
      )}
    </article>
  )
}

export default function Stays() {
  const stays = trip.places.filter((p) => p.category === 'stay')
  return (
    <section className="stays">
      {stays.length === 0 && <p className="empty">No stays yet. Send me a listing link.</p>}
      {stays.map((p) => (
        <StayCard key={p.id} p={p} />
      ))}
    </section>
  )
}
