// Things to do around Ksamil / Saranda / the Albanian Riviera.
// Curated + written here (not scraped). Prices are approximate, per person,
// pay in cash on site; treat as a guide, not a quote. €→Kč ~25.

export type TravelKind = 'boat' | 'sight' | 'daytrip' | 'beach'

export interface TravelOption {
  name: string
  area: string
  kind: TravelKind
  price: string // approx, per person
  note: string
}

export const TRAVEL_KIND_LABEL: Record<TravelKind, string> = {
  boat: 'Boat',
  sight: 'Sight',
  daytrip: 'Day trip',
  beach: 'Beach',
}

export const TRAVEL_OPTIONS: TravelOption[] = [
  {
    name: 'Ksamil islands boat hop',
    area: 'Ksamil',
    kind: 'boat',
    price: '≈ 125–250 Kč (€5–10)',
    note: 'Small boats shuttle you to the little Ksamil islands. Short, cheap, good for a swim.',
  },
  {
    name: 'Full-day boat tour, caves + snorkel',
    area: 'Ksamil / Saranda',
    kind: 'boat',
    price: '≈ 625–1 000 Kč (€25–40)',
    note: 'Day out along the coast: sea caves, snorkel stops, quiet coves. Usually includes stops for swimming.',
  },
  {
    name: 'Karaburun–Sazan speedboat day',
    area: 'from Vlorë',
    kind: 'boat',
    price: '≈ 750–1 250 Kč (€30–50)',
    note: 'Full-day speedboat to the Karaburun peninsula and Sazan island, with the Haxhi Ali cave. The best boat day if you base near Vlorë.',
  },
  {
    name: 'Blue Eye (Syri i Kaltër)',
    area: 'near Saranda',
    kind: 'sight',
    price: '≈ 25–50 Kč (€1–2) vstup',
    note: 'Deep natural spring, intense blue water. Easy half-day from Ksamil, short walk from the car park.',
  },
  {
    name: 'Butrint National Park',
    area: '15 min from Ksamil',
    kind: 'sight',
    price: '≈ 250 Kč (€10) vstup',
    note: 'UNESCO ancient city: Greek and Roman ruins in a quiet lagoon. Go early, before the heat.',
  },
  {
    name: 'Gjirokastër, old town + castle',
    area: '~1 h from Saranda',
    kind: 'daytrip',
    price: '≈ 100 Kč (€4) hrad',
    note: 'UNESCO stone town with a big hilltop castle and views. A full but easy day trip inland.',
  },
  {
    name: 'Corfu day trip by ferry',
    area: 'from Saranda',
    kind: 'daytrip',
    price: '≈ 475–625 Kč (€19–25) zpáteční',
    note: 'Fast ferry to Corfu (Greece) in about 30 min. Fun bonus day in another country.',
  },
  {
    name: 'Ksamil sunbeds + umbrella',
    area: 'Ksamil beaches',
    kind: 'beach',
    price: '≈ 250–500 Kč (€10–20) set / den',
    note: 'Two loungers and a parasol for the day. Prices climb on the busiest central beaches.',
  },
]
