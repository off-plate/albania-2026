import type { Expense, Trip } from '../types'
import { STAY_OPTIONS, FLIGHTS } from '../data/stayOptions'

// The Albania budget line items live in Supabase and writes are locked to the
// owner's login (RLS), so a shared session can't rewrite them. Until the owner
// edits them in the app, we correct the estimate rows in code so the Budget
// section reflects the real listing prices. Applied only in viewer mode; in
// edit mode the owner sees the raw DB rows and can bake in the real numbers.

function avgAlbaniaStay(): number | null {
  const priced = STAY_OPTIONS.filter((s) => s.totalCzk != null).map((s) => s.totalCzk as number)
  if (!priced.length) return null
  return Math.round(priced.reduce((a, b) => a + b, 0) / priced.length)
}

export function applyBudgetOverride(expenses: Expense[], trip: Trip): Expense[] {
  if (trip.slug !== 'albania-2026') return expenses
  const stay = avgAlbaniaStay()
  const flightsTotal = FLIGHTS.long.perPersonCzk * 4 // 4 people
  const flightPp = FLIGHTS.long.perPersonCzk.toLocaleString('cs-CZ')

  return expenses.map((e) => {
    if (e.category === 'lodging' && stay != null) {
      return { ...e, amount: stay, currency: 'CZK', label: 'Stays, whole trip (avg of Albania options)' }
    }
    if (/flight|let/i.test(e.label)) {
      return { ...e, amount: flightsTotal, currency: 'CZK', label: `Flights Prague to Tirana (4x, ${flightPp} Kč / person)` }
    }
    return e
  })
}
