import { useStore } from '../store'
import { VARIANTS } from '../data/variants'
import { POIS, POI_COLOR, POI_LABEL } from '../data/pois'
import { fmtCZK } from '../lib/format'

export const baseId = (name: string) =>
  name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const nights = (n: number) => (n === 1 ? 'noc' : n < 5 ? 'noci' : 'nocí')

export default function PlanMap() {
  const { activeVariantId, planFocus, setPlanFocus } = useStore()
  const v = VARIANTS.find((x) => x.id === activeVariantId) ?? VARIANTS[0]

  return (
    <div className="planmap">
      <div className="panel-head">
        <h1>Plán &amp; mapa</h1>
        <p>Vyber základnu, mapa se na ni zaměří a nakreslí trasu k výletům.</p>
      </div>

      <div className="pm-filter">
        <button
          className={planFocus === 'all' ? 'pm-chip pm-chip-on' : 'pm-chip'}
          onClick={() => setPlanFocus('all')}
        >
          Vše
        </button>
        {v.stints.map((s) => {
          const id = baseId(s.base)
          return (
            <button
              key={id}
              className={planFocus === id ? 'pm-chip pm-chip-on' : 'pm-chip'}
              onClick={() => setPlanFocus(id)}
            >
              {s.base}
            </button>
          )
        })}
      </div>

      {v.stints.map((s) => {
        const id = baseId(s.base)
        const pois = POIS.filter((p) => p.nearBase === id)
        const hotel = s.lodging?.[0]
        const dim = planFocus !== 'all' && planFocus !== id
        return (
          <article
            key={id}
            className={`pm-day ${planFocus === id ? 'pm-day-on' : ''} ${dim ? 'pm-day-dim' : ''}`}
            onClick={() => setPlanFocus(id)}
          >
            <div className="pm-day-head">
              <span className="pm-day-base">{s.base}</span>
              <span className="pm-day-dates">{s.dates} · {s.nights} {nights(s.nights)}</span>
            </div>
            {hotel && (
              <div className="pm-day-hotel">
                ⌂ {hotel.name} · {fmtCZK(hotel.priceCzk)}
                {hotel.note ? ` · ${hotel.note}` : ''}
              </div>
            )}
            <ul className="pm-poi">
              {pois.map((p) => (
                <li key={p.id}>
                  <span className="dot" style={{ background: POI_COLOR[p.category] }} />
                  <span className="pm-poi-name">{p.name}</span>
                  <span className="pm-poi-kind">{POI_LABEL[p.category]}</span>
                  <a href={p.mapLink} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                    Mapa →
                  </a>
                </li>
              ))}
              {pois.length === 0 && <li className="pm-empty">Žádné výlety poblíž.</li>}
            </ul>
          </article>
        )
      })}
    </div>
  )
}
