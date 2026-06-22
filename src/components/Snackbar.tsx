import { useEffect, useState } from 'react'

interface UndoEvent {
  label: string
  undo: () => void
}

// Listens for 'trip-undo' CustomEvents (fired on delete) and shows a 5s undo bar.
export default function Snackbar() {
  const [snack, setSnack] = useState<UndoEvent | null>(null)

  useEffect(() => {
    let timer: number | undefined
    const onUndo = (e: Event) => {
      const detail = (e as CustomEvent).detail as UndoEvent
      setSnack(detail)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setSnack(null), 5000)
    }
    window.addEventListener('trip-undo', onUndo)
    return () => {
      window.removeEventListener('trip-undo', onUndo)
      window.clearTimeout(timer)
    }
  }, [])

  if (!snack) return null
  return (
    <div className="snackbar">
      <span>{snack.label}</span>
      <button
        onClick={() => {
          snack.undo()
          setSnack(null)
        }}
      >
        Undo
      </button>
    </div>
  )
}
