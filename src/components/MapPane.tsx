import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useStore } from '../store'
import { STOP } from '../stopTypes'
import { VARIANTS } from '../data/variants'
import { POIS, POI_COLOR, POI_CENTER, POI_ZOOM } from '../data/pois'
import { fmtCZK } from '../lib/format'

function poiIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div class="mk-poi" style="background:${color}"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

function markerIcon(color: string, n: number, active: boolean) {
  return L.divIcon({
    className: '',
    html: `<div class="mk ${active ? 'mk-active' : ''}" style="background:${color}">${n}</div>`,
    iconSize: active ? [30, 30] : [24, 24],
    iconAnchor: active ? [15, 15] : [12, 12],
  })
}

function hotelIcon(fav: boolean) {
  return L.divIcon({
    className: '',
    html: `<div class="mk-stay ${fav ? 'mk-stay-fav' : ''}">⌂</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
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

// Re-frame the whole map when the variant changes.
function FrameVariant({ center, zoom, dep }: { center: [number, number]; zoom: number; dep: string }) {
  const map = useMap()
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) map.setView(center, zoom)
    else map.flyTo(center, zoom, { duration: 0.7 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep])
  return null
}

export default function MapPane() {
  const { activeVariantId, activeId, setActiveId, view } = useStore()
  const variant = VARIANTS.find((v) => v.id === activeVariantId) ?? VARIANTS[0]
  const itinMode = view === 'itinerary'

  const flyTarget = useMemo<[number, number] | null>(() => {
    if (!activeId?.startsWith('var:')) return null
    const [, vid, idx] = activeId.split(':')
    if (vid !== variant.id) return null
    const s = variant.hotStops[Number(idx)]
    return s ? [s.lat, s.lng] : null
  }, [activeId, variant])

  const hotels = variant.stints
    .flatMap((st) => st.lodging ?? [])
    .filter((l) => l.lat != null && l.lng != null)

  if (itinMode) {
    return (
      <MapContainer center={POI_CENTER} zoom={POI_ZOOM} className="map-root" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FrameVariant center={POI_CENTER} zoom={POI_ZOOM} dep="itin" />
        {POIS.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={poiIcon(POI_COLOR[p.category])}>
            <Popup>
              <strong>{p.name}</strong>
              <span className="pop-blurb">{p.note}</span>
              <a href={p.mapLink} target="_blank" rel="noreferrer">Mapa →</a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    )
  }

  return (
    <MapContainer center={variant.mapCenter} zoom={variant.mapZoom} className="map-root" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FrameVariant center={variant.mapCenter} zoom={variant.mapZoom} dep={variant.id} />

      {variant.hotStops.map((s, i) => {
        const id = `var:${variant.id}:${i}`
        return (
          <Marker
            key={id}
            position={[s.lat, s.lng]}
            icon={markerIcon(STOP[s.type].color, i + 1, activeId === id)}
            zIndexOffset={activeId === id ? 1000 : 0}
            eventHandlers={{ click: () => setActiveId(id) }}
          >
            <Popup>
              <strong>{i + 1}. {s.name}</strong>
              <span className="pop-type" style={{ color: STOP[s.type].color }}>{STOP[s.type].label}</span>
              {s.note && <span className="pop-blurb">{s.note}</span>}
            </Popup>
          </Marker>
        )
      })}

      {hotels.map((l) => (
        <Marker
          key={l.name}
          position={[l.lat as number, l.lng as number]}
          icon={hotelIcon(!!l.note && l.note.toLowerCase().includes('prefer'))}
          zIndexOffset={700}
        >
          <Popup>
            <strong>{l.name}</strong>
            <span className="pop-type" style={{ color: '#e2552d' }}>Hotel · {fmtCZK(l.priceCzk)}</span>
            <a href={l.link} target="_blank" rel="noreferrer">Otevřít →</a>
          </Popup>
        </Marker>
      ))}

      <FlyTo target={flyTarget} />
    </MapContainer>
  )
}
