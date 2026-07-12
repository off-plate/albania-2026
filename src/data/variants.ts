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
    tagline: 'Three nights in Vlorë for the northern Riviera, then six in Sarandë for the south, Ksamil, Butrint and the Blue Eye.',
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
            link: 'https://www.booking.com/hotel/al/villa-christianna-vlora.html?checkin=2026-08-14&checkout=2026-08-17&group_adults=4&no_rooms=2&req_adults=4',
          },
          {
            name: 'Hotel Her',
            priceCzk: 10243,
            breakfast: true,
            note: 'Levnější alternativa',
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
            link: 'https://www.booking.com/hotel/al/stunning-two-bedrooms-apartment-steps-from-the-beach.html?checkin=2026-08-17&checkout=2026-08-23&group_adults=4&no_rooms=2&req_adults=4',
          },
          {
            name: 'Bliss Luxury Apartments & Suites',
            priceCzk: 24680,
            detail: 'Apartmán s kuchyní, queen bed a gauče.',
            link: 'https://www.booking.com/hotel/al/bliss-luxury-apartments-amp-suites.html?checkin=2026-08-17&checkout=2026-08-23&group_adults=4&no_rooms=2&req_adults=4',
          },
        ],
      },
    ],
    endNote: '23. 8. přímá cesta ze Sarandy na letiště (Tirana, ~3,5 h).',
    driveKm: 950,
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
    driveKm: 850,
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
