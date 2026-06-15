import { useMemo, useState } from 'react'
import MapView from './components/MapView'
import { DAYS, PACKAGES, FUEL_ROUND_TRIP, TOLLS, TRIP_DAYS, TRAVELLERS_DEFAULT } from './data'
import type { Expense, PackageId, Stop } from './types'
import { usePersist, eur, kc } from './storage'

const NIGHTS = 9

export default function App() {
  const [pkgId, setPkgId] = usePersist<PackageId>('pkg', 'saver')
  const [tab, setTab] = usePersist<'plan' | 'budget' | 'expenses'>('tab', 'plan')
  const [selDay, setSelDay] = useState<string>(DAYS[0].id)
  const [whole, setWhole] = useState(false)
  const [custom, setCustom] = usePersist<Record<string, Stop[]>>('custom', {})
  const [done, setDone] = usePersist<Record<string, boolean>>('done', {})
  const [travellers, setTravellers] = usePersist<string[]>('travellers', TRAVELLERS_DEFAULT)
  const [expenses, setExpenses] = usePersist<Expense[]>('expenses', [])

  const pkg = PACKAGES.find((p) => p.id === pkgId)!
  const people = Math.max(1, travellers.length)
  const foodTotal = pkg.foodPerDayPP * TRIP_DAYS * people
  const planTotal =
    FUEL_ROUND_TRIP + TOLLS + pkg.accomTotal + foodTotal + pkg.activitiesTotal + pkg.parkingTotal + pkg.innsbruckCost
  const perPerson = planTotal / people
  const nightly = pkg.accomTotal / NIGHTS

  const stopsForDay = (id: string): Stop[] => {
    const d = DAYS.find((x) => x.id === id)!
    return [...d.stops, ...(custom[id] || [])]
  }
  const mapStops = whole
    ? DAYS.flatMap((d) => stopsForDay(d.id))
    : stopsForDay(selDay)

  return (
    <div className="app">
      <header className="top">
        <div className="row">
          <div className="brand">Riviera Planner<small>Italy · August 2026</small></div>
          <div className="pkgsw">
            {PACKAGES.map((p) => (
              <button key={p.id} className={p.id === pkgId ? 'on' : ''} onClick={() => setPkgId(p.id)}>
                {p.emoji} {p.name}
              </button>
            ))}
          </div>
          <div className="spend">
            <b>{kc(perPerson)}</b>
            <span>/ person · {eur(perPerson)}</span>
          </div>
        </div>
      </header>

      {tab === 'plan' && (
        <div className="split">
          <div>
            <div className="section-h">
              <h2>Itinerary</h2>
              <p>Tap a day to focus the map. Tick stops as you go. Not every day is a trip — Days 8 &amp; 9 are rest days. Currently showing the <b>{pkg.name}</b> plan.</p>
              <button className="btn ghost sm" style={{ marginTop: 8 }} onClick={() => setWhole((w) => !w)}>
                {whole ? 'Show one day' : 'Show whole trip on map'}
              </button>
            </div>
            {DAYS.map((d) => {
              const stops = stopsForDay(d.id)
              const est = (d.base ? nightly : 0) + pkg.foodPerDayPP * people
              const sel = d.id === selDay && !whole
              const gmaps =
                'https://www.google.com/maps/dir/' + stops.map((s) => `${s.lat},${s.lng}`).join('/')
              return (
                <div key={d.id} className={`day${sel ? ' sel' : ''}${d.rest ? ' rest' : ''}`}>
                  <div className="day-h" onClick={() => { setSelDay(d.id); setWhole(false) }}>
                    <div className="n">{d.n}</div>
                    <div>
                      <div className="tg">{d.dow} · {d.tag}</div>
                      <h3>{d.title}</h3>
                    </div>
                    <div className="chev">{sel ? '▾' : '▸'}</div>
                  </div>
                  {sel && (
                    <div className="day-b">
                      {stops.map((s, i) => {
                        const isDone = !!done[s.id]
                        return (
                          <div key={s.id} className={`stoprow${s.optional ? ' opt' : ''}${isDone ? ' checked' : ''}`}>
                            <div className="dot">{i + 1}</div>
                            <div className="sd">
                              <b>{s.name}</b>
                              {s.optional && <span className="opt-tag">optional</span>}
                              {s.note && <div className="muted" style={{ fontSize: '.8rem' }}>{s.note}</div>}
                              {s.type === 'custom' && (
                                <button className="x" style={{ marginLeft: 6 }} onClick={() => removeCustom(d.id, s.id)}>remove</button>
                              )}
                            </div>
                            <button
                              className={`chk${isDone ? ' done' : ''}`}
                              title="Mark done"
                              onClick={() => setDone({ ...done, [s.id]: !isDone })}
                            >✓</button>
                          </div>
                        )
                      })}
                      <a className="gmaps-btn" href={gmaps} target="_blank" rel="noreferrer">🚗 Open this day's drive in Google Maps</a>
                      <AddPlace dayId={d.id} onAdd={addCustom} />
                      <div className="daycost">
                        <div className="l">~ stay + food this day</div>
                        <div className="v"><b>{kc(est)}</b><span>{eur(est)} · group of {people}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mapcol">
            <MapView stops={mapStops} line={!whole} />
          </div>
        </div>
      )}

      {tab === 'budget' && (
        <div className="panel">
          <div className="section-h">
            <h2>Budget</h2>
            <p>Three tiers. Tap one to switch the whole plan. Everything is the group of {people}, in CZK and EUR (1&nbsp;€&nbsp;=&nbsp;25&nbsp;Kč).</p>
          </div>
          <div className="pkgcards">
            {PACKAGES.map((p) => {
              const ft = p.foodPerDayPP * TRIP_DAYS * people
              const tot = FUEL_ROUND_TRIP + TOLLS + p.accomTotal + ft + p.activitiesTotal + p.parkingTotal + p.innsbruckCost
              return (
                <div key={p.id} className={`pkgcard${p.id === pkgId ? ' on' : ''}`} onClick={() => setPkgId(p.id)}>
                  <h3>{p.emoji} {p.name}</h3>
                  <div className="pr">{kc(tot / people)}<small>per person · {kc(tot)} total</small></div>
                  <p>{p.blurb}</p>
                  <p className="muted" style={{ fontSize: '.78rem' }}>{p.driveStyle}</p>
                </div>
              )
            })}
          </div>
          <div className="card">
            <h3 className="serif" style={{ fontSize: '1.1rem' }}>{pkg.emoji} {pkg.name} — what's inside</h3>
            <table>
              <tbody>
                <tr><th>Line</th><th>Group</th><th>Per person</th></tr>
                <tr><td>🛏️ Accommodation ({NIGHTS} nights) <span className="kc">— {pkg.stayNote}</span></td><td>{eur(pkg.accomTotal)} <span className="kc">{kc(pkg.accomTotal)}</span></td><td>{kc(pkg.accomTotal / people)}</td></tr>
                <tr><td>⛽ Fuel (round trip)</td><td>{eur(FUEL_ROUND_TRIP)} <span className="kc">{kc(FUEL_ROUND_TRIP)}</span></td><td>{kc(FUEL_ROUND_TRIP / people)}</td></tr>
                <tr><td>🎟️ Tolls + vignettes</td><td>{eur(TOLLS)} <span className="kc">{kc(TOLLS)}</span></td><td>{kc(TOLLS / people)}</td></tr>
                <tr><td>🍽️ Food (€{pkg.foodPerDayPP}/person/day × {TRIP_DAYS} days)</td><td>{eur(foodTotal)} <span className="kc">{kc(foodTotal)}</span></td><td>{kc(foodTotal / people)}</td></tr>
                <tr><td>🚆 Activities</td><td>{eur(pkg.activitiesTotal)} <span className="kc">{kc(pkg.activitiesTotal)}</span></td><td>{kc(pkg.activitiesTotal / people)}</td></tr>
                <tr><td>🅿️ Parking + local fuel</td><td>{eur(pkg.parkingTotal)} <span className="kc">{kc(pkg.parkingTotal)}</span></td><td>{kc(pkg.parkingTotal / people)}</td></tr>
                {pkg.innsbruckCost > 0 && (
                  <tr><td>🏨 Innsbruck overnight ×{pkg.innsbruckNights}</td><td>{eur(pkg.innsbruckCost)} <span className="kc">{kc(pkg.innsbruckCost)}</span></td><td>{kc(pkg.innsbruckCost / people)}</td></tr>
                )}
                <tr className="tot"><td>Total</td><td>{eur(planTotal)} <span className="kc">{kc(planTotal)}</span></td><td>{kc(perPerson)}</td></tr>
              </tbody>
            </table>
            <div className="note">Researched estimates, not quotes. Add ~5% contingency. The Saver tier is built to your ~20,000 Kč/person target.</div>
          </div>
        </div>
      )}

      {tab === 'expenses' && (
        <ExpensesPanel
          travellers={travellers}
          setTravellers={setTravellers}
          expenses={expenses}
          setExpenses={setExpenses}
        />
      )}

      <nav className="tabs">
        <button className={tab === 'plan' ? 'on' : ''} onClick={() => setTab('plan')}><span className="ti">🗺️</span>Itinerary</button>
        <button className={tab === 'budget' ? 'on' : ''} onClick={() => setTab('budget')}><span className="ti">💶</span>Budget</button>
        <button className={tab === 'expenses' ? 'on' : ''} onClick={() => setTab('expenses')}><span className="ti">🧾</span>Expenses</button>
      </nav>
    </div>
  )

  function addCustom(dayId: string, stop: Stop) {
    setCustom({ ...custom, [dayId]: [...(custom[dayId] || []), stop] })
  }
  function removeCustom(dayId: string, stopId: string) {
    setCustom({ ...custom, [dayId]: (custom[dayId] || []).filter((s) => s.id !== stopId) })
  }
}

function AddPlace({ dayId, onAdd }: { dayId: string; onAdd: (d: string, s: Stop) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [coord, setCoord] = useState('')
  const [err, setErr] = useState('')

  function parse(input: string): [number, number] | null {
    const s = input.trim()
    let m = s.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)              // ...maps/@44.3,9.2,...
    if (!m) m = s.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)       // place !3d!4d
    if (!m) m = s.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)      // ?q=44,9
    if (!m) m = s.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/)    // plain "44.3, 9.2"
    return m ? [parseFloat(m[1]), parseFloat(m[2])] : null
  }
  function submit() {
    const c = parse(coord)
    if (!name.trim()) return setErr('Add a name')
    if (!c) return setErr('Paste a Google Maps link with coordinates, or type "lat, lng"')
    onAdd(dayId, { id: 'c' + Date.now(), name: name.trim(), type: 'custom', lat: c[0], lng: c[1] })
    setName(''); setCoord(''); setErr(''); setOpen(false)
  }
  if (!open) return <button className="btn ghost sm" style={{ marginTop: 8 }} onClick={() => setOpen(true)}>＋ Add a place to this day</button>
  return (
    <div className="card" style={{ marginTop: 10 }}>
      <label>Place name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Beach bar we found" />
      <label style={{ marginTop: 8 }}>Google Maps link or "lat, lng"</label>
      <input value={coord} onChange={(e) => setCoord(e.target.value)} placeholder="paste link, or 44.306,9.210" />
      {err && <div className="neg" style={{ fontSize: '.8rem', marginTop: 6 }}>{err}</div>}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button className="btn sm" onClick={submit}>Add pin</button>
        <button className="btn ghost sm" onClick={() => setOpen(false)}>Cancel</button>
      </div>
      <div className="muted" style={{ fontSize: '.74rem', marginTop: 6 }}>Tip: in Google Maps, right-click a spot → click the coordinates to copy, then paste here.</div>
    </div>
  )
}

function ExpensesPanel({
  travellers, setTravellers, expenses, setExpenses,
}: {
  travellers: string[]
  setTravellers: (t: string[]) => void
  expenses: Expense[]
  setExpenses: (e: Expense[]) => void
}) {
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(travellers[0])
  const [split, setSplit] = useState<string[]>(travellers)
  const [cat, setCat] = useState('Food')

  const totals = useMemo(() => {
    const paid: Record<string, number> = {}
    const owed: Record<string, number> = {}
    travellers.forEach((t) => { paid[t] = 0; owed[t] = 0 })
    expenses.forEach((e) => {
      paid[e.paidBy] = (paid[e.paidBy] || 0) + e.amount
      const share = e.amount / (e.splitAmong.length || 1)
      e.splitAmong.forEach((p) => { owed[p] = (owed[p] || 0) + share })
    })
    const net = travellers.map((t) => ({ name: t, net: (paid[t] || 0) - (owed[t] || 0), paid: paid[t] || 0, owed: owed[t] || 0 }))
    return { net, grand: expenses.reduce((s, e) => s + e.amount, 0) }
  }, [expenses, travellers])

  const settle = useMemo(() => {
    const debt = totals.net.filter((n) => n.net < -0.01).map((n) => ({ ...n }))
    const cred = totals.net.filter((n) => n.net > 0.01).map((n) => ({ ...n }))
    const out: { from: string; to: string; amt: number }[] = []
    let i = 0, j = 0
    while (i < debt.length && j < cred.length) {
      const m = Math.min(-debt[i].net, cred[j].net)
      out.push({ from: debt[i].name, to: cred[j].name, amt: m })
      debt[i].net += m; cred[j].net -= m
      if (Math.abs(debt[i].net) < 0.01) i++
      if (Math.abs(cred[j].net) < 0.01) j++
    }
    return out
  }, [totals])

  function add() {
    const a = parseFloat(amount)
    if (!desc.trim() || !a || split.length === 0) return
    setExpenses([
      { id: 'e' + Date.now(), desc: desc.trim(), amount: a, paidBy, splitAmong: split, category: cat },
      ...expenses,
    ])
    setDesc(''); setAmount('')
  }
  function toggleSplit(t: string) {
    setSplit(split.includes(t) ? split.filter((x) => x !== t) : [...split, t])
  }
  function rename(i: number, v: string) {
    const next = [...travellers]; next[i] = v; setTravellers(next)
  }

  return (
    <div className="panel">
      <div className="section-h">
        <h2>Expenses</h2>
        <p>Log what you actually spend, who paid, and who it's split between. The app works out per-person totals and who owes whom at the end.</p>
      </div>

      <div className="card">
        <label>Who's travelling (tap to rename)</label>
        <div className="formgrid">
          {travellers.map((t, i) => (
            <input key={i} value={t} onChange={(e) => rename(i, e.target.value)} />
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="serif" style={{ fontSize: '1.05rem' }}>Add an expense</h3>
        <div className="formgrid" style={{ marginTop: 8 }}>
          <div><label>What</label><input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Dinner, fuel, tickets…" /></div>
          <div><label>Amount (€)</label><input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" inputMode="decimal" /></div>
          <div><label>Paid by</label>
            <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {travellers.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><label>Category</label>
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              {['Food', 'Fuel', 'Accommodation', 'Activities', 'Tolls', 'Parking', 'Other'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <label style={{ marginTop: 10 }}>Split between</label>
        <div className="chips">
          {travellers.map((t) => (
            <button key={t} className={`chip${split.includes(t) ? ' on' : ''}`} onClick={() => toggleSplit(t)}>{t}</button>
          ))}
        </div>
        <button className="btn" style={{ marginTop: 12 }} onClick={add}>Add expense</button>
      </div>

      <div className="card">
        <h3 className="serif" style={{ fontSize: '1.05rem' }}>Balances</h3>
        <div className="muted" style={{ fontSize: '.85rem', marginBottom: 6 }}>Total spent: <b>{eur(totals.grand)}</b> ({kc(totals.grand)})</div>
        {totals.net.map((n) => (
          <div className="bal" key={n.name}>
            <span><b>{n.name}</b> <span className="muted">paid {eur(n.paid)} · share {eur(n.owed)}</span></span>
            <span className={n.net >= 0 ? 'pos' : 'neg'}>{n.net >= 0 ? 'gets back ' : 'owes '}{eur(Math.abs(n.net))} <span className="kc">{kc(Math.abs(n.net))}</span></span>
          </div>
        ))}
        {settle.length > 0 && (
          <>
            <h4 className="serif" style={{ marginTop: 14, fontSize: '.95rem' }}>Settle up</h4>
            {settle.map((s, i) => (
              <div className="bal" key={i}><span><b>{s.from}</b> → {s.to}</span><span className="neg">{eur(s.amt)} <span className="kc">{kc(s.amt)}</span></span></div>
            ))}
          </>
        )}
      </div>

      {expenses.length > 0 && (
        <div className="card">
          <h3 className="serif" style={{ fontSize: '1.05rem' }}>Log</h3>
          {expenses.map((e) => (
            <div className="bal" key={e.id}>
              <span><b>{e.desc}</b> <span className="muted">· {e.category} · {e.paidBy} · {e.splitAmong.length} way</span></span>
              <span>{eur(e.amount)} <button className="x" onClick={() => setExpenses(expenses.filter((x) => x.id !== e.id))}>✕</button></span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
