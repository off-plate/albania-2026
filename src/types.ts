// ── Data model ────────────────────────────────────────────────────────────
// The trip lives in Supabase (tables prefixed italy_). The app loads it into
// these shapes, edits optimistically, and writes back. No localStorage source.

export type StopType =
  | 'classic' // accent — must-see / iconic
  | 'instagram' // mauve — viewpoint / photogenic
  | 'relaxed' // teal-green — sea & slow
  | 'car' // blue — motor valley
  | 'optional' // warm grey — if time allows
  | 'endpoint' // near-black — start / end

export type Currency = 'CZK' | 'EUR'
export type ExpenseCategory = 'gas' | 'car' | 'lodging' | 'food' | 'activity' | 'other'
export type ReservationKind = 'flight' | 'lodging' | 'car' | 'train' | 'other'

export interface Place {
  id: string
  dayId: string | null // null = un-scheduled (places to visit)
  name: string
  type: StopType
  blurb: string
  about: string
  lat: number | null
  lng: number | null
  photo: string | null
  link: string | null
  time: string | null // scheduled time, e.g. "14:30"
  budgetAmount: number | null
  budgetCurrency: Currency
  visited: boolean
  sortOrder: number
}

export interface Day {
  id: string
  date: string | null // ISO yyyy-mm-dd
  title: string
  note: string // free text, may contain links (e.g. Airbnb stay options)
  budgetAmount: number | null
  budgetCurrency: Currency
  sortOrder: number
}

export interface Expense {
  id: string
  dayId: string | null
  placeId: string | null
  label: string
  amount: number
  currency: Currency
  category: ExpenseCategory
  date: string | null
  paidBy: string | null
  splitAmong: string[] | null
  sortOrder: number
}

export interface Traveler {
  id: string
  name: string
  initials: string
  sortOrder: number
}

export interface Reservation {
  id: string
  kind: ReservationKind
  title: string
  detail: string | null
  dates: string | null
  price: string | null
  link: string | null
  sortOrder: number
}

export interface Trip {
  id: string
  slug: string
  title: string
  dateStart: string | null
  dateEnd: string | null
  summary: string
  notes: string
  heroPhoto: string | null
  transport: string
  eurToCzk: number
  budgetTotalCzk: number | null
  mapCenter: [number, number]
  mapZoom: number
}

/** A trip card for the packages hub. */
export interface TripSummary {
  id: string
  slug: string
  title: string
  heroPhoto: string | null
  transport: string
  summary: string
  dateStart: string | null
  dateEnd: string | null
  days: number
  totalCzk: number
}

export interface TripData {
  trip: Trip
  days: Day[]
  places: Place[]
  travelers: Traveler[]
  reservations: Reservation[]
  expenses: Expense[]
}

/** A scheduled place with its computed marker number + day position. */
export interface NumberedPlace {
  place: Place
  n: number
  dayId: string
  dayIndex: number
}
