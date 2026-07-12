import type { StopType } from './types'

// The six (and only) category colors in the product. Per the design spec:
// classic = the accent; instagram warmed off forbidden indigo-violet;
// endpoint a warm near-black. These appear on 9–26px dots + map markers only.
export const STOP: Record<StopType, { label: string; color: string }> = {
  classic: { label: 'Klasická zastávka', color: '#C8461E' },
  instagram: { label: 'Vyhlídka', color: '#9C5BB0' },
  relaxed: { label: 'Základna', color: '#2E8B6B' },
  car: { label: 'Motorové muzeum', color: '#2E6BB8' },
  optional: { label: 'Když zbude čas', color: '#9A8C7B' },
  endpoint: { label: 'Přílet / odlet', color: '#3A2C1E' },
}

export const STOP_ORDER: StopType[] = [
  'classic',
  'instagram',
  'relaxed',
  'car',
  'optional',
  'endpoint',
]
