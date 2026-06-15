import type { Day, PackageDef } from './types'

export const FUEL_ROUND_TRIP = 332 // EUR
export const TOLLS = 118 // EUR
export const TRAVELLERS_DEFAULT = ['Michael', 'Partner', 'Friend 1', 'Friend 2']
export const TRIP_DAYS = 10

export const PACKAGES: PackageDef[] = [
  {
    id: 'saver',
    name: 'Saver',
    emoji: '🟢',
    blurb: 'Your ~20K target. Budget apartments, self-cater, free beaches.',
    driveStyle: 'One-push drives (no overnight)',
    accomTotal: 1380,
    foodPerDayPP: 22,
    activitiesTotal: 300,
    parkingTotal: 80,
    innsbruckNights: 0,
    innsbruckCost: 0,
    stayNote: 'Levanto budget apt + Chiavari budget apt, kitchen, ≤15 min from beach',
  },
  {
    id: 'balanced',
    name: 'Balanced',
    emoji: '🔵',
    blurb: 'Nicer apartments, mix of cooking and eating out, a few extras.',
    driveStyle: 'One-push drives, nicer apartments',
    accomTotal: 1900,
    foodPerDayPP: 40,
    activitiesTotal: 450,
    parkingTotal: 120,
    innsbruckNights: 0,
    innsbruckCost: 0,
    stayNote: 'Mid apartments/B&B, one with a pool option',
  },
  {
    id: 'comfort',
    name: 'Comfort',
    emoji: '🟣',
    blurb: 'Overnight stops, villa with pool, eat out freely.',
    driveStyle: 'Overnight in Innsbruck each way',
    accomTotal: 3200,
    foodPerDayPP: 65,
    activitiesTotal: 700,
    parkingTotal: 120,
    innsbruckNights: 2,
    innsbruckCost: 460,
    stayNote: 'Agriturismo + private villa with pool',
  },
]

