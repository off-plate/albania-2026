import type { Currency, Expense, Trip } from '../types'

export function fmtCZK(n: number): string {
  return `CZK ${Math.round(n).toLocaleString('en-US')}`
}

export function fmtMoney(amount: number, currency: Currency): string {
  if (currency === 'EUR') return `EUR ${amount.toLocaleString('en-US')}`
  return fmtCZK(amount)
}

/** Convert any expense to CZK using the trip FX rate. */
export function toCZK(e: Pick<Expense, 'amount' | 'currency'>, trip: Trip): number {
  return e.currency === 'EUR' ? e.amount * trip.eurToCzk : e.amount
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** "2026-08-23" → "Sun 23 Aug" */
export function fmtDayDate(iso: string | null): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  return `${DAYS[dt.getUTCDay()]} ${d} ${MONTHS[m - 1]}`
}

/** "2026-08-21" + "2026-08-30" → "21–30 August 2026" */
export function fmtDateRange(start: string | null, end: string | null): string {
  if (!start) return ''
  const [, ms, ds] = start.split('-').map(Number)
  if (!end) return `${ds} ${MONTHS[ms - 1]}`
  const [ye, me, de] = end.split('-').map(Number)
  if (ms === me) return `${ds}–${de} ${MONTHS[ms - 1]} ${ye}`
  return `${ds} ${MONTHS[ms - 1]} – ${de} ${MONTHS[me - 1]} ${ye}`
}
