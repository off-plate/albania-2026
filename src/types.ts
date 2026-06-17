// ── Data model ────────────────────────────────────────────────────────────
// Everything the app shows comes from src/data/trip.ts. Edit that one file.

// Stop types, mirroring the planner's coloured dots.
export type StopType =
  | 'classic' // red — the must-see / iconic stops
  | 'instagram' // purple — photogenic / viewpoint stops
  | 'relaxed' // green — slow, sea, wine, easy nights
  | 'car' // blue — motor-valley / car-themed
  | 'optional' // grey — nice if there's time
  | 'endpoint' // dark — start / end of the road trip

export interface Place {
  id: string
  /** Display + map marker number. */
  n: number
  name: string
  type: StopType
  /** One short line, like the planner's blurb. */
  blurb: string
  /** Longer factual description ("From the web"-style). Optional. */
  about?: string
  /** [lat, lng]. Omit for non-mappable items (e.g. a taxi service). */
  coords?: [number, number]
  /** Local photo path under public/, e.g. 'stays/badia/photo-01.jpg'. */
  photo?: string
  /** Optional external link. */
  link?: string
}

export interface Section {
  id: string
  /** e.g. "Day 1" or "Days 8–9". */
  dayLabel?: string
  /** e.g. "Fri 21 Aug". */
  dateLabel?: string
  /** The focus of this stretch, e.g. "Prague to Lake Garda". */
  title: string
  places: Place[]
}

export interface Reservation {
  id: string
  kind: 'flight' | 'lodging' | 'car' | 'train' | 'other'
  title: string
  detail?: string
  dates?: string
  price?: string
  link?: string
  photos?: string[]
}

export interface Expense {
  id: string
  label: string
  amount: number
  currency: 'EUR' | 'CZK'
  category: 'gas' | 'car' | 'lodging' | 'food' | 'activity' | 'other'
  paidBy: string // traveler id
  splitAmong?: string[] // empty = everyone
  date?: string
}

export interface Traveler {
  id: string
  name: string
  initials: string
}

export interface Trip {
  title: string
  dateRange: string
  heroPhoto?: string
  summary: string
  travelers: Traveler[]
  /** Working FX rate for showing EUR expenses in CZK. */
  eurToCzk: number
  /** Optional per-person budget in CZK (for the budget bar). */
  budgetPerPersonCZK?: number
  notes: string
  mapCenter: [number, number]
  mapZoom: number
  sections: Section[]
  reservations: Reservation[]
  expenses: Expense[]
}
