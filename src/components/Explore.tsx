import { useState } from 'react'
import { useStore } from '../store'
import { EXPLORE, exploreMapLink, type ExploreItem, type NearBase } from '../data/explore'
import { POI_COLOR, POI_LABEL } from '../data/pois'
import { VARIANTS } from '../data/variants'
import { baseId } from './PlanMap'
import { fmtCZK } from '../lib/format'

const BASE_LABEL: Record<NearBase, string> = { durres: 'Durrës', vlore: 'Vlorë', sarande: 'Sarandë' }
const ORDER: NearBase[] = ['durres', 'vlore', 'sarande']

export default function Explore() {
  const { exploreState, setExplore, activeVariantId } = useStore()
  const [showRejected, setShowRejected] = useState(false)
  const v = VARIANTS.find((x) => x.id === activeVariantId) ?? VARIANTS[0]
  const datesFor = (b: NearBase) => v.stints.find((s) => baseId(s.base) === b)?.dates ?? ''

  const added = EXPLORE.filter((i) => exploreState[i.id] === 'added')
  const rejected = EXPLORE.filter((i) => exploreState[i.id] === 'rejected')

  return (
    <div className="explore">
      <div className="panel-head">
        <h1>Explore</h1>
        <p>Tipy na výlety kolem našich základen. Přidat = přidá do plánovače, na mapu a do rozpočtu. Odmítnout = zmizí.</p>
      </div>

      <div className="ex-summary">
        <span><b>{added.length}</b> přidáno</span>
        <span><b>{EXPLORE.length - added.length - rejected.length}</b> k rozhodnutí</span>
        <button className="ex-toggle" onClick={() => setShowRejected((s) => !s)}>
          {rejected.length} odmítnuto {showRejected ? '▲' : '▼'}
        </button>
      </div>

      {ORDER.map((b) => {
        const items = EXPLORE.filter((i) => i.nearBase === b && exploreState[i.id] !== 'rejected')
        if (items.length === 0) return null
        return (
          <section className="ex-group" key={b}>
            <h2 className="ex-group-h">{BASE_LABEL[b]} <span className="ex-group-dates">{datesFor(b)}</span></h2>
            <div className="ex-grid">
              {items.map((i) => (
                <Card key={i.id} item={i} state={exploreState[i.id]} setExplore={setExplore} />
              ))}
            </div>
          </section>
        )
      })}

      {showRejected && rejected.length > 0 && (
        <section className="ex-group">
          <h2 className="ex-group-h">Odmítnuté</h2>
          <div className="ex-grid">
            {rejected.map((i) => (
              <Card key={i.id} item={i} state="rejected" setExplore={setExplore} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Card({
  item,
  state,
  setExplore,
}: {
  item: ExploreItem
  state?: 'added' | 'rejected'
  setExplore: (id: string, s: 'added' | 'rejected' | null) => void
}) {
  const color = POI_COLOR[item.category]
  return (
    <article className={`ex-card ${state === 'added' ? 'ex-card-added' : ''}`}>
      <div className="ex-photo">
        {item.photo ? (
          <img src={item.photo} alt={item.name} loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <span className="ex-photo-ph" style={{ color }}>{item.name.slice(0, 1)}</span>
        )}
        <span className="ex-kind" style={{ background: color }}>{POI_LABEL[item.category]}</span>
      </div>
      <div className="ex-body">
        <h3 className="ex-name">{item.name}</h3>
        <p className="ex-note">{item.note}</p>
        <div className="ex-meta">
          <span>🚗 {item.driveKm} km · {item.driveMin} min od {BASE_LABEL[item.nearBase]}</span>
          <span>💶 {item.costPpCzk === 0 ? 'zdarma' : `${fmtCZK(item.costPpCzk)}/os.`}{item.costNote ? ` · ${item.costNote}` : ''}</span>
        </div>
        <div className="ex-links">
          <a href={exploreMapLink(item)} target="_blank" rel="noreferrer">Mapa →</a>
          {item.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} →</a>
          ))}
        </div>

        {state === 'added' ? (
          <div className="ex-actions">
            <span className="ex-added-tag">✓ Přidáno</span>
            <button className="ex-btn ex-btn-ghost" onClick={() => setExplore(item.id, null)}>Odebrat</button>
          </div>
        ) : state === 'rejected' ? (
          <div className="ex-actions">
            <span className="ex-rej-tag">Odmítnuto</span>
            <button className="ex-btn ex-btn-ghost" onClick={() => setExplore(item.id, null)}>Vrátit</button>
          </div>
        ) : (
          <div className="ex-actions">
            <button className="ex-btn ex-btn-add" onClick={() => setExplore(item.id, 'added')}>+ Přidat</button>
            <button className="ex-btn ex-btn-rej" onClick={() => setExplore(item.id, 'rejected')}>Odmítnout</button>
          </div>
        )}
      </div>
    </article>
  )
}
