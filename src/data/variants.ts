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
  // Worst-case: the most expensive lodging option per base.
  const stay = v.stints.reduce((s, st) => {
    const prices = (st.lodging ?? []).map((l) => l.priceCzk)
    return s + (prices.length ? Math.max(...prices) : 0)
  }, 0)
  const missingLodging = v.stints.filter((st) => !st.lodging?.length).map((st) => st.base)
  const flight = FLIGHT_PP_CZK * 4
  const car = CAR_RENTAL_CZK
  const fuel = v.driveKm ? Math.round((v.driveKm * FUEL.lPer100) / 100 * FUEL.priceCzkPerL) : 0
  const total = stay + flight + car + fuel
  return { stay, flight, car, fuel, total, perPerson: Math.round(total / 4), missingLodging }
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
    name: 'Durrës, Vlorë, Sarandë',
    tagline: 'Durrës 2 noci, Vlorë 2 noci, Sarandë 5 nocí. Sarandë byt už vybraný.',
    stints: [
      {
        base: 'Durrës',
        dates: '14.–16. 8.',
        nights: 2,
        lodging: [
          {
            name: 'La Mer Durrës',
            priceCzk: 6450,
            breakfast: true,
            detail: 'Rruga Pavaresia. Snídaně + parkování. Pozor: některé postele patrové, jedna manželská.',
            lat: 41.301,
            lng: 19.46,
            link: 'https://www.booking.com/hotel/al/la-mer-durres.html?checkin=2026-08-14&checkout=2026-08-16&group_adults=4&no_rooms=2&req_adults=4',
          },
          {
            name: 'Aquila D',
            priceCzk: 7081,
            breakfast: true,
            detail: 'Rruga Egnatia. 2 pokoje, se snídaní.',
            lat: 41.323,
            lng: 19.443,
            link: 'https://www.booking.com/hotel/al/aquila-d.html?checkin=2026-08-14&checkout=2026-08-16&group_adults=4&no_rooms=2&req_adults=4',
          },
          {
            name: 'GrandStay Sea Penthouse',
            priceCzk: 7668,
            detail: 'Rruga Taulantia, u moře.',
            lat: 41.3105,
            lng: 19.449,
            link: 'https://www.booking.com/hotel/al/grandstay-sea-penthouse.html?checkin=2026-08-14&checkout=2026-08-16&group_adults=4&no_rooms=2&req_adults=4',
          },
          {
            name: 'Exclusive Spacious 2-Bedroom Escape',
            priceCzk: 5633,
            note: 'Nejlevnější',
            detail: 'Rruga Teodor Komneni. Téměř žádné recenze, nešlo dohledat na Googlu — ověřit.',
            lat: 41.313,
            lng: 19.452,
            link: 'https://www.booking.com/hotel/al/exclusive-spacious-2bedroom-escape-in-durres.html?checkin=2026-08-14&checkout=2026-08-16&group_adults=4&no_rooms=2&req_adults=4',
          },
        ],
      },
      {
        base: 'Vlorë',
        dates: '16.–18. 8.',
        nights: 2,
        lodging: [
          {
            name: 'Vila Anxhelo & Xhemi',
            priceCzk: 7470,
            breakfast: true,
            detail: 'Rruga Kanan Maze. 2 ložnice, snídaně v ceně, bez kuchyně.',
            lat: 40.452,
            lng: 19.488,
            link: 'https://www.booking.com/hotel/al/vila-anxhelo-amp-xhemi.html?checkin=2026-08-16&checkout=2026-08-18&group_adults=4&no_rooms=2&req_adults=4',
          },
          {
            name: 'Bel Ami Apartments',
            priceCzk: 7333,
            breakfast: true,
            detail: 'Silnice Vlorë–Orikum. Snídaně v ceně, bez kuchyně.',
            lat: 40.4,
            lng: 19.478,
            link: 'https://www.booking.com/hotel/al/bel-ami-apartments.html?checkin=2026-08-16&checkout=2026-08-18&group_adults=4&no_rooms=2&req_adults=4',
          },
          {
            name: 'Sunny Hill Residence',
            priceCzk: 6157,
            note: 'Nejlevnější',
            detail: 'SH8. 1 ložnice + gauč, kuchyň.',
            lat: 40.463,
            lng: 19.492,
            link: 'https://www.booking.com/hotel/al/sunny-hill-residence.html?checkin=2026-08-16&checkout=2026-08-18&group_adults=4&no_rooms=2&req_adults=4',
          },
        ],
      },
      {
        base: 'Sarandë',
        dates: '18.–23. 8.',
        nights: 5,
        lodging: [
          {
            name: 'Two-bedroom apartment, steps from the beach',
            priceCzk: 18460,
            note: 'Vybráno',
            detail: 'Plnohodnotný byt u pláže. Cena je odhad na 5 nocí (dopočet z 6nocní ceny), potřebuju reálný total.',
            lat: 39.873,
            lng: 20.007,
            link: 'https://www.booking.com/hotel/al/stunning-two-bedrooms-apartment-steps-from-the-beach.html?group_adults=4&no_rooms=2&req_adults=4&checkin=2026-08-18&checkout=2026-08-23',
          },
        ],
      },
    ],
    hotStops: [
      AIRPORT,
      { name: 'Durrës', type: 'relaxed', lat: 41.3231, lng: 19.4414, note: '1. základna, 14.–16. 8.' },
      { name: 'Vlorë', type: 'relaxed', lat: 40.4686, lng: 19.4892, note: '2. základna, 16.–18. 8.' },
      { name: 'Sarandë', type: 'relaxed', lat: 39.8756, lng: 20.005, note: '3. základna, 18.–23. 8.' },
    ],
    endNote: RETURN_NOTE,
    driveKm: 800,
    mapCenter: [40.5, 19.7],
    mapZoom: 8,
  },
]
