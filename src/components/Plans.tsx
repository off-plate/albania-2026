import { useEffect } from 'react'
import { useStore } from '../store'
import { VARIANTS, SHARED } from '../data/variants'
import { STOP } from '../stopTypes'
import { fmtCZK } from '../lib/format'

export default function Plans() {
  const { activeVariantId, setActiveVariantId, setActiveId } = useStore()

  useEffect(() => {
    if (!activeVariantId && VARIANTS.length) setActiveVariantId(VARIANTS[0].id)
  }, [activeVariantId, setActiveVariantId])

  const active = VARIANTS.find((v) => v.id === activeVariantId) ?? VARIANTS[0]

  return (
    <div className="plans">
      <div className="panel-head">
        <h1>Plan variants</h1>
        <p>Pick a variant. The map re-frames to just that one.</p>
      </div>

      {/* shared across all variants */}
      <div className="var-shared">
        <div className="var-shared-row">
          <span className="var-shared-l">Termín</span>
          <span className="var-shared-v">{SHARED.dates} · {SHARED.nights}</span>
        </div>
        <div className="var-shared-row">
          <span className="var-shared-l">Let</span>
          <span className="var-shared-v">{SHARED.flight}</span>
        </div>
        <div className="var-shared-note">{SHARED.datesNote}</div>
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
                {fmtCZK(v.costPerPersonCzk)}/os. · {v.stints.map((s) => s.base).join(' → ')}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* showcase */}
      {active && (
        <div className="var-show">
          <p className="var-tagline">{active.tagline}</p>

          <div className="var-stats">
            <div className="var-stat">
              <span className="var-stat-n">{fmtCZK(active.costPerPersonCzk)}</span>
              <span className="var-stat-l">na osobu</span>
            </div>
            <div className="var-stat">
              <span className="var-stat-n">{fmtCZK(active.costPerPersonCzk * 4)}</span>
              <span className="var-stat-l">celkem (4)</span>
            </div>
            <div className="var-stat">
              <span className="var-stat-n">{active.hotStops.length}</span>
              <span className="var-stat-l">hot stops</span>
            </div>
          </div>
          <div className="var-costnote">{active.costNote}</div>

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
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="ov-h">Hot stops · {active.hotStops.length}</div>
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
