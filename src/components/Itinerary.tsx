import { useStore } from '../store'
import { VARIANTS, SHARED } from '../data/variants'
import { POIS, POI_COLOR, POI_LABEL } from '../data/pois'
import { fmtCZK } from '../lib/format'

export default function Itinerary() {
  const { activeVariantId, setActiveId } = useStore()
  const v = VARIANTS.find((x) => x.id === activeVariantId) ?? VARIANTS[0]

  return (
    <div className="itin">
      <div className="panel-head">
        <h1>Itinerář</h1>
        <p>Varianta {v.label} · {v.name} · {SHARED.dates}</p>
      </div>

      <ol className="itin-timeline">
        {/* arrival */}
        <li className="itin-step">
          <span className="itin-dot itin-dot-end" />
          <div className="itin-body">
            <div className="itin-when">14. 8. · přílet</div>
            <div className="itin-title">Praha → Tirana, pak autem na základnu</div>
            <div className="itin-note">{SHARED.flight}</div>
          </div>
        </li>

        {/* bases */}
        {v.stints.map((s, i) => (
          <li className="itin-step" key={s.base + i}>
            <span className="itin-dot" />
            <div className="itin-body">
              <div className="itin-when">{s.dates} · {s.nights} {s.nights === 1 ? 'noc' : s.nights < 5 ? 'noci' : 'nocí'}</div>
              <div
                className="itin-title itin-title-link"
                onClick={() => setActiveId(`var:${v.id}:${v.hotStops.findIndex((h) => h.name === s.base)}`)}
              >
                {s.base}
              </div>
              {s.lodging && (
                <ul className="itin-lodging">
                  {s.lodging.map((l) => (
                    <li key={l.name}>
                      <a href={l.link} target="_blank" rel="noreferrer">{l.name}</a>
                      <span> · {fmtCZK(l.priceCzk)}{l.breakfast ? ' · se snídaní' : ''}</span>
                      {l.note && <span className="itin-tag"> {l.note}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}

        {/* departure */}
        <li className="itin-step">
          <span className="itin-dot itin-dot-end" />
          <div className="itin-body">
            <div className="itin-when">23. 8. · odlet</div>
            <div className="itin-title">Cesta na letiště Tirana, odlet do Prahy</div>
            {v.endNote && <div className="itin-note">{v.endNote}</div>}
          </div>
        </li>
      </ol>

      <p className="itin-foot">
        Denní program (výlety, pláže, večeře) doplníme, až bude vybraná varianta. Zatím je jisté
        jen rozložení základen.
      </p>

      <div className="ov-h">Co vidět · hotspoty</div>
      <div className="poi-grid">
        {POIS.map((p) => (
          <article className={`poi ${p.optional ? 'poi-opt' : ''}`} key={p.id}>
            <div className="poi-photo">
              {p.photo ? (
                <img src={p.photo} alt={p.name} loading="lazy" referrerPolicy="no-referrer" />
              ) : (
                <span className="poi-photo-ph" style={{ color: POI_COLOR[p.category] }}>
                  {p.name.slice(0, 1)}
                </span>
              )}
              <span className="poi-kind" style={{ background: POI_COLOR[p.category] }}>
                {POI_LABEL[p.category]}
              </span>
            </div>
            <div className="poi-body">
              <h3 className="poi-name">{p.name}</h3>
              <p className="poi-note">{p.note}</p>
              {p.optional && p.priceCzk && (
                <p className="poi-price">
                  Volitelné · {fmtCZK(p.priceCzk)} za 4 ({fmtCZK(Math.round(p.priceCzk / 4))}/os.)
                </p>
              )}
              <div className="poi-links">
                <a href={p.mapLink} target="_blank" rel="noreferrer">Mapa →</a>
                {p.bookLink && <a href={p.bookLink} target="_blank" rel="noreferrer">Rezervovat →</a>}
              </div>
              {p.photoCredit && <span className="poi-credit">foto: {p.photoCredit}</span>}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
