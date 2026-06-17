import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Place } from '../types'
import { trip } from '../data/trip'
import { STOP } from '../stopTypes'

function markerIcon(place: Place, active: boolean) {
  const color = STOP[place.type].color
  return L.divIcon({
    className: 'mk-wrap',
    html: `<span class="mk ${active ? 'mk-active' : ''}" style="background:${color}">${place.n}</span>`,
    iconSize: [active ? 30 : 24, active ? 30 : 24],
    iconAnchor: [active ? 15 : 12, active ? 15 : 12],
    popupAnchor: [0, active ? -16 : -13],
  })
}

function FlyTo({ place }: { place: Place | null }) {
  const map = useMap()
  useEffect(() => {
    if (place?.coords) map.flyTo(place.coords, Math.max(map.getZoom(), 10), { duration: 0.6 })
  }, [place, map])
  return null
}

export default function MapPane({
  places,
  activeId,
  onPick,
}: {
  places: Place[]
  activeId: string | null
  onPick: (id: string) => void
}) {
  const active = places.find((p) => p.id === activeId) ?? null
  return (
    <MapContainer
      center={trip.mapCenter}
      zoom={trip.mapZoom}
      scrollWheelZoom
      className="map-root"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyTo place={active} />
      {places.map((p) => (
        <Marker
          key={p.id}
          position={p.coords!}
          icon={markerIcon(p, p.id === activeId)}
          eventHandlers={{ click: () => onPick(p.id) }}
          zIndexOffset={p.id === activeId ? 1000 : 0}
        >
          <Popup>
            <strong>
              {p.n}. {p.name}
            </strong>
            <span className="pop-type" style={{ color: STOP[p.type].color }}>
              {STOP[p.type].label}
            </span>
            <span className="pop-blurb">{p.blurb}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
