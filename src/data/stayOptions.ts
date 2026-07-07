// Candidate stays for Albania/Montenegro 2026, curated by Michael.
// Prices are the totals Airbnb showed for the dates below (Airbnb loads prices
// client-side, so they're entered by hand, not scraped). Hero images are the
// listings' own preview photos, hotlinked (link-preview style), not rehosted.
// Once Michael picks one, promote it to the booked lodging in the DB.

export interface StayOption {
  id: string
  label: string // property type + town, e.g. "Apartment in Durrës"
  place: string // "Town, Country"
  beds: string // factual, e.g. "2 bedrooms · 3 beds"
  rating?: number
  nights: number
  dates: string
  totalCzk?: number // omit when the price is on request
  flightPerPersonCzk: number // flight that matches these dates
  image: string
  link: string
  favorite?: boolean
  note?: string
}

// Flights (round trip, Prague ↔ Tirana, 4 people)
export const FLIGHTS = {
  long: { perPersonCzk: 4800, dates: '14–23 Aug', link: 'https://www.skyscanner.cz/doprava/lety/prg/tira/260814/260823/config/15538-2608140600--31915-0-16911-2608140755%7C16911-2608231525--30596-0-15538-2608231730?adultsv2=4&cabinclass=economy&rtn=1' },
  short: { perPersonCzk: 3890, dates: '14–22 Aug', link: 'https://www.skyscanner.cz/transport/flights/prg/tira/260814/260822/config/15538-2608140600--31915-0-16911-2608140755%7C16911-2608221835--31915-0-15538-2608222035?adultsv2=4&cabinclass=economy&rtn=1' },
}

export const STAY_OPTIONS: StayOption[] = [
  {
    id: 's-sanpietro',
    label: 'Apartment in Plazhi San Pietro',
    place: 'San Pietro Beach, Albania',
    beds: '2 bedrooms · 3 beds · 1 bath',
    rating: 4.57,
    nights: 9,
    dates: '14–23 Aug 2026',
    totalCzk: 37705,
    flightPerPersonCzk: 4800,
    image: 'https://a0.muscache.com/im/pictures/miso/Hosting-1213765894851725573/original/312a1f46-8ece-4bd1-9c99-87814f28bc3f.jpeg?im_w=720',
    link: 'https://www.airbnb.com/rooms/1213765894851725573?check_in=2026-08-14&check_out=2026-08-23&adults=4',
    favorite: true,
    note: 'Your pick. 2 bedrooms, garden, beach resort.',
  },
  {
    id: 's-durres-beachfront',
    label: 'Beachfront apartment in Durrës',
    place: 'Durrës, Albania',
    beds: '2 bedrooms · 2 beds · 1 bath',
    rating: 4.85,
    nights: 8,
    dates: '14–22 Aug 2026',
    totalCzk: 33594,
    flightPerPersonCzk: 3890,
    image: 'https://a0.muscache.com/im/pictures/11f0cfa3-a591-4a5b-9a7c-22ee0ebb2adc.jpg?im_w=720',
    link: 'https://www.airbnb.com/rooms/50289628?check_in=2026-08-14&check_out=2026-08-22&adults=4',
    favorite: true,
    note: 'Your pick. One night shorter, but stunning and right on the beach.',
  },
  {
    id: 's-kruce',
    label: 'Home in Kruče',
    place: 'Kruče, Montenegro',
    beds: '1 bedroom · 1 bed · 1 bath',
    rating: 4.97,
    nights: 9,
    dates: '14–23 Aug 2026',
    totalCzk: 39601,
    flightPerPersonCzk: 4800,
    image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1158880615909374137/original/80ccc00c-fc86-4071-9f5a-a69a2a2b5756.jpeg?im_w=720',
    link: 'https://www.airbnb.com/rooms/1158880615909374137?check_in=2026-08-14&check_out=2026-08-23&adults=4',
    note: 'Montenegro option. Only 1 bedroom, tight for two couples.',
  },
  {
    id: 's-durres-resort',
    label: 'Residence by the beach, Durrës',
    place: 'Durrës, Albania',
    beds: '1 bedroom · 3 beds · 1 bath',
    rating: 4.8,
    nights: 9,
    dates: '14–23 Aug 2026',
    totalCzk: 34609,
    flightPerPersonCzk: 4800,
    image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQ0MjU1MDkyNjA2MDg4MjI1OQ==/original/60a13f8a-a8af-41ea-a227-ca7819429854.jpeg?im_w=720',
    link: 'https://www.airbnb.com/rooms/1442550926060882259?check_in=2026-08-14&check_out=2026-08-23&adults=4',
    note: 'Resort by the beach. 1 bedroom, 3 beds.',
  },
  {
    id: 's-ulcinj',
    label: 'Tree house cabin, Ulcinj',
    place: 'Ulcinj, Montenegro',
    beds: '1 bedroom · 1 bed · 1 bath',
    rating: 5.0,
    nights: 9,
    dates: '14–23 Aug 2026',
    totalCzk: 33230,
    flightPerPersonCzk: 4800,
    image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQzOTY1OTA0OTg0MzA4MzgwNg==/original/e9fd76fe-f46e-44b2-bf6c-340927fee0f9.jpeg?im_w=720',
    link: 'https://www.airbnb.com/rooms/1467567411049722953?check_in=2026-08-14&check_out=2026-08-23&adults=4',
    note: 'Montenegro cabin, top rated. Only 1 bedroom.',
  },
  {
    id: 's-vila-kristiano',
    label: 'Vila Kristiano',
    place: 'Ksamil, Albania',
    beds: 'Apartments / rooms (ask about layout for 4)',
    nights: 9,
    dates: '14–23 Aug 2026',
    flightPerPersonCzk: 4800,
    image: 'https://vila-kristiano.al/img/deluxe-ap1-1.jpg',
    link: 'https://vila-kristiano.al/index.html',
    note: 'Price on request. Right in Ksamil, the swim-to-islands spot.',
  },
  {
    id: 's-tale',
    label: 'Rental unit in Tale',
    place: 'Tale, Albania',
    beds: '1 bedroom · 3 beds · 1 bath',
    rating: 5.0,
    nights: 9,
    dates: '14–23 Aug 2026',
    totalCzk: 25616,
    flightPerPersonCzk: 4800,
    image: 'https://a0.muscache.com/im/pictures/miso/Hosting-1420791314326537498/original/4e254031-244f-466f-807d-9c5dbda03769.jpeg?im_w=720',
    link: 'https://www.airbnb.com/rooms/1420791314326537498?check_in=2026-08-14&check_out=2026-08-23&adults=4',
    note: 'Cheapest option. 1 bedroom, 3 beds.',
  },
]
