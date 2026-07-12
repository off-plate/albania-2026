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

// A lodging option (candidate) for a base.
export interface Lodging {
  name: string
  priceCzk: number
  breakfast?: boolean
  link: string
  note?: string // short tag pill, e.g. "Preferováno"
  detail?: string // longer plain description
  lat?: number // approx, town-level (Booking hides exact address)
  lng?: number
}

// A stay at one base for part of the trip.
export interface Stint {
  base: string
  dates: string
  nights: number
  lodging?: Lodging[]
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
  endNote?: string
  /** Estimated total driving in Albania (km), for the fuel estimate. */
  driveKm?: number
}

// Fuel estimate assumptions (editable). Albania pump price ~1.9 EUR/l.
export const FUEL = {
  lPer100: 7, // average consumption
  priceCzkPerL: 48,
}

export const VARIANTS: PlanVariant[] = [
  {
    id: 'a',
    label: 'A',
    name: 'Vlorë then Sarandë',
    tagline: 'Vlorë 3 noci, pak Sarandë 6 nocí. Přílet do Tirany, odsud autem.',
    costPerPersonCzk: 15000,
    costNote: 'odhad: Vlorë hotel + Sarandë apartmán + let + auto + benzín',
    stints: [
      {
        base: 'Vlorë',
        dates: '14.–17. 8.',
        nights: 3,
        lodging: [
          {
            name: 'Villa Christianna Vlora',
            priceCzk: 12160,
            breakfast: true,
            note: 'Preferováno',
            lat: 40.447,
            lng: 19.49,
            link: 'https://www.booking.com/hotel/al/villa-christianna-vlora.html?checkin=2026-08-14&checkout=2026-08-17&group_adults=4&no_rooms=2&req_adults=4',
          },
          {
            name: 'Hotel Her',
            priceCzk: 10243,
            breakfast: true,
            note: 'Levnější alternativa',
            lat: 40.46,
            lng: 19.483,
            link: 'https://www.booking.com/hotel/al/her.html?checkin=2026-08-14&checkout=2026-08-17&group_adults=4&no_rooms=2&req_adults=4',
          },
        ],
      },
      {
        base: 'Sarandë',
        dates: '17.–23. 8.',
        nights: 6,
        lodging: [
          {
            name: 'Two-bedroom apartment, steps from the beach',
            priceCzk: 22155,
            detail: 'Plně vybavený apartmán kousek od pláže. Parkování asi placené.',
            lat: 39.873,
            lng: 20.007,
            link: 'https://www.booking.com/hotel/al/stunning-two-bedrooms-apartment-steps-from-the-beach.html?checkin=2026-08-17&checkout=2026-08-23&group_adults=4&no_rooms=2&req_adults=4',
          },
          {
            name: 'Bliss Luxury Apartments & Suites',
            priceCzk: 24680,
            detail: 'Apartmán s kuchyní, queen bed a gauče.',
            lat: 39.88,
            lng: 20.003,
            link: 'https://www.booking.com/hotel/al/bliss-luxury-apartments-amp-suites.html?checkin=2026-08-17&checkout=2026-08-23&group_adults=4&no_rooms=2&req_adults=4',
          },
        ],
      },
    ],
    endNote: '23. 8. přímá cesta ze Sarandy na letiště (Tirana, ~3,5 h).',
    driveKm: 950,
    hotStops: [
      { name: 'Letiště Tirana (přílet)', type: 'endpoint', lat: 41.4147, lng: 19.7206, note: 'Praha → Tirana, odsud autem.' },
      { name: 'Vlorë', type: 'relaxed', lat: 40.4686, lng: 19.4892, note: 'První základna, 14.–17. 8.' },
      { name: 'Sarandë', type: 'relaxed', lat: 39.8756, lng: 20.005, note: 'Druhá základna, 17.–23. 8.' },
    ],
    mapCenter: [40.55, 19.75],
    mapZoom: 8,
  },
  {
    id: 'b',
    label: 'B',
    name: 'South base',
    tagline: 'One base in the south around Ksamil, less driving, more beach time. Cheaper.',
    costPerPersonCzk: 12000,
    costNote: 'ubytování ~25k + let + auto',
    stints: [{ base: 'Ksamil', dates: '14.–23. 8.', nights: 9 }],
    driveKm: 850,
    hotStops: [
      { name: 'Letiště Tirana (přílet)', type: 'endpoint', lat: 41.4147, lng: 19.7206 },
      { name: 'Ksamil', type: 'relaxed', lat: 39.7667, lng: 20.0011, note: 'Základna (návrh, ještě nezadáno).' },
    ],
    mapCenter: [40.6, 19.9],
    mapZoom: 8,
  },
]
