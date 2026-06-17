import { trip } from '../data/trip'

function czk(n: number) {
  return new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' Kč'
}
function toCzk(amount: number, currency: 'EUR' | 'CZK') {
  return currency === 'EUR' ? amount * trip.eurToCzk : amount
}

export default function Split() {
  const { travelers, expenses } = trip

  const paid: Record<string, number> = {}
  const share: Record<string, number> = {}
  travelers.forEach((t) => {
    paid[t.id] = 0
    share[t.id] = 0
  })

  let total = 0
  expenses.forEach((e) => {
    const v = toCzk(e.amount, e.currency)
    total += v
    if (paid[e.paidBy] !== undefined) paid[e.paidBy] += v
    const sharers = e.splitAmong?.length ? e.splitAmong : travelers.map((t) => t.id)
    sharers.forEach((id) => {
      if (share[id] !== undefined) share[id] += v / sharers.length
    })
  })

  return (
    <div className="split-view">
      <header className="panel-head">
        <h1>Split</h1>
        <p>How much the trip costs each person, split evenly across {travelers.length}.</p>
      </header>

      <div className="split-total">
        <span className="split-total-n">{czk(total / travelers.length)}</span>
        <span className="split-total-l">per person so far</span>
      </div>

      <div className="split-cards">
        {travelers.map((t) => {
          const net = paid[t.id] - share[t.id]
          return (
            <div className="split-card" key={t.id}>
              <div className="split-card-top">
                <span className="split-avatar">{t.initials}</span>
                <span className="split-name">{t.name}</span>
              </div>
              <dl className="split-rows">
                <div>
                  <dt>Their share</dt>
                  <dd>{czk(share[t.id])}</dd>
                </div>
                <div>
                  <dt>Paid</dt>
                  <dd>{czk(paid[t.id])}</dd>
                </div>
                <div className="split-net">
                  <dt>{net >= 0 ? 'Gets back' : 'Still owes'}</dt>
                  <dd className={net >= -0.5 ? 'pos' : 'neg'}>{czk(Math.abs(net))}</dd>
                </div>
              </dl>
            </div>
          )
        })}
      </div>

      {trip.budgetPerPersonCZK && (
        <p className="notes">
          Budget guide: {czk(trip.budgetPerPersonCZK)} per person. Logged so far:{' '}
          {czk(total / travelers.length)}.
        </p>
      )}
    </div>
  )
}
