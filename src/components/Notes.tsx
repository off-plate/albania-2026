import { useEffect, useRef, useState } from 'react'

const KEY = 'italytrip26:notes'

const STARTER =
  '<p><strong>Trip notes</strong></p>' +
  '<ul>' +
  '<li>Confirm Chianti Airbnb price and dates</li>' +
  '<li>Book Ferrari museum tickets</li>' +
  '<li>Decide dinners for Verona and Florence</li>' +
  '</ul>'

export default function Notes() {
  const ref = useRef<HTMLDivElement>(null)
  const [bold, setBold] = useState(false)
  const [bullet, setBullet] = useState(false)

  // Load once into the editable element (uncontrolled, so the caret behaves).
  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    if (ref.current) ref.current.innerHTML = saved ?? STARTER
  }, [])

  function save() {
    if (ref.current) localStorage.setItem(KEY, ref.current.innerHTML)
  }

  function syncState() {
    try {
      setBold(document.queryCommandState('bold'))
      setBullet(document.queryCommandState('insertUnorderedList'))
    } catch {
      /* queryCommandState can throw if focus is elsewhere */
    }
  }

  function cmd(command: string) {
    ref.current?.focus()
    document.execCommand(command, false)
    save()
    syncState()
  }

  return (
    <div className="notes-view">
      <header className="panel-head">
        <h1>Notes</h1>
        <p>Anything you want. Saved on this device. Send it to me to make it permanent.</p>
      </header>

      <div className="nb-toolbar">
        <button
          className={bold ? 'nb-on' : ''}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => cmd('bold')}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          className={bullet ? 'nb-on' : ''}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => cmd('insertUnorderedList')}
          title="Bullet list"
        >
          • List
        </button>
        <button
          className="nb-copy"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => ref.current && navigator.clipboard?.writeText(ref.current.innerText)}
          title="Copy text"
        >
          Copy
        </button>
      </div>

      <div
        ref={ref}
        className="nb-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={save}
        onKeyUp={syncState}
        onMouseUp={syncState}
        onFocus={syncState}
      />
    </div>
  )
}
