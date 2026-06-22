import { useEffect, useRef, useState } from 'react'
import { searchPlaces, type GeoResult } from '../lib/geocode'
import { useStore } from '../store'

type DropState = 'idle' | 'loading' | 'results' | 'empty' | 'error'

export default function AddPlace({ dayId, dayTitle }: { dayId: string | null; dayTitle: string }) {
  const { addPlace } = useStore()
  const [q, setQ] = useState('')
  const [state, setState] = useState<DropState>('idle')
  const [results, setResults] = useState<GeoResult[]>([])
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (q.trim().length < 3) {
      setState('idle')
      setResults([])
      abortRef.current?.abort()
      return
    }
    const t = setTimeout(async () => {
      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac
      setState('loading')
      setOpen(true)
      try {
        const r = await searchPlaces(q.trim(), ac.signal)
        setResults(r)
        setActive(0)
        setState(r.length ? 'results' : 'empty')
      } catch (e: any) {
        if (e?.name === 'AbortError') return
        setState('error')
      }
    }, 250)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const choose = (r: GeoResult) => {
    addPlace(dayId, { name: r.name, lat: r.lat, lng: r.lng })
    setQ('')
    setResults([])
    setState('idle')
    setOpen(false)
  }

  const addCustom = () => {
    if (!q.trim()) return
    addPlace(dayId, { name: q.trim() })
    setQ('')
    setState('idle')
    setOpen(false)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % Math.max(results.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a - 1 + results.length) % Math.max(results.length, 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (state === 'results' && results[active]) choose(results[active])
      else if (state === 'empty') addCustom()
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="addplace" ref={boxRef}>
      <div className="addplace-box">
        <span className="addplace-plus">+</span>
        <input
          className="addplace-input"
          value={q}
          placeholder={`Add a place to ${dayTitle}`}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.trim().length >= 3 && setOpen(true)}
          onKeyDown={onKey}
          role="combobox"
          aria-expanded={open}
          aria-controls="addplace-list"
        />
        {state === 'loading' && <span className="addplace-spin" aria-hidden />}
      </div>

      {open && state !== 'idle' && (
        <div className="addplace-drop" id="addplace-list" role="listbox">
          {state === 'loading' &&
            [0, 1, 2].map((i) => (
              <div className="ap-row ap-skel" key={i}>
                <span className="ap-pin skel-pin" />
                <span className="ap-text">
                  <span className="skel-bar w60" />
                  <span className="skel-bar w40" />
                </span>
              </div>
            ))}

          {state === 'results' &&
            results.map((r, i) => (
              <button
                key={`${r.lat},${r.lng},${i}`}
                role="option"
                aria-selected={i === active}
                className={`ap-row ${i === active ? 'ap-active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(r)}
              >
                <span className="ap-pin" aria-hidden>
                  <svg width="13" height="13" viewBox="0 0 13 13">
                    <path
                      d="M6.5 1C4.3 1 2.7 2.7 2.7 4.8c0 2.6 3.8 6.7 3.8 6.7s3.8-4.1 3.8-6.7C10.3 2.7 8.7 1 6.5 1z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.1"
                    />
                    <circle cx="6.5" cy="4.8" r="1.3" fill="currentColor" />
                  </svg>
                </span>
                <span className="ap-text">
                  <span className="ap-name">{r.name}</span>
                  {r.region && <span className="ap-region">{r.region}</span>}
                </span>
              </button>
            ))}

          {state === 'empty' && (
            <div className="ap-msg">
              <div>No places found for “{q.trim()}”.</div>
              <button className="ap-link" onClick={addCustom}>
                Add it as a custom stop
              </button>
            </div>
          )}

          {state === 'error' && (
            <div className="ap-msg">
              <div>Couldn’t reach the map service.</div>
              <button className="ap-link" onClick={() => setQ((x) => x + ' ')}>
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
