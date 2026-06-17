import { trip } from '../data/trip'

const CAT_ICON: Record<string, string> = {
  gas: '⛽',
  car: '⛟',
  lodging: '⌂',
  food: '☕',
  activity: '◎',
  other: '⊕',
}

function czk(n: number) {
  return new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' Kč'
}
function toCzk(amount: number, currency: 'EUR' | 'CZK') {
  return currency === 'EUR' ? amount * trip.eurToCzk : amount
}

export default function Budget() {
  const { travelers, expenses } = trip

  const paid: Record<string, number> = {}
  const owed: Record<string, number> = {}
  travelers.forEach((t) => {
    paid[t.id] = 0
    owed[t.id] = 0
  })

  let total = 0
  expenses.forEach((e) => {
    const v = toCzk(e.amount, e.currency)
    total += v
    if (paid[e.paidBy] !== undefined) paid[e.paidBy] += v
    const sharers = e.splitAmong?.length ? e.splitAmong : travelers.map((t) => t.id)
    sharers.forEach((id) => {
      if (owed[id] !== undefined) owed[id] += v / sharers.length
    })
  })

  const net = travelers.map((t) => ({ ...t, net: paid[t.id] - owed[t.id] }))

  // Minimal settle-up: match the most-owed against the most-owing.
  const debtors = net.filter((n) => n.net < -0.5).map((n) => ({ ...n, net: -n.net })).sort((a, b) => b.net - a.net)
  const creditors = net.filter((n) => n.net > 0.5).sort((a, b) => b.net - a.net)
  const settle: { from: string; to: string; amount: number }[] = []
  let di = 0, ci = 0
  const dd = debtors.map((d) => ({ ...d }))
  const cc = creditors.map((c) => ({ ...c }))
  while (di < dd.length && ci < cc.length) {
    const pay = Math.min(dd[di].net, cc[ci].net)
    settle.push({ from: dd[di].name, to: cc[ci].name, amount: pay })
    dd[di].net -= pay
    cc[ci].net -= pay
    if (dd[di].net < 0.5) di++
    if (cc[ci].net < 0.5) ci++
  }

  return (
    <div className="budget">
      <header className="panel-head budget-head">
        <h1>Budgeting</h1>
      </header>

      <div className="budget-total">
        <span className="budget-total-n">{czk(total)}</span>
        <span className="budget-total-l">total logged</span>
      </div>

      <h2 className="ov-h">Expenses</h2>
      <ul className="exp-list">
        {expenses.map((e) => {
          const payer = travelers.find((t) => t.id === e.paidBy)
          return (
            <li className="exp" key={e.id}>
              <span className="exp-icon">{CAT_ICON[e.category]}</span>
              <span className="exp-main">
                <span className="exp-label">{e.label}</span>
                <span className="exp-meta">
                  {e.date ? `${e.date} · ` : ''}paid by {payer?.name ?? e.paidBy}
                </span>
              </span>
              <span className="exp-amt">
                {e.currency === 'EUR' ? `€${e.amount.toFixed(2)}` : czk(e.amount)}
              </span>
            </li>
          )
        })}
      </ul>
      {expenses.length === 0 && <p className="notes">No expenses yet.</p>}

      <h2 className="ov-h">Group balances</h2>
      <ul className="balances">
        {net.map((n) => {
          const cls = n.net > 0.5 ? 'up' : n.net < -0.5 ? 'down' : 'flat'
          return (
            <li className={`bal bal-${cls}`} key={n.id}>
              <span className="bal-name">{n.name}</span>
              <span className="bal-paid">paid {czk(paid[n.id])}</span>
              <span className="bal-net">
                {n.net > 0.5 ? 'gets back ' : n.net < -0.5 ? 'owes ' : ''}
                {czk(Math.abs(n.net))}
              </span>
            </li>
          )
        })}
      </ul>

      {settle.length > 0 && (
        <div className="settle">
          {settle.map((s, i) => (
            <p key={i} className="settle-line">
              <strong>{s.from}</strong> pays <strong>{s.to}</strong>
              <span className="settle-amt">{czk(s.amount)}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
