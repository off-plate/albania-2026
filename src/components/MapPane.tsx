import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useStore } from '../store'
import { STOP } from '../stopTypes'

function markerIcon(color: string, n: number, active: boolean) {
  return L.divIcon({
    className: '',
    html: `<div class="mk ${active ? 'mk-active' : ''}" style="background:${color}">${n}</div>`,
    iconSize: active ? [30, 30] : [24, 24],
    iconAnchor: active ? [15, 15] : [12, 12],
  })
}

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (!target) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) map.setView(target, Math.max(map.getZoom(), 9))
    else map.flyTo(target, Math.max(map.getZoom(), 9), { duration: 0.6 })
  }, [target, map])
  return null
}

export default function MapPane() {
  const { data, numbered, activeId, setActiveId } = useStore()

  const flyTarget = useMemo<[number, number] | null>(() => {
    const found = numbered.find((np) => np.place.id === activeId)
    if (found && found.place.lat != null && found.place.lng != null) {
      return [found.place.lat, found.place.lng]
    }
    return null
  }, [activeId, numbered])

  // One polyline per day, connecting that day's coords-bearing stops in order.
  const dayLines = useMemo(() => {
    if (!data) return []
    const byDay = new Map<string, [number, number][]>()
    for (const np of numbered) {
      const p = np.place
      if (p.lat == null || p.lng == null) continue
      if (!byDay.has(np.dayId)) byDay.set(np.dayId, [])
      byDay.get(np.dayId)!.push([p.lat, p.lng])
    }
    return [...byDay.values()].filter((pts) => pts.length >= 2)
  }, [data, numbered])

  if (!data) return <div className="map-root" />
  const center = data.trip.mapCenter
  const zoom = data.trip.mapZoom

  return (
    <MapContainer center={center} zoom={zoom} className="map-root" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {dayLines.map((pts, i) => (
        <Polyline key={i} positions={pts} pathOptions={{ color: '#3A2C1E', weight: 2, opacity: 0.35, dashArray: '4 6' }} />
      ))}
      {numbered.map((np) => {
        const p = np.place
        if (p.lat == null || p.lng == null) return null
        const color = STOP[p.type].color
        return (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={markerIcon(color, np.n, activeId === p.id)}
            zIndexOffset={activeId === p.id ? 1000 : 0}
            eventHandlers={{ click: () => setActiveId(p.id) }}
          >
            <Popup>
              <strong>{np.n}. {p.name}</strong>
              <span className="pop-type" style={{ color }}>{STOP[p.type].label}</span>
              {p.blurb && <span className="pop-blurb">{p.blurb}</span>}
            </Popup>
          </Marker>
        )
      })}
      <FlyTo target={flyTarget} />
    </MapContainer>
  )
}
