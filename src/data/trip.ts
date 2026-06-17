import type { Trip } from '../types'

// ── SINGLE SOURCE OF TRUTH ─────────────────────────────────────────────────
// Pulled from the shared trip, then maintained here. Add / edit places,
// reservations and expenses in this file; the whole app renders from it.
// Blurbs are written here (not scraped). Statuses honest.

export const trip: Trip = {
  title: 'Trip to Italy',
  dateRange: 'August 21–30, 2026',
  summary:
    'Road trip from Prague: Lake Garda, Verona, the motor valley (Ferrari, Lamborghini), Florence, Chianti and the Tuscan hill towns, then the coast, Lucca and Pisa on the way home.',

  travelers: [
    { id: 'michael', name: 'Michael', initials: 'M' },
    { id: 'gf', name: 'Girlfriend', initials: 'G' },
    { id: 'f1', name: 'Friend 1', initials: 'F1' },
    { id: 'f2', name: 'Friend 2', initials: 'F2' },
  ],

  eurToCzk: 24.14, // matches the planner's CZK total
  budgetPerPersonCZK: 20000,

  notes:
    'Two couples, one car (Volvo XC90), driving down from Prague. Mix of car museums, lake + city days and slow Tuscany. Chianti is the long base. Fill in dinners and timings as we lock them.',

  mapCenter: [44.6, 11.0],
  mapZoom: 7,

  reservations: [
    {
      id: 'badia',
      kind: 'lodging',
      title: 'Ciliegiolo, Badia a Passignano (Airbnb)',
      detail:
        'Chianti base. Apartment, sleeps 4 (2 bed, 3 beds, 2 bath), in the vineyards near Tavarnelle. Florence ~40 min, Siena ~45 min.',
      dates: '27 Aug → 2 Sep 2026 · 4 guests',
      price: 'Price not confirmed yet. Paste the Airbnb total and I\'ll log it.',
      link: 'https://www.airbnb.com/rooms/1668821830585037471',
      photos: Array.from({ length: 14 }, (_, i) =>
        `stays/badia-passignano/photo-${String(i + 1).padStart(2, '0')}.jpg`,
      ),
    },
  ],

  // From the planner screenshots. All paid by Michael so far.
  expenses: [
    {
      id: 'e-fuel',
      label: 'Fuel: Prague → Garda → Modena → Florence → Chianti',
      amount: 452,
      currency: 'EUR',
      category: 'gas',
      paidBy: 'michael',
      date: 'Jun 16',
    },
    {
      id: 'e-tolls',
      label: 'Highway tolls, full road trip (Italy + buffer)',
      amount: 95,
      currency: 'EUR',
      category: 'car',
      paidBy: 'michael',
      date: 'Jun 16',
    },
    {
      id: 'e-vignette',
      label: 'Austria vignette for the road trip',
      amount: 12.8,
      currency: 'EUR',
      category: 'car',
      paidBy: 'michael',
      date: 'Jun 16',
    },
  ],

  sections: [
    {
      id: 'route',
      title: 'Trip · August 21–30',
      places: [
        { id: 'ferrari-maranello', n: 1, name: 'Museo Ferrari Maranello', type: 'car',
          blurb: 'Car museum stop, near Modena.', coords: [44.5318, 10.8642],
          about: 'The Maranello museum: Ferrari road and race cars, plus a driving simulator. Pair with the motor-valley day.' },
        { id: 'lake-garda', n: 2, name: 'Lake Garda', type: 'classic',
          blurb: 'Lake arrival and scenic base.', coords: [45.65, 10.6833],
          about: 'Italy\'s largest lake, ringed by towns. Boat rides, swimming and easy walks.' },
        { id: 'peschiera', n: 3, name: 'Peschiera del Garda', type: 'instagram',
          blurb: 'Pretty lake-town base near Garda.', coords: [45.4392, 10.6889] },
        { id: 'bardolino', n: 4, name: 'Bardolino', type: 'instagram',
          blurb: 'Lakeside atmosphere and photo-friendly streets.', coords: [45.5494, 10.7206] },
        { id: 'sirmione', n: 5, name: 'Sirmione', type: 'instagram',
          blurb: 'Castle, harbour views, the most photogenic Garda town.', coords: [45.4969, 10.6058] },
        { id: 'castello-sirmione', n: 6, name: 'Castello Scaligero di Sirmione', type: 'instagram',
          blurb: 'Iconic moated castle by the lake.', coords: [45.4944, 10.6075] },
        { id: 'grotte-catullo', n: 7, name: 'Grotte di Catullo', type: 'instagram',
          blurb: 'Roman ruins at the tip of the peninsula.', coords: [45.5083, 10.6044] },
        { id: 'verona', n: 8, name: 'Verona', type: 'classic',
          blurb: 'Historic centre, great for dinner and an evening out.', coords: [45.4384, 10.9916] },
        { id: 'piazza-erbe', n: 9, name: 'Piazza delle Erbe', type: 'classic',
          blurb: 'Verona\'s central square.', coords: [45.443, 10.9978] },
        { id: 'arena-verona', n: 10, name: 'Arena di Verona', type: 'classic',
          blurb: 'Roman amphitheatre and city landmark.', coords: [45.439, 10.9947] },
        { id: 'ponte-pietra', n: 11, name: 'Ponte Pietra', type: 'instagram',
          blurb: 'Romantic bridge photo spot.', coords: [45.447, 10.999] },
        { id: 'castel-san-pietro', n: 12, name: 'Castel San Pietro', type: 'instagram',
          blurb: 'Viewpoint over Verona.', coords: [45.448, 11.001] },
        { id: 'modena', n: 13, name: 'Modena', type: 'car',
          blurb: 'Base for the Ferrari / motor-valley day.', coords: [44.6471, 10.9252] },
        { id: 'enzo-ferrari', n: 14, name: 'Museo Enzo Ferrari (Modena)', type: 'car',
          blurb: 'The second Ferrari museum, in Modena itself.', coords: [44.6516, 10.9265] },
        { id: 'lamborghini', n: 15, name: 'Lamborghini Museum', type: 'car',
          blurb: 'Optional second motor-valley museum.', coords: [44.664, 11.13] },
        { id: 'florence', n: 16, name: 'Florence', type: 'classic',
          blurb: 'Main Tuscany city and one of the bases.', coords: [43.7696, 11.2558] },
        { id: 'duomo-firenze', n: 17, name: 'Cathedral of Santa Maria del Fiore', type: 'classic',
          blurb: 'Florence cathedral and Duomo area.', coords: [43.7731, 11.256] },
        { id: 'uffizi', n: 18, name: 'Uffizi Galleries', type: 'classic',
          blurb: 'The famous museum, if you want one.', coords: [43.7678, 11.2553] },
        { id: 'ponte-vecchio', n: 19, name: 'Ponte Vecchio', type: 'instagram',
          blurb: 'Iconic bridge in Florence.', coords: [43.768, 11.2531] },
        { id: 'piazzale-michelangelo', n: 20, name: 'Piazzale Michelangelo', type: 'instagram',
          blurb: 'Best sunset viewpoint in Florence.', coords: [43.7629, 11.265] },
        { id: 'piazza-signoria', n: 21, name: 'Piazza della Signoria', type: 'classic',
          blurb: 'Central Florence square.', coords: [43.7696, 11.2558] },
        { id: 'palazzo-vecchio', n: 22, name: 'Palazzo Vecchio', type: 'classic',
          blurb: 'Florence civic landmark.', coords: [43.7693, 11.2562] },
        { id: 'greve', n: 23, name: 'Greve in Chianti', type: 'relaxed',
          blurb: 'Wine-country base in Chianti.', coords: [43.5836, 11.3158] },
        { id: 'radda', n: 24, name: 'Radda in Chianti', type: 'relaxed',
          blurb: 'Hill town and wine base in Chianti.', coords: [43.4849, 11.376] },
        { id: 'chianti-taxi', n: 25, name: 'Chianti Taxi NCC', type: 'relaxed',
          blurb: 'Wine-region transfer service if we want to drink.' },
        { id: 'siena', n: 26, name: 'Siena', type: 'classic',
          blurb: 'Major Tuscan city.', coords: [43.3188, 11.3308] },
        { id: 'san-gimignano', n: 27, name: 'San Gimignano', type: 'instagram',
          blurb: 'Medieval hill town with towers.', coords: [43.4677, 11.0431] },
        { id: 'palazzo-comunale-sg', n: 28, name: 'Palazzo Comunale, Torre Grossa', type: 'classic',
          blurb: 'Tower and museum area in San Gimignano.', coords: [43.4677, 11.0436] },
        { id: 'piazza-campo', n: 29, name: 'Piazza del Campo', type: 'instagram',
          blurb: 'Siena\'s main square, home of the Palio.', coords: [43.3186, 11.332] },
        { id: 'castiglione', n: 30, name: 'Castiglione della Pescaia', type: 'relaxed',
          blurb: 'Beach and sea-swim base on the Tuscan coast.', coords: [42.7639, 10.8769] },
        { id: 'lucca', n: 31, name: 'Lucca', type: 'relaxed',
          blurb: 'Walled city for a slower night.', coords: [43.843, 10.5027] },
        { id: 'pisa', n: 32, name: 'Pisa', type: 'classic',
          blurb: 'Iconic Pisa visit.', coords: [43.7228, 10.3966] },
        { id: 'piazza-miracoli', n: 33, name: 'Piazza dei Miracoli', type: 'instagram',
          blurb: 'The square with the Pisa monuments.', coords: [43.723, 10.3966] },
        { id: 'tower-pisa', n: 34, name: 'Tower of Pisa', type: 'instagram',
          blurb: 'The famous leaning-tower photo.', coords: [43.7230, 10.3965] },
        { id: 'innsbruck', n: 35, name: 'Innsbruck', type: 'optional',
          blurb: 'Optional mountain stop on the way back.', coords: [47.2692, 11.4041] },
        { id: 'prague', n: 36, name: 'Prague', type: 'endpoint',
          blurb: 'Start and end of the road trip.', coords: [50.0755, 14.4378] },
      ],
    },
  ],
}
