import { supabase, TRIP_SLUG } from './supabase'
import type {
  Currency,
  Day,
  Expense,
  Place,
  Reservation,
  StopType,
  Traveler,
  Trip,
  TripData,
} from '../types'

// ── Row → app mappers ───────────────────────────────────────────────────────
const num = (v: any): number | null => (v === null || v === undefined ? null : Number(v))

function toTrip(r: any): Trip {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    dateStart: r.date_start,
    dateEnd: r.date_end,
    summary: r.summary ?? '',
    notes: r.notes ?? '',
    heroPhoto: r.hero_photo,
    eurToCzk: Number(r.eur_to_czk ?? 24.5),
    budgetTotalCzk: num(r.budget_total_czk),
    mapCenter: [Number(r.map_center_lat ?? 45.4), Number(r.map_center_lng ?? 11)],
    mapZoom: Number(r.map_zoom ?? 6),
  }
}

function toDay(r: any): Day {
  return {
    id: r.id,
    date: r.date,
    title: r.title ?? '',
    note: r.note ?? '',
    budgetAmount: num(r.budget_amount),
    budgetCurrency: (r.budget_currency ?? 'CZK') as Currency,
    sortOrder: r.sort_order ?? 0,
  }
}

function toPlace(r: any): Place {
  return {
    id: r.id,
    dayId: r.day_id,
    name: r.name,
    type: (r.type ?? 'classic') as StopType,
    blurb: r.blurb ?? '',
    about: r.about ?? '',
    lat: num(r.lat),
    lng: num(r.lng),
    photo: r.photo,
    link: r.link,
    time: r.scheduled_time,
    budgetAmount: num(r.budget_amount),
    budgetCurrency: (r.budget_currency ?? 'CZK') as Currency,
    visited: !!r.visited,
    sortOrder: r.sort_order ?? 0,
  }
}

function toExpense(r: any): Expense {
  return {
    id: r.id,
    dayId: r.day_id,
    placeId: r.place_id,
    label: r.label,
    amount: Number(r.amount ?? 0),
    currency: (r.currency ?? 'CZK') as Currency,
    category: r.category ?? 'other',
    date: r.date,
    paidBy: r.paid_by,
    splitAmong: r.split_among,
    sortOrder: r.sort_order ?? 0,
  }
}

function toTraveler(r: any): Traveler {
  return { id: r.id, name: r.name, initials: r.initials ?? '', sortOrder: r.sort_order ?? 0 }
}

function toReservation(r: any): Reservation {
  return {
    id: r.id,
    kind: r.kind ?? 'other',
    title: r.title,
    detail: r.detail,
    dates: r.dates,
    price: r.price,
    link: r.link,
    sortOrder: r.sort_order ?? 0,
  }
}

// ── Load ────────────────────────────────────────────────────────────────────
export async function loadTrip(): Promise<TripData> {
  const { data: tripRow, error: te } = await supabase
    .from('italy_trips')
    .select('*')
    .eq('slug', TRIP_SLUG)
    .single()
  if (te) throw te
  const tripId = tripRow.id

  const [days, places, travelers, reservations, expenses] = await Promise.all([
    supabase.from('italy_days').select('*').eq('trip_id', tripId).order('sort_order'),
    supabase.from('italy_places').select('*').eq('trip_id', tripId).order('sort_order'),
    supabase.from('italy_travelers').select('*').eq('trip_id', tripId).order('sort_order'),
    supabase.from('italy_reservations').select('*').eq('trip_id', tripId).order('sort_order'),
    supabase.from('italy_expenses').select('*').eq('trip_id', tripId).order('sort_order'),
  ])
  for (const r of [days, places, travelers, reservations, expenses]) {
    if (r.error) throw r.error
  }

  return {
    trip: toTrip(tripRow),
    days: (days.data ?? []).map(toDay),
    places: (places.data ?? []).map(toPlace),
    travelers: (travelers.data ?? []).map(toTraveler),
    reservations: (reservations.data ?? []).map(toReservation),
    expenses: (expenses.data ?? []).map(toExpense),
  }
}

// ── Writes (return DB rows where an id is generated) ─────────────────────────
export async function patchTripRow(id: string, patch: Record<string, any>) {
  const { error } = await supabase
    .from('italy_trips')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function patchDayRow(id: string, patch: Record<string, any>) {
  const { error } = await supabase.from('italy_days').update(patch).eq('id', id)
  if (error) throw error
}

export async function insertPlaceRow(row: Record<string, any>): Promise<Place> {
  const { data, error } = await supabase.from('italy_places').insert(row).select().single()
  if (error) throw error
  return toPlace(data)
}

export async function patchPlaceRow(id: string, patch: Record<string, any>) {
  const { error } = await supabase.from('italy_places').update(patch).eq('id', id)
  if (error) throw error
}

export async function deletePlaceRow(id: string) {
  const { error } = await supabase.from('italy_places').delete().eq('id', id)
  if (error) throw error
}

export async function insertExpenseRow(row: Record<string, any>): Promise<Expense> {
  const { data, error } = await supabase.from('italy_expenses').insert(row).select().single()
  if (error) throw error
  return toExpense(data)
}

export async function patchExpenseRow(id: string, patch: Record<string, any>) {
  const { error } = await supabase.from('italy_expenses').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteExpenseRow(id: string) {
  const { error } = await supabase.from('italy_expenses').delete().eq('id', id)
  if (error) throw error
}

export async function insertReservationRow(row: Record<string, any>): Promise<Reservation> {
  const { data, error } = await supabase
    .from('italy_reservations')
    .insert(row)
    .select()
    .single()
  if (error) throw error
  return toReservation(data)
}

export async function patchReservationRow(id: string, patch: Record<string, any>) {
  const { error } = await supabase.from('italy_reservations').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteReservationRow(id: string) {
  const { error } = await supabase.from('italy_reservations').delete().eq('id', id)
  if (error) throw error
}

export async function insertTravelerRow(row: Record<string, any>): Promise<Traveler> {
  const { data, error } = await supabase.from('italy_travelers').insert(row).select().single()
  if (error) throw error
  return toTraveler(data)
}

export async function deleteTravelerRow(id: string) {
  const { error } = await supabase.from('italy_travelers').delete().eq('id', id)
  if (error) throw error
}
