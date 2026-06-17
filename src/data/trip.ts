import type { Trip } from '../types'

// ─────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH
// Michael sends locations / notes / bookings; they get written in here.
// Nothing is invented. Everything has an honest status: idea / shortlist / booked.
// ─────────────────────────────────────────────────────────────────────────

export const trip: Trip = {
  title: 'Italy 2026',
  subtitle: 'Ligurian Riviera road trip',
  dates: 'August 2026',
  summary:
    'Two couples, one car, driving down from Prague. About a week on the ground: half sea and slow mornings, half photogenic viewpoints. No museums, no castles.',

  travelers: [
    { id: 'michael', name: 'Michael' },
    { id: 'gf', name: 'Girlfriend' },
    { id: 'friend1', name: 'Friend 1' },
    { id: 'friend2', name: 'Friend 2' },
  ],

  budgetPerPersonCZK: 20000,
  eurToCzk: 25, // rough working rate; update when we want exact numbers

  facts: [
    { label: 'Who', value: '2 couples · 4 people' },
    { label: 'Car', value: 'Volvo XC90, from Prague' },
    { label: 'On the ground', value: '~7 days + 2 driving days' },
    { label: 'Budget', value: '~20,000 Kč / person' },
    { label: 'Style', value: '50% sea · 50% viewpoints' },
    { label: 'Base', value: 'Still deciding (see Stays)' },
  ],

  // Centered on the Ligurian coast; Chianti candidate sits to the SE.
  mapCenter: [44.2, 9.45],
  mapZoom: 9,

  places: [
    // ── The one real candidate Michael sent ──
    {
      id: 'badia-passignano',
      name: 'Ciliegiolo — Badia a Passignano',
      category: 'stay',
      status: 'shortlist',
      coords: [43.5746, 11.2186],
      note: 'Airbnb in Chianti, Tuscany. Candidate for the longer base (6+ nights).',
      detail:
        'Rental apartment, sleeps 4 (2 bedrooms, 3 beds, 2 baths). Checked 27 Aug → 2 Sep 2026, 4 guests. Set in Chianti Classico vineyards near Tavarnelle. Florence ~40 min, Siena ~45 min, San Gimignano ~35 min. NOTE: this is inland, not coastal — nearest sea is ~1h30, Cinque Terre ~2h. Decide if the trip is shifting to Tuscany countryside or staying on the coast.',
      price: 'Not confirmed yet — paste the total Airbnb shows you for those dates',
      links: [
        { label: 'Airbnb listing', url: 'https://www.airbnb.com/rooms/1668821830585037471' },
        { label: 'Open in Maps', url: 'https://www.google.com/maps/search/?api=1&query=43.5746,11.2186' },
      ],
      photos: Array.from({ length: 14 }, (_, i) =>
        `stays/badia-passignano/photo-${String(i + 1).padStart(2, '0')}.jpg`,
      ),
    },

    // ── Coastal candidates from our own research (not online suggestions; our team's notes). ──
    // All marked 'idea' — nothing here is decided. Tell me to drop any.
    {
      id: 'levanto',
      name: 'Levanto',
      category: 'town',
      status: 'idea',
      coords: [44.1706, 9.6111],
      note: 'Research pick for Base 1 (2 nights). Own sandy beach, 4-min train to Cinque Terre, cheaper than the villages.',
    },
    {
      id: 'santa-margherita',
      name: 'Santa Margherita Ligure',
      category: 'town',
      status: 'idea',
      coords: [44.3354, 9.2107],
      note: 'Research pick for Base 2 (4–5 nights). Real town, parking, 5 min to Portofino, boats to San Fruttuoso.',
    },
    {
      id: 'cinque-terre',
      name: 'Cinque Terre',
      category: 'view',
      status: 'idea',
      coords: [44.1461, 9.6543],
      note: 'The five villages. Go early, by train. Monterosso has the only real beach.',
    },
    {
      id: 'portovenere',
      name: 'Portovenere',
      category: 'view',
      status: 'idea',
      coords: [44.0533, 9.8377],
      note: 'Colorful harbour, quieter than Cinque Terre. Pair with Tellaro.',
    },
    {
      id: 'sestri-levante',
      name: 'Sestri Levante — Baia del Silenzio',
      category: 'beach',
      status: 'idea',
      coords: [44.27, 9.392],
      note: 'The "Bay of Silence." 30 min north of Santa Margherita by car.',
    },
    {
      id: 'portofino',
      name: 'Portofino',
      category: 'view',
      status: 'idea',
      coords: [44.3035, 9.2097],
      note: 'The classic harbour. Day trip only — sleeping here is absurdly expensive.',
    },
    {
      id: 'san-fruttuoso',
      name: 'San Fruttuoso',
      category: 'beach',
      status: 'idea',
      coords: [44.316, 9.173],
      note: 'Abbey cove reachable only by boat or trail. Boats from Santa Margherita / Camogli.',
    },
    {
      id: 'camogli',
      name: 'Camogli',
      category: 'town',
      status: 'idea',
      coords: [44.3486, 9.155],
      note: 'Pastel fishing town, fewer tourists. Good for a relaxed evening.',
    },
  ],

  // No invented itinerary. The shape is here; we fill the days together.
  days: [
    {
      title: 'Day 1 — Drive: Prague → coast',
      base: 'TBD',
      stops: [{ label: 'Long driving day (~10h via Parma / A15).' }],
      note: 'Arrive, drop the car, first dinner. We add the real plan once the base is locked.',
    },
    {
      title: 'Days 2–8 — On the ground',
      base: 'TBD',
      stops: [{ label: 'To be built — sea days, viewpoint days, one slow day.' }],
      note: 'Send me what you want each day and I\'ll place it here with the map pins.',
    },
    {
      title: 'Last day — Drive home',
      base: '—',
      stops: [{ label: 'Drive back to Prague.' }],
    },
  ],

  // Nothing spent yet. Add real costs as they happen; the split is computed live.
  expenses: [],
}
