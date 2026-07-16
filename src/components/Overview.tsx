import { useStore } from '../store'
import { VARIANTS, SHARED, variantCost, variantNights } from '../data/variants'
import { fmtCZK } from '../lib/format'

export default function Overview() {
  const { activeVariantId, setView } = useStore()
  const v = VARIANTS.find((x) => x.id === activeVariantId) ?? VARIANTS[0]
  const cost = variantCost(v)

  return (
    <div className="ovw">
      <div className="panel-head">
        <h1>Cesta do Albánie</h1>
        <p>{v.dateRange} · {variantNights(v)} nocí · 2 páry / 4 lidi</p>
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
        <span className="ovw-flight-price">{fmtCZK(cost.flightPp)} / osoba · Skyscanner →</span>
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

      {/* tips moved to Explore */}
      <div className="ov-h">Výlety a tipy</div>
      <button className="ovw-flight" onClick={() => setView('explore')}>
        <span>Tipy na výlety s cenami a vzdálenostmi</span>
        <span className="ovw-flight-price">Explore →</span>
      </button>
    </div>
  )
}
