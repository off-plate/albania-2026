import { useStore } from '../store'
import { VARIANTS, SHARED, variantCost } from '../data/variants'
import { CAR_RENTALS, CAR_TRIP_COST } from '../data/carRentals'
import { TRAVEL_OPTIONS, TRAVEL_KIND_LABEL } from '../data/travelOptions'
import { fmtCZK } from '../lib/format'

export default function Overview() {
  const { activeVariantId, setView } = useStore()
  const v = VARIANTS.find((x) => x.id === activeVariantId) ?? VARIANTS[0]
  const cost = variantCost(v)

  return (
    <div className="ovw">
      <div className="panel-head">
        <h1>Trip to Albania</h1>
        <p>{SHARED.dates} · {SHARED.nights} · 2 páry / 4 lidi</p>
      </div>

      {/* selected variant snapshot */}
      <div className="ov-h">Zvolená varianta</div>
      <button className="ovw-var" onClick={() => setView('plans')}>
        <div className="ovw-var-l">
          <span className="var-tab-badge">{v.label}</span>
          <div>
            <div className="ovw-var-name">{v.name}</div>
            <div className="ovw-var-tag">{v.tagline}</div>
          </div>
        </div>
        <div className="ovw-var-r">
          <span className="ovw-var-pp">{fmtCZK(cost.perPerson)}/os.</span>
          <span className="ovw-var-total">{fmtCZK(cost.total)} celkem</span>
          <span className="ovw-var-link">Varianty →</span>
        </div>
      </button>

      {/* flight */}
      <div className="ov-h">Let</div>
      <a className="ovw-flight" href={SHARED.flightLink} target="_blank" rel="noreferrer">
        <span>{SHARED.flight}</span>
        <span className="ovw-flight-price">{SHARED.flightPricePp} · Skyscanner →</span>
      </a>

      {/* bases + hotels of the chosen variant */}
      <div className="ov-h">Základny a ubytování</div>
      <div className="var-stints">
        {v.stints.map((s, i) => (
          <div className="var-stint-block" key={s.base + i}>
            <div className="var-stint">
              <span className="var-stint-base">{s.base}</span>
              <span className="var-stint-dates">{s.dates}</span>
              <span className="var-stint-nights">{s.nights} {s.nights === 1 ? 'noc' : s.nights < 5 ? 'noci' : 'nocí'}</span>
            </div>
            {s.lodging && (
              <ul className="var-lodging">
                {s.lodging.map((l) => (
                  <li className="var-lodge" key={l.name}>
                    <a className="var-lodge-name" href={l.link} target="_blank" rel="noreferrer">{l.name} →</a>
                    <span className="var-lodge-price">{fmtCZK(l.priceCzk)}{l.breakfast ? ' · se snídaní' : ''}</span>
                    {l.note && <span className="var-lodge-note">{l.note}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      {v.endNote && <div className="var-endnote">{v.endNote}</div>}

      {/* general reference: car rental */}
      <div className="ov-h">Půjčovny aut u letiště · {CAR_TRIP_COST}</div>
      <ul className="car-list">
        {CAR_RENTALS.map((c) => (
          <li className={`car ${c.top ? 'car-top' : ''}`} key={c.name}>
            <div className="car-head">
              <span className="car-name">{c.name}</span>
              <span className="car-rating">★ {c.rating.toFixed(1)}<span className="car-reviews"> · {c.reviews.toLocaleString('cs-CZ')} recenzí</span></span>
            </div>
            <div className="car-note">{c.note}</div>
          </li>
        ))}
      </ul>

      {/* general reference: things to do */}
      <div className="ov-h">Co dělat a za kolik</div>
      <ul className="trip-list">
        {TRAVEL_OPTIONS.map((t) => (
          <li className="trip" key={t.name}>
            <span className={`trip-kind trip-${t.kind}`}>{TRAVEL_KIND_LABEL[t.kind]}</span>
            <div className="trip-main">
              <div className="trip-top">
                <span className="trip-name">{t.name}</span>
                <span className="trip-price">{t.price}</span>
              </div>
              <div className="trip-area">{t.area}</div>
              <div className="trip-note">{t.note}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
