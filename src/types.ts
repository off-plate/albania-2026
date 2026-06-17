// Trip data model. This is the whole vocabulary of the app.
// Edit src/data/trip.ts to add/change anything; everything renders from there.

export type Category =
  | 'stay' // a place to sleep (candidate or booked)
  | 'town' // a town / village we might base in or visit
  | 'beach' // sea, swimming, sand
  | 'view' // photogenic viewpoint
  | 'food' // restaurant, focacceria, gelato
  | 'stop' // anything else: parking, fuel, a thing to do

export type Status = 'idea' | 'shortlist' | 'booked'

export interface Place {
  id: string
  name: string
  category: Category
  /** [lat, lng] — drop a Google Maps pin and I'll fill these. */
  coords?: [number, number]
  /** Short line shown on the card and the map popup. */
  note?: string
  /** Longer free text — research, why it's here, things to remember. */
  detail?: string
  status?: Status
  /** External links: Airbnb, Google Maps, a review, etc. */
  links?: { label: string; url: string }[]
  /** Image paths relative to the site root, e.g. 'stays/badia-passignano/photo-01.jpg'. */
  photos?: string[]
  /** Price as free text so it can hold "€120/night" or "not confirmed". */
  price?: string
}

export interface DayStop {
  /** Either reference a Place by id, or just write it inline. */
  placeId?: string
  label: string
  time?: string
  note?: string
}

export interface Day {
  /** ISO date 'YYYY-MM-DD' if known, else leave undefined. */
  date?: string
  title: string
  /** Where we sleep that night. */
  base?: string
  stops: DayStop[]
  note?: string
}

export interface Expense {
  id: string
  label: string
  amount: number // in the currency below
  currency: 'EUR' | 'CZK'
  /** Who paid. Use a traveler id. */
  paidBy: string
  /** Who shares the cost. Empty = everyone. */
  splitAmong?: string[]
  category?: string
  date?: string
}

export interface Traveler {
  id: string
  name: string
}

export interface Trip {
  title: string
  subtitle: string
  dates: string
  summary: string
  travelers: Traveler[]
  /** Budget per person, in CZK. */
  budgetPerPersonCZK: number
  /** For converting EUR expenses to CZK in totals. */
  eurToCzk: number
  facts: { label: string; value: string }[]
  /** Map starting view. */
  mapCenter: [number, number]
  mapZoom: number
  places: Place[]
  days: Day[]
  expenses: Expense[]
}
