// Points of interest for the itinerary ("co vidět"). Coordinates put them on
// the map. Photos are hotlinked from Wikimedia Commons (freely licensed) where
// available; others fall back to a placeholder tile.

export type PoiCategory = 'beach' | 'view' | 'sight' | 'town' | 'activity'

export interface Poi {
  id: string
  name: string
  category: PoiCategory
  lat: number
  lng: number
  note: string
  photo?: string
  photoCredit?: string
  mapLink: string
  optional?: boolean
  priceCzk?: number // total for the group of 4
  bookLink?: string
  nearBase?: 'durres' | 'vlore' | 'sarande'
}

const gmap = (lat: number, lng: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

export const POI_COLOR: Record<PoiCategory, string> = {
  beach: '#2E8B6B',
  view: '#9C5BB0',
  sight: '#C8461E',
  town: '#2E6BB8',
  activity: '#D08C2E',
}
export const POI_LABEL: Record<PoiCategory, string> = {
  beach: 'Pláž',
  view: 'Výhled',
  sight: 'Památka',
  town: 'Město',
  activity: 'Aktivita',
}

// Overview framing for the itinerary map (whole country).
export const POI_CENTER: [number, number] = [40.75, 19.95]
export const POI_ZOOM = 7

export const POIS: Poi[] = [
  {
    id: 'dajti',
    nearBase: 'durres',
    name: 'Hora Dajti',
    category: 'view',
    lat: 41.3597,
    lng: 19.9236,
    note: 'Hora nad Tiranou, nahoru lanovkou Dajti Ekspres. Výhledy na město.',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Mali_i_Dajtit.jpg/330px-Mali_i_Dajtit.jpg',
    photoCredit: 'Wikimedia Commons',
    mapLink: gmap(41.3597, 19.9236),
  },
  {
    id: 'shkopet',
    nearBase: 'durres',
    name: 'Most Shkopet',
    category: 'view',
    lat: 41.66,
    lng: 19.87,
    note: 'Visutý most nad řekou Mat, sever Albánie. Poloha přibližná.',
    mapLink: gmap(41.66, 19.87),
  },
  {
    id: 'vlore-old',
    nearBase: 'vlore',
    name: 'Staré město Vlorë',
    category: 'town',
    lat: 40.4667,
    lng: 19.4897,
    note: 'Staré centrum Vlory a promenáda u moře.',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Promenade_of_Vlor%C3%AB_along_the_Adriatic_Sea.jpg/330px-Promenade_of_Vlor%C3%AB_along_the_Adriatic_Sea.jpg',
    photoCredit: 'Wikimedia Commons',
    mapLink: gmap(40.4667, 19.4897),
  },
  {
    id: 'llogara',
    nearBase: 'vlore',
    name: 'Průsmyk Llogara',
    category: 'view',
    lat: 40.2069,
    lng: 19.5953,
    note: 'Horský průsmyk s velkými výhledy na pobřeží.',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/ALB_20070718_img_1372.jpg/330px-ALB_20070718_img_1372.jpg',
    photoCredit: 'Wikimedia Commons',
    mapLink: gmap(40.2069, 19.5953),
  },
  {
    id: 'gjipe',
    nearBase: 'vlore',
    name: 'Pláž Gjipe',
    category: 'beach',
    lat: 40.1856,
    lng: 19.6433,
    note: 'Kaňonem lemovaná skrytá pláž mezi Dhërmi a Himarou.',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Canyon_de_Gjipe.jpeg/330px-Canyon_de_Gjipe.jpeg',
    photoCredit: 'Wikimedia Commons',
    mapLink: gmap(40.1856, 19.6433),
  },
  {
    id: 'filikuri',
    nearBase: 'vlore',
    name: 'Pláž Filikuri',
    category: 'beach',
    lat: 40.095,
    lng: 19.715,
    note: 'Malá skrytá pláž u Himary, nejlíp dostupná lodí. Poloha přibližná.',
    mapLink: gmap(40.095, 19.715),
  },
  {
    id: 'blue-eye',
    nearBase: 'sarande',
    name: 'Modré oko (Syri i Kaltër)',
    category: 'sight',
    lat: 39.9239,
    lng: 20.1894,
    note: 'Hluboký modrý přírodní pramen u Sarandy.',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Albania_Blue_Eye.jpg/330px-Albania_Blue_Eye.jpg',
    photoCredit: 'Wikimedia Commons',
    mapLink: gmap(39.9239, 20.1894),
  },
  {
    id: 'butrint',
    nearBase: 'sarande',
    name: 'Národní park Butrint',
    category: 'sight',
    lat: 39.7456,
    lng: 20.0203,
    note: 'UNESCO antické město v laguně, kousek od Ksamilu.',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Amphitheatre_of_Butrint_2009.jpg/330px-Amphitheatre_of_Butrint_2009.jpg',
    photoCredit: 'Wikimedia Commons',
    mapLink: gmap(39.7456, 20.0203),
  },
  {
    id: 'osumi-rafting',
    nearBase: 'sarande',
    name: 'Kaňony Osumi (packrafting)',
    category: 'activity',
    lat: 40.42,
    lng: 20.23,
    note: 'Packrafting v kaňonech Osumi (albrafting.org). Celodenní výlet do vnitrozemí.',
    optional: true,
    priceCzk: 6200,
    bookLink: 'https://www.albrafting.org/tour/exclusive-packrafting-osumi-canyons',
    mapLink: gmap(40.42, 20.23),
  },
]
