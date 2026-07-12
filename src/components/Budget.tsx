import { useStore } from '../store'
import { VARIANTS, variantCost } from '../data/variants'
import { POIS } from '../data/pois'
import { fmtCZK } from '../lib/format'

export default function Budget() {
  const { activeVariantId, setActiveVariantId } = useStore()
  const v = VARIANTS.find((x) => x.id === activeVariantId) ?? VARIANTS[0]
  const c = variantCost(v)

  const rows = [
    { label: 'Ubytování', value: c.stay, sub: v.stints.map((s) => s.base).join(' + ') },
    { label: 'Letenky', value: c.flight, sub: `koupeno · ${fmtCZK(c.flightPp)}/os. · Praha ↔ Tirana` },
    { label: 'Půjčení auta', value: c.car, sub: v.carRentalName ? `${v.carRentalName} · celý výlet` : 'celý výlet' },
    { label: 'Benzín', value: c.fuel, sub: 'paušál za celý výlet, tam i zpět' },
  ]

  return (
    <div className="bud">
      <div className="panel-head">
        <h1>Rozpočet</h1>
        <p>Varianta {v.label} · {v.name}</p>
      </div>

      {/* headline */}
      <div className="bud-hero">
        <div className="bud-hero-pp">{fmtCZK(c.perPerson)}<small> / osoba</small></div>
        <div className="bud-hero-total">{fmtCZK(c.total)} celkem za 4</div>
      </div>

      {/* breakdown */}
      <ul className="bud-rows">
        {rows.map((r) => (
          <li className="bud-row" key={r.label}>
            <div className="bud-row-main">
              <span className="bud-row-label">{r.label}</span>
              <span className="bud-row-sub">{r.sub}</span>
            </div>
            <div className="bud-row-vals">
              <span className="bud-row-val">{fmtCZK(r.value)}</span>
              <span className="bud-row-pp">{fmtCZK(Math.round(r.value / 4))}/os.</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="bud-note">Ubytování počítá vždy nejdražší variantu v každé základně (totál za skupinu). Bez jídla a útraty na místě.</div>
      {c.missingLodging.length > 0 && (
        <div className="bud-warn">⚠ Chybí ubytování: {c.missingLodging.join(', ')}. Celková cena je zatím neúplná.</div>
      )}

      {/* optional activities */}
      {(() => {
        const opts = POIS.filter((p) => p.optional && p.priceCzk)
        if (!opts.length) return null
        return (
          <>
            <div className="ov-h">Volitelné (nezapočítáno výše)</div>
            <ul className="bud-rows">
              {opts.map((o) => (
                <li className="bud-row" key={o.id}>
                  <div className="bud-row-main">
                    <span className="bud-row-label">{o.name}</span>
                    <span className="bud-row-sub">za 4 · {o.bookLink ? 'rezervace online' : ''}</span>
                  </div>
                  <div className="bud-row-vals">
                    <span className="bud-row-val">{fmtCZK(o.priceCzk as number)}</span>
                    <span className="bud-row-pp">{fmtCZK(Math.round((o.priceCzk as number) / 4))}/os.</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )
      })()}

      {/* compare all variants */}
      <div className="ov-h">Porovnání variant</div>
      <div className="bud-compare">
        {VARIANTS.map((x) => {
          const xc = variantCost(x)
          const on = x.id === v.id
          return (
            <button
              key={x.id}
              className={`bud-cmp ${on ? 'bud-cmp-on' : ''}`}
              onClick={() => setActiveVariantId(x.id)}
            >
              <span className="bud-cmp-badge">{x.label}</span>
              <span className="bud-cmp-name">{x.name}</span>
              <span className="bud-cmp-pp">{fmtCZK(xc.perPerson)}/os.</span>
              <span className="bud-cmp-total">{fmtCZK(xc.total)} celkem</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
