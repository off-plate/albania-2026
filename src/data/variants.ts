import type { StopType } from '../types'

// PLAN VARIANTS
// Michael dictates each variant (A, B, C…). Only what he gives goes on the map:
// the arrival airport, the base locations and the hotels. Cost is computed from
// real components below, not guessed.

// Shared across ALL variants:
export const SHARED = {
  dates: '14.–23. 8. 2026',
  nights: '9 nocí',
  datesNote: 'Podle ceny možná zkrátíme na 22. 8. (8 nocí). Rozhodneme nakonec.',
  flight: 'Praha ↔ Tirana (zpáteční, všichni 4)',
  flightPricePp: '~4 500 Kč / osoba',
  flightLink:
    'https://www.skyscanner.cz/doprava/lety/prg/tira/260814/260823/?adultsv2=4&cabinclass=economy&rtn=1',
}

// Cost building blocks (per person / per group). Edit here.
export const FLIGHT_PP_CZK = 4500 // let na osobu, zpáteční (Skyscanner PRG↔TIA)
export const CAR_RENTAL_CZK = 8000 // půjčení auta na celý výlet (skupina)
// Benzín: reálný průměr v Albánii ~170 ALL/l (natural 95, léto 2026) ≈ 42 Kč/l.
export const FUEL = { lPer100: 7, priceCzkPerL: 42 }

export interface HotStop {
  name: string
  type: StopType
  lat: number
  lng: number
  note?: string
}

export interface Lodging {
  name: string
  priceCzk: number
  breakfast?: boolean
  link: string
  note?: string // short tag pill
  detail?: string // longer description
  lat?: number // approx, town-level (Booking hides exact address)
  lng?: number
}

export interface Stint {
  base: string
  dates: string
  nights: number
  lodging?: Lodging[]
}

export interface PlanVariant {
  id: string
  label: string
  name: string
  tagline: string
  stints: Stint[]
  hotStops: HotStop[]
  mapCenter: [number, number]
  mapZoom: number
  endNote?: string
  /** Estimated total driving in Albania, incl. airport there AND back (km). */
  driveKm?: number
}

// Full cost for a variant, computed from the first lodging option per base.
export function variantCost(v: PlanVariant) {
  const stay = v.stints.reduce((s, st) => s + (st.lodging?.[0]?.priceCzk ?? 0), 0)
  const flight = FLIGHT_PP_CZK * 4
  const car = CAR_RENTAL_CZK
  const fuel = v.driveKm ? Math.round((v.driveKm * FUEL.lPer100) / 100 * FUEL.priceCzkPerL) : 0
  const total = stay + flight + car + fuel
  return { stay, flight, car, fuel, total, perPerson: Math.round(total / 4) }
}

const AIRPORT: HotStop = {
  name: 'Letiště Tirana (přílet)',
  type: 'endpoint',
  lat: 41.4147,
  lng: 19.7206,
  note: 'Praha → Tirana, odsud autem.',
}
const RETURN_NOTE = '23. 8. přímá cesta na letiště (Tirana).'

export const VARIANTS: PlanVariant[] = [
  {
    id: 'a',
    label: 'A',
    name: 'Vlorë then Sarandë',
    tagline: 'Vlorë 3 noci, pak Sarandë 6 nocí. Přílet do Tirany, odsud autem.',
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
    hotStops: [
      AIRPORT,
      { name: 'Vlorë', type: 'relaxed', lat: 40.4686, lng: 19.4892, note: 'První základna, 14.–17. 8.' },
      { name: 'Sarandë', type: 'relaxed', lat: 39.8756, lng: 20.005, note: 'Druhá základna, 17.–23. 8.' },
    ],
    endNote: '23. 8. přímá cesta ze Sarandy na letiště (Tirana, ~3,5 h).',
    driveKm: 950,
    mapCenter: [40.55, 19.75],
    mapZoom: 8,
  },
  {
    id: 'b',
    label: 'B',
    name: 'Sarandë only',
    tagline: 'Rovnou z letiště do Sarandy, celý pobyt tam. 14.–23. 8.',
    stints: [
      {
        base: 'Sarandë',
        dates: '14.–23. 8.',
        nights: 9,
        lodging: [
          {
            name: 'Vila Mariana',
            priceCzk: 39355,
            breakfast: true,
            note: 'Se snídaní',
            detail: 'Jedna postel + gauč, bez kuchyně.',
            lat: 39.876,
            lng: 20.006,
            link: 'https://www.booking.com/hotel/al/vila-mariana.html?checkin=2026-08-14&checkout=2026-08-23&group_adults=4&no_rooms=1&req_adults=4',
          },
          {
            name: 'Niklas Boutique',
            priceCzk: 38831,
            breakfast: true,
            detail: 'Normální hotel se snídaní.',
            lat: 39.872,
            lng: 20.008,
            link: 'https://www.booking.com/hotel/al/niklas-butique.html?checkin=2026-08-14&checkout=2026-08-23&group_adults=4&no_rooms=1&req_adults=4',
          },
        ],
      },
    ],
    hotStops: [
      AIRPORT,
      { name: 'Sarandë', type: 'relaxed', lat: 39.8756, lng: 20.005, note: 'Základna na celý pobyt.' },
    ],
    endNote: RETURN_NOTE,
    driveKm: 850,
    mapCenter: [40.6, 19.85],
    mapZoom: 8,
  },
  {
    id: 'c',
    label: 'C',
    name: 'Ksamil only',
    tagline: 'Rovnou z letiště do Ksamilu, celý pobyt tam. 14.–23. 8.',
    stints: [
      {
        base: 'Ksamil',
        dates: '14.–23. 8.',
        nights: 9,
        lodging: [
          {
            name: 'Michelle Apartments Ksamil',
            priceCzk: 36670,
            note: 'Výhled na moře',
            detail: 'Normální postele, kuchyň, výhled na moře.',
            lat: 39.767,
            lng: 20.001,
            link: 'https://www.booking.com/hotel/al/michelle-apartments-ksamil1.html?checkin=2026-08-14&checkout=2026-08-23&group_adults=4&no_rooms=2&req_adults=4',
          },
        ],
      },
    ],
    hotStops: [
      AIRPORT,
      { name: 'Ksamil', type: 'relaxed', lat: 39.7667, lng: 20.0011, note: 'Základna na celý pobyt.' },
    ],
    endNote: RETURN_NOTE,
    driveKm: 880,
    mapCenter: [40.6, 19.9],
    mapZoom: 8,
  },
]
