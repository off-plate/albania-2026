import { trip } from '../data/trip'

const czk = (n: number) =>
  new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' Kč'

function toCzk(amount: number, currency: 'EUR' | 'CZK') {
  return currency === 'EUR' ? amount * trip.eurToCzk : amount
}

export default function Expenses() {
  const { travelers, expenses, budgetPerPersonCZK } = trip

  // Per-person paid vs owed (in CZK).
  const paid: Record<string, number> = {}
  const owed: Record<string, number> = {}
  travelers.forEach((t) => {
    paid[t.id] = 0
    owed[t.id] = 0
  })

  let total = 0
  expenses.forEach((e) => {
    const value = toCzk(e.amount, e.currency)
    total += value
    if (paid[e.paidBy] !== undefined) paid[e.paidBy] += value
    const sharers = e.splitAmong && e.splitAmong.length ? e.splitAmong : travelers.map((t) => t.id)
    const each = value / sharers.length
    sharers.forEach((id) => {
      if (owed[id] !== undefined) owed[id] += each
    })
  })

  const perPersonAvg = total / travelers.length
  const budgetTotal = budgetPerPersonCZK * travelers.length

  return (
    <section className="expenses">
      <div className="money-top">
        <div className="money-stat">
          <span className="money-n">{czk(total)}</span>
          <span className="money-l">spent so far</span>
        </div>
        <div className="money-stat">
          <span className="money-n money-muted">{czk(budgetTotal)}</span>
          <span className="money-l">group budget</span>
        </div>
        <div className="money-stat">
          <span className="money-n money-muted">{czk(perPersonAvg)}</span>
          <span className="money-l">avg / person</span>
        </div>
      </div>

      <h3 className="money-h">Who's up, who's down</h3>
      <p className="money-sub">Paid minus their fair share. Positive = others owe them.</p>
      <ul className="balances">
        {travelers.map((t) => {
          const net = paid[t.id] - owed[t.id]
          const cls = net > 0.5 ? 'up' : net < -0.5 ? 'down' : 'flat'
          return (
            <li key={t.id} className={`balance balance-${cls}`}>
              <span className="balance-name">{t.name}</span>
              <span className="balance-paid">paid {czk(paid[t.id])}</span>
              <span className="balance-net">
                {net > 0.5 ? '+' : ''}
                {czk(net)}
              </span>
            </li>
          )
        })}
      </ul>

      <h3 className="money-h">Expenses</h3>
      {expenses.length === 0 ? (
        <p className="empty">
          Nothing logged yet. Tell me what got paid — "fuel €90, paid by Michael" — and it
          lands here with the split worked out.
        </p>
      ) : (
        <ul className="expense-list">
          {expenses.map((e) => {
            const payer = travelers.find((t) => t.id === e.paidBy)?.name ?? e.paidBy
            return (
              <li key={e.id} className="expense">
                <div className="expense-main">
                  <span className="expense-label">{e.label}</span>
                  <span className="expense-meta">
                    paid by {payer}
                    {e.date ? ` · ${e.date}` : ''}
                  </span>
                </div>
                <span className="expense-amount">
                  {e.currency === 'EUR' ? `€${e.amount}` : czk(e.amount)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
