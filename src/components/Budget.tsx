import { useState } from 'react'
import { useStore } from '../store'
import type { Currency, ExpenseCategory } from '../types'
import { fmtCZK, fmtMoney, toCZK } from '../lib/format'
import { applyBudgetOverride } from '../lib/budgetOverride'
import { InlineText, InlineNumberChip } from './Inline'

const CATS: { key: ExpenseCategory; label: string; color: string }[] = [
  { key: 'lodging', label: 'Lodging', color: '#2E6BB8' },
  { key: 'food', label: 'Food', color: '#C8461E' },
  { key: 'activity', label: 'Sightseeing', color: '#9C5BB0' },
  { key: 'gas', label: 'Gas', color: '#9A8C7B' },
  { key: 'car', label: 'Transit', color: '#6A5C4E' },
  { key: 'other', label: 'Other', color: '#3A2C1E' },
]
const catOf = (k: ExpenseCategory) => CATS.find((c) => c.key === k) ?? CATS[5]

export default function Budget() {
  const { data, canEdit, patchTrip, patchExpense, deleteExpense } = useStore()
  const [adding, setAdding] = useState(false)
  if (!data) return null
  const { trip, travelers } = data
  // Viewer sees corrected real-price figures; owner-editor sees raw DB rows.
  const expenses = canEdit ? data.expenses : applyBudgetOverride(data.expenses, trip)

  const spent = expenses.reduce((s, e) => s + toCZK(e, trip), 0)
  const budget = trip.budgetTotalCzk
  const over = budget != null && spent > budget

  return (
    <div>
      <div className="panel-head">
        <h1>Budget</h1>
      </div>

      {/* A. total + budget */}
      <div className="bud-top">
        <div className="bud-total">
          <div className="bud-total-n">{fmtCZK(spent)}</div>
          <div className="bud-total-l">Spent so far</div>
        </div>
        <div className="bud-set">
          <div className="bud-set-l">Budget</div>
          {canEdit ? (
            <InlineNumberChip value={budget} placeholder="Set budget" onCommit={(v) => patchTrip({ budgetTotalCzk: v })} />
          ) : (
            <div className="bud-set-n">{budget ? fmtCZK(budget) : '—'}</div>
          )}
        </div>
      </div>
      {budget != null && (
        <div className="meter meter-wide">
          <div className="meter-fill" style={{ width: `${Math.min(100, (spent / budget) * 100)}%`, background: over ? 'var(--accent-deep)' : 'var(--accent)' }} />
        </div>
      )}
      <div className="bud-fx">EUR shown at {trip.eurToCzk} Kč</div>

      {/* B. add expense */}
      {canEdit && !adding && (
        <button className="bud-add" onClick={() => setAdding(true)}>+ Add expense</button>
      )}
      {adding && <ExpenseComposer onClose={() => setAdding(false)} />}

      {/* C. expense list */}
      {expenses.length === 0 ? (
        <div className="ov-empty">No expenses logged yet.</div>
      ) : (
        <ul className="exp-list">
          {expenses.map((e) => {
            const cat = catOf(e.category)
            return (
              <li className="exp" key={e.id}>
                <span className="exp-dot" style={{ background: cat.color }} />
                <div className="exp-main">
                  <InlineText
                    className="exp-label"
                    value={e.label}
                    editable={canEdit}
                    onCommit={(v) => patchExpense(e.id, { label: v })}
                  />
                  <div className="exp-meta">
                    {e.date ? `${e.date} · ` : ''}
                    {canEdit ? (
                      <select
                        className="exp-cat-select"
                        value={e.category}
                        onChange={(ev) => patchExpense(e.id, { category: ev.target.value as ExpenseCategory })}
                      >
                        {CATS.map((c) => (
                          <option key={c.key} value={c.key}>{c.label}</option>
                        ))}
                      </select>
                    ) : (
                      cat.label
                    )}
                  </div>
                </div>
                <div className="exp-right">
                  {canEdit ? (
                    <InlineNumberChip
                      value={e.amount}
                      prefix={e.currency}
                      placeholder="Amount"
                      onCommit={(v) => patchExpense(e.id, { amount: v ?? 0 })}
                    />
                  ) : (
                    <span className="exp-amt">{fmtMoney(e.amount, e.currency)}</span>
                  )}
                  {e.currency === 'EUR' && <span className="exp-czk">{fmtCZK(toCZK(e, trip))}</span>}
                  {canEdit && (
                    <button className="exp-del" onClick={() => deleteExpense(e.id)} aria-label="Delete">✕</button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* D. split */}
      <div className="ov-h">Split between {travelers.length}</div>
      <Split />
    </div>
  )
}

function ExpenseComposer({ onClose }: { onClose: () => void }) {
  const { addExpense, data } = useStore()
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<Currency>('CZK')
  const [category, setCategory] = useState<ExpenseCategory>('other')
  const [paidBy, setPaidBy] = useState(data?.travelers[0]?.id ?? '')

  const submit = () => {
    const amt = Number(amount.replace(/[^\d.]/g, ''))
    if (!label.trim() || !Number.isFinite(amt) || amt <= 0) return
    addExpense({ label: label.trim(), amount: amt, currency, category, paidBy })
    onClose()
  }

  return (
    <div className="composer">
      <input className="comp-label" autoFocus placeholder="What was it?" value={label} onChange={(e) => setLabel(e.target.value)} />
      <div className="comp-row">
        <input className="comp-amt" inputMode="decimal" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <div className="seg">
          <button className={currency === 'CZK' ? 'seg-on' : ''} onClick={() => setCurrency('CZK')}>CZK</button>
          <button className={currency === 'EUR' ? 'seg-on' : ''} onClick={() => setCurrency('EUR')}>EUR</button>
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
          {CATS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        {data && data.travelers.length > 0 && (
          <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} title="Paid by">
            {data.travelers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        )}
      </div>
      <div className="comp-actions">
        <button className="ap-link" onClick={onClose}>Cancel</button>
        <button className="comp-add" onClick={submit}>Add</button>
      </div>
    </div>
  )
}

function Split() {
  const { data, canEdit } = useStore()
  if (!data) return null
  const { trip, travelers } = data
  const expenses = canEdit ? data.expenses : applyBudgetOverride(data.expenses, trip)
  if (travelers.length === 0) return <div className="ov-empty">Add travelers to split costs.</div>

  const total = expenses.reduce((s, e) => s + toCZK(e, trip), 0)
  const share = total / travelers.length
  const paid = new Map<string, number>()
  for (const t of travelers) paid.set(t.id, 0)
  for (const e of expenses) {
    if (e.paidBy && paid.has(e.paidBy)) paid.set(e.paidBy, paid.get(e.paidBy)! + toCZK(e, trip))
  }

  return (
    <>
      <div className="split-cards">
        {travelers.map((t) => {
          const net = (paid.get(t.id) ?? 0) - share
          const cls = Math.abs(net) < 1 ? 'flat' : net > 0 ? 'pos' : 'neg'
          return (
            <div className="split-card" key={t.id}>
              <div className="split-card-top">
                <span className="split-avatar">{t.initials || t.name.slice(0, 1)}</span>
                <span className="split-name">{t.name}</span>
              </div>
              <div className="split-rows">
                <div><span>Paid</span><span>{fmtCZK(paid.get(t.id) ?? 0)}</span></div>
                <div><span>Share</span><span>{fmtCZK(share)}</span></div>
                <div className="split-net">
                  <span>{net > 0 ? 'Is owed' : net < 0 ? 'Owes' : 'Settled'}</span>
                  <span className={cls}>{cls === 'flat' ? 'settled' : fmtCZK(Math.abs(net))}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
