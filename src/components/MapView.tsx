import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { trip } from '../data/trip'
import type { Category } from '../types'

// On-brand pin: a small terracotta drop with a category glyph. Avoids the
// broken default-marker-image problem in bundlers entirely.
const GLYPH: Record<Category, string> = {
  stay: '◆',
  town: '●',
  beach: '≈',
  view: '▲',
  food: '✦',
  stop: '•',
}

function pin(category: Category) {
  return L.divIcon({
    className: 'pin-wrap',
    html: `<span class="pin pin-${category}">${GLYPH[category]}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  })
}

const LABELS: Record<Category, string> = {
  stay: 'Stay',
  town: 'Town',
  beach: 'Beach',
  view: 'Viewpoint',
  food: 'Food',
  stop: 'Stop',
}

export default function MapView() {
  const pins = trip.places.filter((p) => p.coords)
  const used = Array.from(new Set(pins.map((p) => p.category)))

  return (
    <section className="mapview">
      <div className="legend">
        {used.map((c) => (
          <span className="legend-item" key={c}>
            <span className={`pin pin-${c} pin-static`}>{GLYPH[c]}</span>
            {LABELS[c]}
          </span>
        ))}
      </div>

      <div className="map-frame">
        <MapContainer
          center={trip.mapCenter}
          zoom={trip.mapZoom}
          scrollWheelZoom={false}
          className="leaflet-root"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {pins.map((p) => (
            <Marker key={p.id} position={p.coords!} icon={pin(p.category)}>
              <Popup>
                <strong>{p.name}</strong>
                {p.status && <span className={`tag tag-${p.status}`}>{p.status}</span>}
                {p.note && <p>{p.note}</p>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <p className="map-hint">
        {pins.length} places. Tap a pin for the note. Send me a Google Maps link
        and it lands here.
      </p>
    </section>
  )
}
