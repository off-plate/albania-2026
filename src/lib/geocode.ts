// Free, no-key geocoding (Photon / Komoot) + driving legs (OSRM demo server).
// Both replace the Google Places dependency. Debounced + cached at call sites.

export interface GeoResult {
  name: string
  region: string // "La Spezia, Liguria, Italy"
  lat: number
  lng: number
}

export async function searchPlaces(q: string, signal?: AbortSignal): Promise<GeoResult[]> {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6&lang=en`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`geocode ${res.status}`)
  const data = await res.json()
  const feats: any[] = data?.features ?? []
  return feats
    .filter((f) => f?.geometry?.coordinates?.length === 2)
    .map((f) => {
      const p = f.properties ?? {}
      const [lng, lat] = f.geometry.coordinates
      const name: string = p.name || p.street || p.city || 'Unnamed place'
      const regionParts = [p.city, p.district, p.county, p.state, p.country].filter(
        (x: string, i: number, arr: string[]) => x && arr.indexOf(x) === i && x !== name,
      )
      return { name, region: regionParts.slice(0, 3).join(', '), lat, lng }
    })
}

export interface Leg {
  distanceMi: number
  durationMin: number
}

const legCache = new Map<string, Leg | null>()
const legInflight = new Map<string, Promise<Leg | null>>()

function legKey(a: [number, number], b: [number, number]) {
  return `${a[0].toFixed(4)},${a[1].toFixed(4)}|${b[0].toFixed(4)},${b[1].toFixed(4)}`
}

/** Driving distance/time between two [lat,lng] points. null while unknown/failed. */
export async function routeLeg(
  a: [number, number],
  b: [number, number],
): Promise<Leg | null> {
  const key = legKey(a, b)
  if (legCache.has(key)) return legCache.get(key)!
  if (legInflight.has(key)) return legInflight.get(key)!

  const p = (async () => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=false`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`osrm ${res.status}`)
      const data = await res.json()
      const r = data?.routes?.[0]
      if (!r) {
        legCache.set(key, null)
        return null
      }
      const leg: Leg = {
        distanceMi: r.distance / 1609.34,
        durationMin: r.duration / 60,
      }
      legCache.set(key, leg)
      return leg
    } catch {
      // Don't cache transient failures forever; let a later render retry.
      return null
    } finally {
      legInflight.delete(key)
    }
  })()

  legInflight.set(key, p)
  return p
}

export function fmtDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  if (h && m) return `${h} hr ${m} min`
  if (h) return `${h} hr`
  return `${m} min`
}

export function fmtDistance(mi: number): string {
  return `${mi.toFixed(mi < 10 ? 1 : 0)} mi`
}
