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
        <a className="brand" href="#/" title="Všechny cesty">
          <span className="brand-mark">‹</span>
          Albánie 2026
        </a>
        <span className="saved">{saving ? 'Ukládám…' : 'Uloženo'}</span>
      </div>

      <div className="topbar-r">
        <button className="btn-line" onClick={shareView}>
          {copied ? 'Zkopírováno' : 'Sdílet'}
        </button>

        {isEditor ? (
          <>
            <div className="toggle">
              <button className={mode === 'view' ? 'toggle-on' : ''} onClick={() => setMode('view')}>
                Prohlížet
              </button>
              <button className={mode === 'edit' ? 'toggle-on' : ''} onClick={() => setMode('edit')}>
                Upravit
              </button>
            </div>
            <button className="btn-line" onClick={signOut}>Odhlásit</button>
          </>
        ) : (
          <button className="btn-line" onClick={() => setLoginOpen(true)}>Upravit</button>
        )}

        <button className="btn-map-toggle" onClick={() => setMapMobileOpen(!mapMobileOpen)}>
          {mapMobileOpen ? 'Seznam' : 'Mapa'}
        </button>
      </div>

      {loginOpen && (
        <div className="modal-scrim" onClick={() => setLoginOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Přihlásit k úpravám</h3>
            <p className="modal-sub">Upravovat může jen vlastník cesty. Ostatní vidí jen náhled.</p>
            <input
              type="password"
              autoFocus
              placeholder="Heslo"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            {err && <div className="modal-err">{err}</div>}
            <div className="modal-actions">
              <button className="ap-link" onClick={() => setLoginOpen(false)}>Zrušit</button>
              <button className="comp-add" onClick={submit} disabled={authBusy}>
                {authBusy ? 'Přihlašuji…' : 'Přihlásit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
