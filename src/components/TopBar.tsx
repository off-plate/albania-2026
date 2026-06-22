import { useState } from 'react'
import { useStore } from '../store'

export default function TopBar() {
  const {
    data,
    saving,
    isEditor,
    mode,
    setMode,
    signIn,
    signOut,
    authBusy,
    mapMobileOpen,
    setMapMobileOpen,
  } = useStore()
  const [loginOpen, setLoginOpen] = useState(false)
  const [pw, setPw] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const submit = async () => {
    setErr(null)
    const e = await signIn(pw)
    if (e) setErr(e)
    else {
      setLoginOpen(false)
      setPw('')
    }
  }

  const shareView = () => {
    const url = `${window.location.origin}${window.location.pathname}`
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <header className="topbar">
      <div className="topbar-l">
        <a className="brand" href="#/" title="All trips">
          <span className="brand-mark">‹</span>
          {data?.trip.title ?? 'Trips'}
        </a>
        <span className="saved">{saving ? 'Saving…' : 'Saved'}</span>
      </div>

      <div className="topbar-r">
        <button className="btn-line" onClick={shareView}>
          {copied ? 'Link copied' : 'Share view'}
        </button>

        {isEditor ? (
          <>
            <div className="toggle">
              <button className={mode === 'view' ? 'toggle-on' : ''} onClick={() => setMode('view')}>
                View
              </button>
              <button className={mode === 'edit' ? 'toggle-on' : ''} onClick={() => setMode('edit')}>
                Edit
              </button>
            </div>
            <button className="btn-line" onClick={signOut}>Sign out</button>
          </>
        ) : (
          <button className="btn-line" onClick={() => setLoginOpen(true)}>Edit</button>
        )}

        <button className="btn-map-toggle" onClick={() => setMapMobileOpen(!mapMobileOpen)}>
          {mapMobileOpen ? 'List' : 'Map'}
        </button>
      </div>

      {loginOpen && (
        <div className="modal-scrim" onClick={() => setLoginOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Sign in to edit</h3>
            <p className="modal-sub">Only the trip owner can edit. Everyone else has a read-only view.</p>
            <input
              type="password"
              autoFocus
              placeholder="Editor password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            {err && <div className="modal-err">{err}</div>}
            <div className="modal-actions">
              <button className="ap-link" onClick={() => setLoginOpen(false)}>Cancel</button>
              <button className="comp-add" onClick={submit} disabled={authBusy}>
                {authBusy ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
