import type { StopType } from './types'

// One place to define how each stop type looks + reads.
export const STOP: Record<StopType, { label: string; color: string }> = {
  classic: { label: 'Classic stop', color: '#E05140' },
  instagram: { label: 'Instagram stop', color: '#8B5CF6' },
  relaxed: { label: 'Relaxed stop', color: '#27AE60' },
  car: { label: 'Car stop', color: '#2D6CDF' },
  optional: { label: 'Optional', color: '#9A8C7B' },
  endpoint: { label: 'Start / End', color: '#2B2017' },
}
