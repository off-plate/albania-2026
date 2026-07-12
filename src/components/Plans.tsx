import { useEffect } from 'react'
import { useStore } from '../store'
import { VARIANTS, SHARED, variantCost, variantNights } from '../data/variants'
import { STOP } from '../stopTypes'
import { fmtCZK } from '../lib/format'

export default function Plans() {
  const { activeVariantId, setActiveVariantId, setActiveId } = useStore()

  useEffect(() => {
    if (!activeVariantId && VARIANTS.length) setActiveVariantId(VARIANTS[0].id)
  }, [activeVariantId, setActiveVariantId])

  const active = VARIANTS.find((v) => v.id === activeVariantId) ?? VARIANTS[0]
  const cost = active ? variantCost(active) : null

  return (
    <div className="plans">
      <div className="panel-head">
        <h1>Varianty cesty</h1>
        <p>Vyber variantu. Mapa se přizpůsobí té zvolené.</p>
      </div>

      {/* shared across all variants */}
      <div className="var-shared">
        <div className="var-shared-row">
          <span className="var-shared-l">Letenky</span>
          <span className="var-shared-v">
            {SHARED.flight}
            <a className="var-shared-link" href={SHARED.flightLink} target="_blank" rel="noreferrer">
              Skyscanner →
            </a>
          </span>
        </div>
        <div className="var-shared-note">{SHARED.note}</div>
      </div>

      {/* selector */}
      <div className="var-tabs">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            className={`var-tab ${v.id === active?.id ? 'var-tab-on' : ''}`}
            onClick={() => { setActiveVariantId(v.id); setActiveId(null) }}
          >
            <span className="var-tab-badge">{v.label}</span>
            <span className="var-tab-text">
              <span className="var-tab-name">{v.name}</span>
              <span className="var-tab-meta">
                {fmtCZK(variantCost(v).perPerson)}/os. · {v.stints.map((s) => s.base).join(' → ')}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* showcase */}
      {active && cost && (
        <div className="var-show">
          <div className="var-term">{active.dateRange} · {variantNights(active)} nocí</div>
          <p className="var-tagline">{active.tagline}</p>

          {/* cost breakdown */}
          <div className="ov-h">Cena (odhad)</div>
          <div className="var-cost">
            <div className="var-cost-top">
              <span className="var-cost-pp">{fmtCZK(cost.perPerson)}<small> / osoba</small></span>
              <span className="var-cost-all">{fmtCZK(cost.total)} celkem (4)</span>
            </div>
            <ul className="var-cost-rows">
              <li><span>Ubytování</span><span>{fmtCZK(cost.stay)}</span></li>
              <li><span>Letenky (koupeno, {fmtCZK(cost.flightPp)}/os.)</span><span>{fmtCZK(cost.flight)}</span></li>
              <li>
                <span>
                  Půjčení auta
                  {active.carRentalLink && (
                    <> · <a className="var-cost-link" href={active.carRentalLink} target="_blank" rel="noreferrer">{active.carRentalName ?? 'odkaz'} →</a></>
                  )}
                </span>
                <span>{fmtCZK(cost.car)}</span>
              </li>
              <li>
                <span>Benzín (paušál, tam i zpět)</span>
                <span>{fmtCZK(cost.fuel)}</span>
              </li>
            </ul>
            <div className="var-cost-note">
              Ubytování = nejdražší varianta v každé základně. Bez jídla a útraty.
            </div>
            {cost.missingLodging.length > 0 && (
              <div className="var-cost-warn">
                ⚠ Chybí ubytování: {cost.missingLodging.join(', ')}. Cena je zatím neúplná.
              </div>
            )}
          </div>

          {/* bases + lodging */}
          <div className="ov-h">Základny</div>
          <div className="var-stints">
            {active.stints.map((s, i) => (
              <div className="var-stint-block" key={s.base + i}>
                <div className="var-stint">
                  <span className="var-stint-base">{s.base}</span>
                  <span className="var-stint-dates">{s.dates}</span>
                  <span className="var-stint-nights">{s.nights} {s.nights === 1 ? 'noc' : s.nights < 5 ? 'noci' : 'nocí'}</span>
                </div>
                {s.lodging && s.lodging.length > 0 && (
                  <ul className="var-lodging">
                    {s.lodging.map((l) => (
                      <li className="var-lodge" key={l.name}>
                        <a className="var-lodge-name" href={l.link} target="_blank" rel="noreferrer">
                          {l.name} →
                        </a>
                        <span className="var-lodge-price">
                          {fmtCZK(l.priceCzk)}{l.breakfast ? ' · se snídaní' : ''}
                        </span>
                        {l.note && <span className="var-lodge-note">{l.note}</span>}
                        {l.detail && <span className="var-lodge-detail">{l.detail}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {active.endNote && <div className="var-endnote">{active.endNote}</div>}

          {/* hot stops (only what was dictated: airport + locations) */}
          <div className="ov-h">Na mapě</div>
          <ol className="var-stops">
            {active.hotStops.map((s, i) => (
              <li
                className="var-stop"
                key={s.name}
                onClick={() => setActiveId(`var:${active.id}:${i}`)}
              >
                <span className="var-stop-n" style={{ background: STOP[s.type].color }}>{i + 1}</span>
                <div className="var-stop-body">
                  <span className="var-stop-name">{s.name}</span>
                  {s.note && <span className="var-stop-note">{s.note}</span>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
