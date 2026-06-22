import { useState } from 'react'
import type { Place, StopType } from '../types'
import { STOP, STOP_ORDER } from '../stopTypes'
import { useStore } from '../store'
import { InlineText, InlineNumberChip } from './Inline'

export default function PlaceCard({
  place,
  n,
  canEdit,
  onDragStart,
  onDragOver,
  onDrop,
  dragging,
}: {
  place: Place
  n: number | null
  canEdit: boolean
  onDragStart?: () => void
  onDragOver?: () => void
  onDrop?: () => void
  dragging?: boolean
}) {
  const { activeId, setActiveId, patchPlace, deletePlace, restorePlace, movePlace } = useStore()
  const [menu, setMenu] = useState(false)
  const [swatch, setSwatch] = useState(false)
  const [editTime, setEditTime] = useState(false)
  const color = STOP[place.type].color
  const active = activeId === place.id

  const remove = () => {
    setMenu(false)
    const removed = deletePlace(place.id)
    if (removed) {
      window.dispatchEvent(
        new CustomEvent('trip-undo', {
          detail: { label: `Removed ${removed.name}`, undo: () => restorePlace(removed) },
        }),
      )
    }
  }

  return (
    <div
      className={`card ${active ? 'card-active' : ''} ${place.visited ? 'card-visited' : ''} ${
        dragging ? 'card-dragging' : ''
      }`}
      onClick={() => setActiveId(place.id)}
      onDragOver={canEdit ? (e) => { e.preventDefault(); onDragOver?.() } : undefined}
      onDrop={canEdit ? onDrop : undefined}
    >
      <div
        className="card-n"
        style={{ background: color, cursor: canEdit ? 'grab' : 'default' }}
        draggable={canEdit}
        onDragStart={canEdit ? onDragStart : undefined}
        title={canEdit ? 'Drag to reorder' : undefined}
      >
        {n ?? '·'}
      </div>

      <div className="card-body">
        <div className="card-title-row">
          <InlineText
            value={place.name}
            editable={canEdit}
            className="card-title"
            onCommit={(v) => patchPlace(place.id, { name: v })}
          />
          {canEdit && (
            <div className="card-menu-wrap" onClick={(e) => e.stopPropagation()}>
              <button className="kebab" onClick={() => setMenu((m) => !m)} aria-label="Card actions">
                ⋯
              </button>
              {menu && (
                <div className="menu">
                  <button onClick={() => { patchPlace(place.id, { visited: !place.visited }); setMenu(false) }}>
                    {place.visited ? 'Mark not visited' : 'Mark visited'}
                  </button>
                  <button onClick={() => { setEditTime(true); setMenu(false) }}>Set time</button>
                  <button onClick={() => { setSwatch(true); setMenu(false) }}>Change category</button>
                  {place.dayId && (
                    <button onClick={() => { movePlace(place.id, null); setMenu(false) }}>
                      Move to wishlist
                    </button>
                  )}
                  <button className="menu-danger" onClick={remove}>Delete</button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card-type">
          <button
            className="dot-btn"
            style={{ cursor: canEdit ? 'pointer' : 'default' }}
            onClick={(e) => { e.stopPropagation(); if (canEdit) setSwatch((s) => !s) }}
            aria-label="Category"
          >
            <span className="dot" style={{ background: color }} />
          </button>
          <span>{STOP[place.type].label}</span>
          {place.visited && <span className="visited-tick">✓ visited</span>}

          {swatch && canEdit && (
            <div className="swatch" onClick={(e) => e.stopPropagation()}>
              {STOP_ORDER.map((t: StopType) => (
                <button
                  key={t}
                  className={`swatch-dot ${t === place.type ? 'swatch-on' : ''}`}
                  style={{ background: STOP[t].color }}
                  title={STOP[t].label}
                  onClick={() => { patchPlace(place.id, { type: t }); setSwatch(false) }}
                />
              ))}
            </div>
          )}
        </div>

        {(place.blurb || canEdit) && (
          <InlineText
            value={place.blurb}
            editable={canEdit}
            multiline
            className="card-about"
            placeholder="Add a note"
            onCommit={(v) => patchPlace(place.id, { blurb: v })}
          />
        )}

        <div className="card-chips">
          {place.time && !editTime && (
            <button
              className="chip chip-time"
              onClick={(e) => { e.stopPropagation(); if (canEdit) setEditTime(true) }}
            >
              {place.time}
            </button>
          )}
          {editTime && canEdit && (
            <input
              className="chip-time-input"
              autoFocus
              type="time"
              defaultValue={timeTo24(place.time)}
              onClick={(e) => e.stopPropagation()}
              onBlur={(e) => { patchPlace(place.id, { time: from24(e.target.value) }); setEditTime(false) }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { patchPlace(place.id, { time: from24((e.target as HTMLInputElement).value) }); setEditTime(false) }
                if (e.key === 'Escape') setEditTime(false)
              }}
            />
          )}
          {canEdit && !place.time && !editTime && (
            <button className="chip chip-ghost" onClick={(e) => { e.stopPropagation(); setEditTime(true) }}>
              + Time
            </button>
          )}

          {canEdit ? (
            <InlineNumberChip
              value={place.budgetAmount}
              onCommit={(v) => patchPlace(place.id, { budgetAmount: v })}
            />
          ) : (
            place.budgetAmount != null && (
              <span className="chip chip-budget">
                {place.budgetCurrency} {place.budgetAmount.toLocaleString('en-US')}
              </span>
            )
          )}
        </div>

        {place.link && (
          <a className="card-link" href={place.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            Open link →
          </a>
        )}
      </div>

      <div className="card-photo">
        {place.photo ? (
          <img src={place.photo} alt={place.name} />
        ) : (
          <div className="card-photo-ph" style={{ color }}>
            {place.name.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  )
}

// "5:30 AM" → "05:30" for <input type=time>
function timeTo24(t: string | null): string {
  if (!t) return ''
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
  if (!m) return ''
  let h = Number(m[1])
  const min = m[2]
  const ap = m[3]?.toUpperCase()
  if (ap === 'PM' && h < 12) h += 12
  if (ap === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${min}`
}
// "05:30" → "5:30 AM"
function from24(v: string): string | null {
  if (!v) return null
  const [hStr, min] = v.split(':')
  let h = Number(hStr)
  const ap = h >= 12 ? 'PM' : 'AM'
  if (h === 0) h = 12
  else if (h > 12) h -= 12
  return `${h}:${min} ${ap}`
}
