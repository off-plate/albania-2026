import { useEffect, useRef, useState } from 'react'

const KEY = 'italytrip26:notes'

const STARTER = `**Trip notes**

- Confirm Chianti Airbnb price and dates
- Book Ferrari museum tickets
- Decide dinners for Verona and Florence
- Check Austria vignette before the border`

// Tiny, safe markdown: escapes HTML first, then **bold**, "- " bullets, line breaks.
function render(md: string): string {
  const esc = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const lines = esc.split('\n')
  let html = ''
  let inList = false
  const bold = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  for (const raw of lines) {
    const line = raw.trimEnd()
    const isBullet = /^\s*[-*]\s+/.test(line)
    if (isBullet) {
      if (!inList) {
        html += '<ul>'
        inList = true
      }
      html += `<li>${bold(line.replace(/^\s*[-*]\s+/, ''))}</li>`
    } else {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      if (line.trim() === '') html += '<div class="nb-gap"></div>'
      else html += `<p>${bold(line)}</p>`
    }
  }
  if (inList) html += '</ul>'
  return html
}

export default function Notes() {
  const [text, setText] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    setText(saved ?? STARTER)
  }, [])

  function update(v: string) {
    setText(v)
    localStorage.setItem(KEY, v)
  }

  // Wrap the current selection (or insert) with a marker / line prefix.
  function wrap(before: string, after = before) {
    const ta = ref.current
    if (!ta) return
    const { selectionStart: s, selectionEnd: e } = ta
    const sel = text.slice(s, e) || 'text'
    const next = text.slice(0, s) + before + sel + after + text.slice(e)
    update(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(s + before.length, s + before.length + sel.length)
    })
  }

  function bulletLine() {
    const ta = ref.current
    if (!ta) return
    const s = ta.selectionStart
    const lineStart = text.lastIndexOf('\n', s - 1) + 1
    const next = text.slice(0, lineStart) + '- ' + text.slice(lineStart)
    update(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(s + 2, s + 2)
    })
  }

  return (
    <div className="notes-view">
      <header className="panel-head">
        <h1>Notes</h1>
        <p>Anything you want. Saved on this device. To make it permanent across devices, send it to me.</p>
      </header>

      <div className="nb-toolbar">
        <button onClick={() => wrap('**')} title="Bold"><strong>B</strong></button>
        <button onClick={bulletLine} title="Bullet">• List</button>
        <button onClick={() => navigator.clipboard?.writeText(text)} title="Copy" className="nb-copy">Copy</button>
      </div>

      <textarea
        ref={ref}
        className="nb-input"
        value={text}
        onChange={(e) => update(e.target.value)}
        spellCheck
        placeholder="Write trip notes here. Use **bold** and start a line with - for bullets."
      />

      <div className="nb-preview-label">Preview</div>
      <div className="nb-preview" dangerouslySetInnerHTML={{ __html: render(text) }} />
    </div>
  )
}
