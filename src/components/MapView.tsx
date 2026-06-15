import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Stop } from '../types'

const COLORS: Record<string, string> = {
  drive: '#6f6a5f', sight: '#e2654b', beach: '#1b9aa8', food: '#c8973f',
  town: '#1b6f8c', fuel: '#5f6b3f', sleep: '#0e4f66', custom: '#7d3fa0',
}

function pin(label: string, color: string) {
  return L.divIcon({
    className: '',
    html: `<div class="lpin" style="background:${color}">${label}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  })
}

function Fit({ pts }: { pts: [number, number][] }) {
  const map = useMap()
  const key = pts.map((p) => p.join(',')).join('|')
  useEffect(() => {
    if (pts.length === 1) {
      map.setView(pts[0], 12)
    } else if (pts.length > 1) {
      map.fitBounds(pts as any, { padding: [45, 45], maxZoom: 13 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return null
}

export default function MapView({ stops, line }: { stops: Stop[]; line: boolean }) {
  const pts = useMemo(() => stops.map((s) => [s.lat, s.lng] as [number, number]), [stops])
  const center = pts[0] || [44.3, 9.4]
  return (
    <MapContainer center={center as any} zoom={11} scrollWheelZoom className="leaflet-map">
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {line && pts.length > 1 && (
        <Polyline positions={pts} pathOptions={{ color: '#1b6f8c', weight: 4, opacity: 0.6, dashArray: '2 8' }} />
      )}
      {stops.map((s, i) => (
        <Marker key={s.id} position={[s.lat, s.lng]} icon={pin(String(i + 1), COLORS[s.type] || '#1b6f8c')}>
          <Popup>
            <b>{s.name}</b>
            {s.note ? <div style={{ marginTop: 4 }}>{s.note}</div> : null}
            <div style={{ marginTop: 6 }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
      <Fit pts={pts} />
    </MapContainer>
  )
}
