import { useEffect, useId, useRef, useState } from 'react'

// Click-to-edit primitives. One coherent pattern app-wide (per the design spec):
// resting state reads as plain text; click turns it into an input in place;
// Enter/blur commits, Esc cancels. When not editable, renders plain text.

interface TextProps {
  value: string
  onCommit: (v: string) => void
  editable: boolean
  className?: string
  placeholder?: string
  multiline?: boolean
  as?: 'span' | 'div' | 'h1' | 'h3'
}

export function InlineText({
  value,
  onCommit,
  editable,
  className,
  placeholder,
  multiline,
  as = 'span',
}: TextProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null)

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus()
      ref.current.select?.()
    }
  }, [editing])

  if (!editable) {
    const Tag = as as any
    if (!value && placeholder) return <Tag className={className} style={{ opacity: 0.5 }}>{placeholder}</Tag>
    return <Tag className={className}>{value}</Tag>
  }

  if (!editing) {
    const Tag = as as any
    return (
      <Tag
        className={`${className ?? ''} editable`}
        title="Click to edit"
        onClick={(e: any) => {
          e.stopPropagation()
          setDraft(value)
          setEditing(true)
        }}
      >
        {value || <span className="placeholder">{placeholder ?? 'Add text'}</span>}
      </Tag>
    )
  }

  const commit = () => {
    setEditing(false)
    if (draft !== value) onCommit(draft)
  }
  const cancel = () => {
    setEditing(false)
    setDraft(value)
  }

  if (multiline) {
    return (
      <textarea
        ref={ref as any}
        className={`inline-input ${className ?? ''}`}
        value={draft}
        rows={3}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Escape') cancel()
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commit()
        }}
      />
    )
  }
  return (
    <input
      ref={ref as any}
      className={`inline-input ${className ?? ''}`}
      value={draft}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Escape') cancel()
        if (e.key === 'Enter') commit()
      }}
    />
  )
}

interface NumProps {
  value: number | null
  onCommit: (v: number | null) => void
  prefix?: string
  placeholder?: string
}

/** A small "click to set / clear" numeric chip used for budgets. */
export function InlineNumberChip({ value, onCommit, prefix = 'CZK', placeholder = 'Set budget' }: NumProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value?.toString() ?? '')
  const ref = useRef<HTMLInputElement>(null)
  const id = useId()

  useEffect(() => {
    if (editing) ref.current?.focus()
  }, [editing])

  if (!editing) {
    return (
      <button
        className={value != null ? 'chip chip-budget' : 'chip chip-ghost'}
        onClick={(e) => {
          e.stopPropagation()
          setDraft(value?.toString() ?? '')
          setEditing(true)
        }}
      >
        {value != null ? `${prefix} ${value.toLocaleString('en-US')}` : `+ ${placeholder}`}
      </button>
    )
  }

  const commit = () => {
    setEditing(false)
    const n = draft.trim() === '' ? null : Number(draft.replace(/[^\d.]/g, ''))
    onCommit(Number.isFinite(n as number) ? (n as number) : null)
  }

  return (
    <span className="chip chip-budget-edit" onClick={(e) => e.stopPropagation()}>
      <label htmlFor={id} className="chip-prefix">
        {prefix}
      </label>
      <input
        id={id}
        ref={ref}
        inputMode="decimal"
        className="chip-num-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') {
            setEditing(false)
            setDraft(value?.toString() ?? '')
          }
        }}
      />
    </span>
  )
}
