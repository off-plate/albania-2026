import { useState } from 'react'
import { useStore } from '../store'
import { STOP } from '../stopTypes'
import { fmtCZK, fmtDateRange, toCZK } from '../lib/format'
import { asset } from '../lib/asset'
import type { Reservation } from '../types'
import { InlineText } from './Inline'
import { STAY_OPTIONS, FLIGHTS } from '../data/stayOptions'
import { CAR_RENTALS, CAR_TRIP_COST } from '../data/carRentals'

const RES_KINDS: Reservation['kind'][] = ['flight', 'lodging', 'car', 'train', 'other']

export default function Overview() {
  const { data, canEdit, setView, patchTrip, addTraveler } = useStore()
  if (!data) return null
  const { trip, travelers, days, places, expenses } = data

  const spent = expenses.reduce((s, e) => s + toCZK(e, trip), 0)
  const budget = trip.budgetTotalCzk
  const stopCount = places.filter((p) => p.dayId).length

  return (
    <div>
      {/* A. header */}
      <div className="ov-header">
        {trip.heroPhoto && (
          <div className="ov-hero" style={{ backgroundImage: `url(${asset(trip.heroPhoto)})` }} />
        )}
        <InlineText
          as="h1"
          className="ov-title"
          value={trip.title}
          editable={canEdit}
          onCommit={(v) => patchTrip({ title: v })}
        />
        <div className="ov-dates">{fmtDateRange(trip.dateStart, trip.dateEnd)}</div>
        <div className="avatars">
          {travelers.map((t) => (
            <span className="avatar" key={t.id} title={t.name}>
              {t.initials || t.name.slice(0, 1)}
            </span>
          ))}
          {canEdit && (
            <button
              className="avatar avatar-add"
              title="Add traveler"
              onClick={() => {
                const name = window.prompt('Traveler name?')
                if (name) addTraveler(name)
              }}
            >
              +
            </button>
          )}
        </div>
      </div>

      {/* B. summary + stat strip */}
      <InlineText
        as="div"
        className="ov-summary"
        value={trip.summary}
        editable={canEdit}
        multiline
        placeholder="One line about the trip"
        onCommit={(v) => patchTrip({ summary: v })}
      />
      <div className="ov-stats">
        {days.length} days · {stopCount} stops · {travelers.length} travelers · {fmtCZK(spent)} planned
      </div>

      {/* B2. where to stay — candidate stays to choose from */}
      <StayOptions />

      {/* B3. car rental options */}
      <CarRentals />

      {/* C. notes */}
      <div className="ov-h">Notes</div>
      <InlineText
        as="div"
        className="ov-notes"
        value={trip.notes}
        editable={canEdit}
        multiline
        placeholder="Trip notes, logistics, ideas…"
        onCommit={(v) => patchTrip({ notes: v })}
      />

      {/* D. places to visit */}
      <PlacesToVisit />

      {/* E. budget summary */}
      <div className="ov-h">Budget</div>
      <div className="ov-budget" onClick={() => setView('budget')}>
        <div className="ov-budget-n">{fmtCZK(spent)}</div>
        <div className="ov-budget-sub">
          {budget ? (
            <>
              <Meter spent={spent} budget={budget} />
              <span>{fmtCZK(spent)} of {fmtCZK(budget)}</span>
            </>
          ) : (
            <span>across {expenses.length} expenses</span>
          )}
        </div>
        <span className="ov-budget-link">Open budget →</span>
      </div>

      {/* F. reservations */}
      <Reservations />
    </div>
  )
}

function Meter({ spent, budget }: { spent: number; budget: number }) {
  const pct = Math.min(100, (spent / budget) * 100)
  const over = spent > budget
  return (
    <div className="meter">
      <div className="meter-fill" style={{ width: `${pct}%`, background: over ? 'var(--accent-deep)' : 'var(--accent)' }} />
    </div>
  )
}

