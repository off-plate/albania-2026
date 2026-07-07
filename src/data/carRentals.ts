// Car rental options near Tirana airport, curated by Michael (notes in Czech).
// Ratings + review counts are his research. No prices per company (pay on site);
// whole-trip cost estimate below.

export interface CarRental {
  name: string
  rating: number
  reviews: number
  note: string
  top?: boolean // highlight
}

// Odhad ceny za auto na celý výlet.
export const CAR_TRIP_COST = '≈ 5 000–8 000 Kč za celý výlet'

export const CAR_RENTALS: CarRental[] = [
  {
    name: 'RentFromLocals.al',
    rating: 4.8,
    reviews: 3987,
    top: true,
    note: 'Zdaleka nejvíc recenzí ze všech, přímo na letišti. Komunikace přes WhatsApp, platba na místě. Jedna recenze zmiňovala ~5 € poplatek za platbu kartou, měj radši eura v hotovosti.',
  },
  {
    name: 'Karruka Rent a Car Rinas',
    rating: 4.9,
    reviews: 1447,
    note: 'Hned vedle letiště, dojdeš tam pěšky i se zavazadly. Chválí rychlost, žádné skryté poplatky, dětské sedačky na počkání.',
  },
  {
    name: 'TIA Rental',
    rating: 4.9,
    reviews: 999,
    note: 'Krátká chůze od terminálu, mají i video-navigaci, jak je najít. Bezdepozitní, berou i hotovost.',
  },
  {
    name: 'Rent a Car Tirana Airport (Ergis)',
    rating: 5.0,
    reviews: 476,
    note: 'Majitel Ergis/Gisi vychválený do nebes, přiveze auto i do Tirany, plné pojištění bez depozitu.',
  },
  {
    name: 'Capital Car Rental',
    rating: 4.9,
    reviews: 452,
    note: 'Skoro nová auta, jeden host zmiňoval i cestu do Černé Hory.',
  },
  {
    name: 'Air Rental (Rinas)',
    rating: 4.9,
    reviews: 439,
    note: 'Solidní záložní volba.',
  },
  {
    name: 'Perfect Rent',
    rating: 5.0,
    reviews: 389,
    note: 'Solidní záložní volba.',
  },
]