// All coordinates are real (lat, lng). Routes are driven by car unless noted.
export const DAYS: Day[] = [
  {
    id: 'd1', n: 1, dow: 'Sat', title: 'Prague → Levanto', tag: 'Drive · ~950 km, one push',
    base: 'Levanto',
    stops: [
      { id: 's-prague', name: 'Prague (depart ~06:00)', type: 'drive', lat: 50.0755, lng: 14.4378 },
      { id: 's-ansfelden', name: 'Ansfelden (AT) — fuel + lunch', type: 'fuel', lat: 48.2086, lng: 14.2861 },
      { id: 's-brenner1', name: 'Brenner Pass — into Italy', type: 'drive', lat: 47.0027, lng: 11.5065 },
      { id: 's-levanto1', name: 'Levanto — arrive evening, check in', type: 'sleep', lat: 44.1699, lng: 9.6116 },
    ],
  },
  {
    id: 'd2', n: 2, dow: 'Sun', title: 'Cinque Terre', tag: 'Train day from Levanto',
    base: 'Levanto',
    stops: [
      { id: 's-levanto2', name: 'Levanto station (board before 09:00)', type: 'town', lat: 44.1699, lng: 9.6116 },
      { id: 's-monterosso', name: 'Monterosso al Mare — sandy beach', type: 'beach', lat: 44.1461, lng: 9.6543 },
      { id: 's-vernazza', name: 'Vernazza — harbour viewpoint + lunch', type: 'sight', lat: 44.1349, lng: 9.6843 },
      { id: 's-manarola', name: 'Manarola — the postcard viewpoint', type: 'sight', lat: 44.1070, lng: 9.7287 },
      { id: 's-riomaggiore', name: 'Riomaggiore — fried-seafood cone, sunset', type: 'food', lat: 44.0997, lng: 9.7378 },
    ],
  },
  {
    id: 'd3', n: 3, dow: 'Mon', title: 'Portovenere & white cliffs', tag: 'Car day south of Levanto',
    base: 'Levanto',
    stops: [
      { id: 's-levanto3', name: 'Levanto', type: 'town', lat: 44.1699, lng: 9.6116 },
      { id: 's-portovenere', name: 'Portovenere — church on the rock', type: 'sight', lat: 44.0510, lng: 9.8389 },
      { id: 's-tellaro', name: 'Tellaro — village on the rocks', type: 'sight', lat: 44.0719, lng: 9.8839 },
      { id: 's-puntabianca', name: 'Punta Bianca — white cliffs (short hike)', type: 'beach', lat: 44.0440, lng: 9.9200 },
    ],
  },
  {
    id: 'd4', n: 4, dow: 'Tue', title: 'Transfer to Chiavari', tag: 'Drive · ~45 min north',
    base: 'Chiavari',
    stops: [
      { id: 's-levanto4', name: 'Levanto — checkout', type: 'town', lat: 44.1699, lng: 9.6116 },
      { id: 's-sestri-stop', name: 'Sestri Levante — photo stop', type: 'sight', lat: 44.2716, lng: 9.3938, optional: true },
      { id: 's-chiavari1', name: 'Chiavari — check in, own beach', type: 'sleep', lat: 44.3169, lng: 9.3214 },
    ],
  },
  {
    id: 'd5', n: 5, dow: 'Wed', title: 'Portofino', tag: 'By car — ~25 min, NOT ferry',
    base: 'Chiavari',
    stops: [
      { id: 's-chiavari5', name: 'Chiavari (drive, park in S. Margherita)', type: 'drive', lat: 44.3169, lng: 9.3214 },
      { id: 's-smarg', name: 'Santa Margherita Ligure — park here', type: 'town', lat: 44.3353, lng: 9.2106 },
      { id: 's-portofino', name: 'Portofino — the iconic piazzetta', type: 'sight', lat: 44.3036, lng: 9.2099 },
      { id: 's-faro', name: 'Faro di Portofino — lighthouse walk', type: 'sight', lat: 44.2967, lng: 9.2186 },
    ],
  },
  {
    id: 'd6', n: 6, dow: 'Thu', title: 'Camogli', tag: 'By car — ~35 min',
    base: 'Chiavari',
    stops: [
      { id: 's-chiavari6', name: 'Chiavari', type: 'drive', lat: 44.3169, lng: 9.3214 },
      { id: 's-camogli', name: 'Camogli — pastel harbour, focaccia di Recco', type: 'town', lat: 44.3489, lng: 9.1547 },
      { id: 's-sanfruttuoso', name: 'San Fruttuoso — abbey cove (only by short boat/hike)', type: 'sight', lat: 44.3158, lng: 9.1736, optional: true },
    ],
  },
  {
    id: 'd7', n: 7, dow: 'Fri', title: 'Sestri Levante', tag: 'By car — ~15 min',
    base: 'Chiavari',
    stops: [
      { id: 's-chiavari7', name: 'Chiavari', type: 'drive', lat: 44.3169, lng: 9.3214 },
      { id: 's-sestri', name: 'Sestri Levante — cheap set lunch', type: 'town', lat: 44.2716, lng: 9.3938 },
      { id: 's-baia', name: 'Baia del Silenzio — free crescent beach, sunset', type: 'beach', lat: 44.2700, lng: 9.3970 },
    ],
  },
  {
    id: 'd8', n: 8, dow: 'Sat', title: 'Beach & rest', tag: 'No trip — relax', rest: true,
    base: 'Chiavari',
    stops: [
      { id: 's-chiavari-beach', name: 'Chiavari beach — long free sand', type: 'beach', lat: 44.3150, lng: 9.3290 },
      { id: 's-lavagna', name: 'Lavagna — more beach, gelato', type: 'beach', lat: 44.3076, lng: 9.3458, optional: true },
    ],
  },
  {
    id: 'd9', n: 9, dow: 'Sun', title: 'Flex day', tag: 'Your choice — or another rest day', rest: true,
    base: 'Chiavari',
    stops: [
      { id: 's-chiavari9', name: 'Chiavari', type: 'town', lat: 44.3169, lng: 9.3214 },
      { id: 's-genova', name: 'Genoa — big city day (aquarium, old port)', type: 'town', lat: 44.4056, lng: 8.9463, optional: true },
    ],
  },
  {
    id: 'd10', n: 10, dow: 'Mon', title: 'Chiavari → Prague', tag: 'Drive · ~1,000 km, one push',
    stops: [
      { id: 's-chiavari10', name: 'Chiavari — last swim, leave early', type: 'drive', lat: 44.3169, lng: 9.3214 },
      { id: 's-campogalliano', name: 'Campogalliano (IT) — refuel', type: 'fuel', lat: 44.6833, lng: 10.8833 },
      { id: 's-brenner2', name: 'Brenner → Innsbruck — lunch', type: 'drive', lat: 47.2692, lng: 11.4041 },
      { id: 's-prague2', name: 'Prague — home late evening', type: 'drive', lat: 50.0755, lng: 14.4378 },
    ],
  },
]

// Optional extra places the planner can suggest (shown in "add a place")
export const SUGGESTIONS = [
  { name: 'Carrara marble quarries', lat: 44.0830, lng: 10.1300 },
  { name: 'Rapallo', lat: 44.3505, lng: 9.2300 },
  { name: 'Corniglia', lat: 44.1192, lng: 9.7095 },
]
