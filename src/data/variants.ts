import type { StopType } from '../types'

// PLAN VARIANTS
// Michael sends variants (A, B, maybe more). Each is a self-contained option
// with its own hot stops, bases, cost and map framing. The map re-frames to the
// selected variant and shows only its stops.

// Shared across ALL variants (same for A and B):
export const SHARED = {
  dates: '14.–23. 8. 2026',
  nights: '9 nocí',
  datesNote: 'Podle ceny možná zkrátíme na 22. 8. (8 nocí). Rozhodneme nakonec.',
  flight: 'Praha ↔ Tirana (zpáteční, všichni 4)',
}

export interface HotStop {
  name: string
  type: StopType // drives the dot / marker colour
  lat: number
  lng: number
  note?: string
}

// A stay at one base for part of the trip.
export interface Stint {
  base: string
  dates: string
  nights: number
}

export interface PlanVariant {
  id: string
  label: string // 'A', 'B', ...
  name: string
  tagline: string
  costPerPersonCzk: number
  costNote: string
  stints: Stint[]
  hotStops: HotStop[]
  mapCenter: [number, number]
  mapZoom: number
}

export const VARIANTS: PlanVariant[] = [
  {
    id: 'a',
    label: 'A',
    name: 'Vlorë then Ksamil',
    tagline: 'Two nights in Vlorë for the northern Riviera, then a week in Ksamil for the south, the islands and Butrint.',
    costPerPersonCzk: 15000,
    costNote: 'odhad: 2 ubytování + let + auto (bez jídla)',
    stints: [
      { base: 'Vlorë', dates: '14.–16. 8.', nights: 2 },
      { base: 'Ksamil', dates: '16.–23. 8.', nights: 7 },
    ],
    hotStops: [
      { name: 'Vlorë', type: 'relaxed', lat: 40.4686, lng: 19.4892, note: 'Northern base, start of the Riviera.' },
      { name: 'Llogara Pass', type: 'instagram', lat: 40.2069, lng: 19.5953, note: 'Mountain pass, big coast views.' },
      { name: 'Dhërmi / Drymades', type: 'relaxed', lat: 40.1561, lng: 19.6383, note: 'Clear-water beaches.' },
      { name: 'Gjipe Beach', type: 'instagram', lat: 40.1856, lng: 19.6433, note: 'Canyon-backed hidden beach.' },
      { name: 'Himarë', type: 'relaxed', lat: 40.1019, lng: 19.7444 },
      { name: 'Porto Palermo', type: 'instagram', lat: 40.0631, lng: 19.7836, note: 'Ali Pasha castle on the bay.' },
      { name: 'Borsh Beach', type: 'relaxed', lat: 40.0561, lng: 19.8536 },
      { name: 'Sarandë', type: 'relaxed', lat: 39.8756, lng: 20.005 },
      { name: 'Ksamil', type: 'relaxed', lat: 39.7667, lng: 20.0011, note: 'Southern base, swim-to islands.' },
      { name: 'Butrint National Park', type: 'classic', lat: 39.7456, lng: 20.0203, note: 'UNESCO ancient city.' },
      { name: 'Blue Eye', type: 'instagram', lat: 39.9239, lng: 20.1894, note: 'Deep blue natural spring.' },
    ],
    mapCenter: [40.12, 19.78],
    mapZoom: 9,
  },
  {
    id: 'b',
    label: 'B',
    name: 'South base',
    tagline: 'One base in the south around Ksamil, less driving, more beach time. Cheaper.',
    costPerPersonCzk: 12000,
    costNote: 'ubytování ~25k + let + auto',
    stints: [{ base: 'Ksamil', dates: '14.–23. 8.', nights: 9 }],
    hotStops: [
      { name: 'Ksamil', type: 'relaxed', lat: 39.7667, lng: 20.0011, note: 'Base for the whole trip.' },
      { name: 'Butrint National Park', type: 'classic', lat: 39.7456, lng: 20.0203 },
      { name: 'Blue Eye', type: 'instagram', lat: 39.9239, lng: 20.1894 },
      { name: 'Sarandë', type: 'relaxed', lat: 39.8756, lng: 20.005 },
      { name: 'Pasqyra (Mirror) Beach', type: 'instagram', lat: 39.8186, lng: 20.005 },
      { name: 'Gjirokastër', type: 'classic', lat: 40.0758, lng: 20.1389, note: 'UNESCO stone town, day trip inland.' },
    ],
    mapCenter: [39.9, 20.05],
    mapZoom: 10,
  },
]
