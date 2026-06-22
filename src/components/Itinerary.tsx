import { useEffect, useState } from 'react'
import { useStore } from '../store'
import type { Day, Place } from '../types'
import { fmtDayDate } from '../lib/format'
import { routeLeg, fmtDuration, fmtDistance, type Leg } from '../lib/geocode'
import PlaceCard from './PlaceCard'
import AddPlace from './AddPlace'
import { InlineText, Linkify } from './Inline'

export default function Itinerary() {
  const { data, canEdit, numberOf } = useStore()
  if (!data) return null
  const days = [...data.days].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div>
      <div className="panel-head">
        <h1>Itinerary</h1>
        <p>{days.length} days · {data.places.filter((p) => p.dayId).length} stops</p>
      </div>
      {days.map((day, i) => (
        <DaySection key={day.id} day={day} dayNumber={i + 1} canEdit={canEdit} numberOf={numberOf} />
      ))}
    </div>
  )
}

function DaySection({
  day,
  dayNumber,
  canEdit,
  numberOf,
}: {
  day: Day
  dayNumber: number
  canEdit: boolean
  numberOf: (id: string) => number | null
}) {
  const { placesOfDay, patchDay, reorderWithinDay } = useStore()
  const places = placesOfDay(day.id)
  const [dragFrom, setDragFrom] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  const onDrop = () => {
    if (dragFrom != null && dragOver != null && dragFrom !== dragOver) {
      reorderWithinDay(day.id, dragFrom, dragOver)
    }
    setDragFrom(null)
    setDragOver(null)
  }

  return (
    <section className="sec">
      <div className="sec-head">
        <div className="sec-when">
          <span className="sec-day">Day {dayNumber}</span>
          <span className="sec-date">{fmtDayDate(day.date)}</span>
        </div>
        <InlineText
          as="div"
          className="sec-focus"
          value={day.title}
          editable={canEdit}
          placeholder="Name this day"
          onCommit={(v) => patchDay(day.id, { title: v })}
        />
        {canEdit ? (
          <InlineText
            as="div"
            className="sec-note"
            value={day.note}
            editable
            multiline
            placeholder="+ Day note (stays, links, reminders)"
            onCommit={(v) => patchDay(day.id, { note: v })}
          />
        ) : (
          day.note && <Linkify className="sec-note" text={day.note} />
        )}
      </div>

      {places.length === 0 && (
        <div className="day-empty">No stops yet for this day.{canEdit ? ' Add the first below.' : ''}</div>
      )}

      <div className="cards">
        {places.map((p, i) => (
          <div key={p.id}>
            <PlaceCard
              place={p}
              n={numberOf(p.id)}
              canEdit={canEdit}
              dragging={dragFrom === i}
              onDragStart={() => setDragFrom(i)}
              onDragOver={() => setDragOver(i)}
              onDrop={onDrop}
            />
            {i < places.length - 1 && <DriveRow from={p} to={places[i + 1]} />}
          </div>
        ))}
      </div>

      {canEdit && <AddPlace dayId={day.id} dayTitle={day.title || `Day ${dayNumber}`} />}
    </section>
  )
}

function DriveRow({ from, to }: { from: Place; to: Place }) {
  const [leg, setLeg] = useState<Leg | null>(null)
  const [failed, setFailed] = useState(false)
  const sameSpot =
    from.lat != null && to.lat != null && from.lat === to.lat && from.lng === to.lng

  useEffect(() => {
    if (from.lat == null || from.lng == null || to.lat == null || to.lng == null || sameSpot) return
    let live = true
    routeLeg([from.lat, from.lng], [to.lat, to.lng]).then((l) => {
      if (!live) return
      if (l) setLeg(l)
      else setFailed(true)
    })
    return () => {
      live = false
    }
  }, [from.lat, from.lng, to.lat, to.lng, sameSpot])

  if (from.lat == null || to.lat == null || sameSpot) return null

  return (
    <div className="drive-row">
      <span className="drive-connector" aria-hidden />
      <span className="drive-text">
        {leg
          ? `drive · ${fmtDuration(leg.durationMin)} · ${fmtDistance(leg.distanceMi)}`
          : failed
            ? 'drive · distance unavailable'
            : 'drive · calculating…'}
      </span>
    </div>
  )
}