function PlacesToVisit() {
  const { unscheduled, canEdit, data, movePlace, deletePlace } = useStore()
  const [picking, setPicking] = useState<string | null>(null)
  if (!data) return null
  if (unscheduled.length === 0 && !canEdit) return null

  return (
    <>
      <div className="ov-h">Places to visit</div>
      {unscheduled.length === 0 ? (
        <div className="ov-empty">Nothing saved yet. Search the map inside a day to add stops.</div>
      ) : (
        <ul className="wishlist">
          {unscheduled.map((p) => (
            <li className="wish" key={p.id}>
              <span className="dot" style={{ background: STOP[p.type].color }} />
              <span className="wish-name">{p.name}</span>
              {canEdit && (
                <span className="wish-actions">
                  <button className="ap-link" onClick={() => setPicking(picking === p.id ? null : p.id)}>
                    Add to a day ▾
                  </button>
                  <button className="wish-del" onClick={() => deletePlace(p.id)} aria-label="Remove">
                    ✕
                  </button>
                  {picking === p.id && (
                    <div className="daypick">
                      {[...data.days].sort((a, b) => a.sortOrder - b.sortOrder).map((d, i) => (
                        <button key={d.id} onClick={() => { movePlace(p.id, d.id); setPicking(null) }}>
                          Day {i + 1} · {d.title || d.date}
                        </button>
                      ))}
                    </div>
                  )}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function StayOptions() {
  const perPerson = (totalCzk: number, flight: number) => Math.round(totalCzk / 4 + flight)
  return (
    <>
      <div className="ov-h">Where to stay — pick one</div>
      <div className="stay-grid">
        {STAY_OPTIONS.map((s) => (
          <a className={`stay-opt ${s.favorite ? 'stay-fav' : ''}`} key={s.id} href={s.link} target="_blank" rel="noreferrer">
            <div className="stay-img" style={{ backgroundImage: `url(${s.image})` }}>
              {s.favorite && <span className="stay-badge">★ Michael likes this</span>}
            </div>
            <div className="stay-info">
              <div className="stay-top">
                <span className="stay-place">{s.place}</span>
                {s.rating != null && <span className="stay-rating">★ {s.rating.toFixed(2)}</span>}
              </div>
              <div className="stay-label">{s.label}</div>
              <div className="stay-beds">{s.beds}</div>
              <div className="stay-price-row">
                {s.totalCzk != null ? (
                  <span className="stay-total">{fmtCZK(s.totalCzk)}</span>
                ) : (
                  <span className="stay-price-req">Price on request</span>
                )}
                <span className="stay-nights">{s.nights} nights</span>
              </div>
              <div className="stay-pp">
                {s.totalCzk != null ? (
                  <>
                    ≈ {fmtCZK(perPerson(s.totalCzk, s.flightPerPersonCzk))} / person
                    <span className="stay-pp-sub"> incl. flight</span>
                  </>
                ) : (
                  <>
                    + {fmtCZK(s.flightPerPersonCzk)} / person flight
                  </>
                )}
              </div>
              {s.note && <div className="stay-note">{s.note}</div>}
            </div>
          </a>
        ))}
      </div>
      <div className="stay-flights">
        <span className="stay-flights-h">Flights, Prague ↔ Tirana (per person)</span>
        <a href={FLIGHTS.long.link} target="_blank" rel="noreferrer">{FLIGHTS.long.dates}: {fmtCZK(FLIGHTS.long.perPersonCzk)}</a>
        <a href={FLIGHTS.short.link} target="_blank" rel="noreferrer">{FLIGHTS.short.dates}: {fmtCZK(FLIGHTS.short.perPersonCzk)}</a>
      </div>
    </>
  )
}

function CarRentals() {
  return (
    <>
      <div className="ov-h">Rent a car · půjčovny u letiště</div>
      <div className="car-cost">{CAR_TRIP_COST}</div>
      <ul className="car-list">
        {CAR_RENTALS.map((c) => (
          <li className={`car ${c.top ? 'car-top' : ''}`} key={c.name}>
            <div className="car-head">
              <span className="car-name">{c.name}</span>
              <span className="car-rating">
                ★ {c.rating.toFixed(1)}
                <span className="car-reviews"> · {c.reviews.toLocaleString('cs-CZ')} recenzí</span>
              </span>
            </div>
            <div className="car-note">{c.note}</div>
          </li>
        ))}
      </ul>
    </>
  )
}

function Reservations() {
  const { data, canEdit, addReservation, patchReservation, deleteReservation } = useStore()
  const [openId, setOpenId] = useState<string | null>(null)
  if (!data) return null
  const { reservations } = data

  return (
    <>
      <div className="ov-h">Reservations</div>
      <div className="res-row">
        {reservations.map((r) => (
          <button
            key={r.id}
            className="res-chip res-chip-on"
            onClick={() => setOpenId(openId === r.id ? null : r.id)}
          >
            <span className="res-kind">{r.kind}</span>
            <span>{r.title}</span>
          </button>
        ))}
        {canEdit && (
          <div className="res-add">
            {RES_KINDS.map((k) => (
              <button key={k} className="res-chip" onClick={() => addReservation(k)}>
                + {k}
              </button>
            ))}
          </div>
        )}
      </div>

      {reservations
        .filter((r) => r.id === openId)
        .map((r) => (
          <div className="res-detail" key={r.id}>
            <InlineText
              as="h3"
              value={r.title}
              editable={canEdit}
              onCommit={(v) => patchReservation(r.id, { title: v })}
            />
            <InlineText
              as="div"
              className="res-dates"
              value={r.dates ?? ''}
              editable={canEdit}
              placeholder="Dates"
              onCommit={(v) => patchReservation(r.id, { dates: v })}
            />
            <InlineText
              as="div"
              className="res-text"
              value={r.detail ?? ''}
              editable={canEdit}
              multiline
              placeholder="Details"
              onCommit={(v) => patchReservation(r.id, { detail: v })}
            />
            <InlineText
              as="div"
              className="res-price"
              value={r.price ?? ''}
              editable={canEdit}
              placeholder="Price"
              onCommit={(v) => patchReservation(r.id, { price: v })}
            />
            <InlineText
              as="div"
              className="res-linkedit"
              value={r.link ?? ''}
              editable={canEdit}
              placeholder="Link (paste URL)"
              onCommit={(v) => patchReservation(r.id, { link: v })}
            />
            {r.link && (
              <a href={r.link} target="_blank" rel="noreferrer" className="card-link">
                Open booking →
              </a>
            )}
            {canEdit && (
              <button className="menu-danger res-del" onClick={() => { deleteReservation(r.id); setOpenId(null) }}>
                Delete reservation
              </button>
            )}
          </div>
        ))}
    </>
  )
}
