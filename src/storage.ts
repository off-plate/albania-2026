import { useEffect, useState } from 'react'

const PREFIX = 'italytrip26:'

export function usePersist<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      /* ignore quota errors */
    }
  }, [key, value])
  return [value, setValue] as const
}

export const FX = 25 // 1 EUR = 25 CZK
export const eur = (n: number) => '€' + Math.round(n).toLocaleString('en-US')
export const kc = (n: number) =>
  Math.round(n * FX).toLocaleString('cs-CZ').replace(/ /g, ' ') + ' Kč'
