export type StopType =
  | 'drive' | 'sight' | 'beach' | 'food' | 'town' | 'fuel' | 'sleep' | 'custom'

export interface Stop {
  id: string
  name: string
  type: StopType
  lat: number
  lng: number
  note?: string
  optional?: boolean
}

export interface Day {
  id: string
  n: number
  dow: string
  title: string
  tag: string
  rest?: boolean
  base?: string
  stops: Stop[]
}

export type PackageId = 'saver' | 'balanced' | 'comfort'

export interface PackageDef {
  id: PackageId
  name: string
  emoji: string
  blurb: string
  driveStyle: string
  accomTotal: number      // EUR, whole stay, group of 4
  foodPerDayPP: number    // EUR per person per day
  activitiesTotal: number // EUR group
  parkingTotal: number    // EUR group
  innsbruckNights: number
  innsbruckCost: number   // EUR group
  stayNote: string
}

export interface Expense {
  id: string
  desc: string
  amount: number      // EUR
  paidBy: string      // traveler name
  splitAmong: string[]
  day?: number
  category: string
  planned?: boolean
}
