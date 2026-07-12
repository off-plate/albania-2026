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
  boat: 'Loď',
  sight: 'Památka',
  daytrip: 'Výlet',
  beach: 'Pláž',
}

export const TRAVEL_OPTIONS: TravelOption[] = [
  {
    name: 'Lodí na ostrůvky u Ksamilu',
    area: 'Ksamil',
    kind: 'boat',
    price: '≈ 125–250 Kč (€5–10)',
    note: 'Malé lodě tě odvezou na ostrůvky u Ksamilu. Krátké, levné, ideální na koupání.',
  },
  {
    name: 'Celodenní plavba, jeskyně + šnorchl',
    area: 'Ksamil / Saranda',
    kind: 'boat',
    price: '≈ 625–1 000 Kč (€25–40)',
    note: 'Celý den podél pobřeží: mořské jeskyně, šnorchlování, klidné zátoky. Obvykle se zastávkami na koupání.',
  },
  {
    name: 'Rychločlun Karaburun–Sazan',
    area: 'z Vlory',
    kind: 'boat',
    price: '≈ 750–1 250 Kč (€30–50)',
    note: 'Celodenní rychločlun na poloostrov Karaburun a ostrov Sazan, včetně jeskyně Haxhi Ali. Nejlepší lodní výlet, když bydlíš u Vlory.',
  },
  {
    name: 'Modré oko (Syri i Kaltër)',
    area: 'u Sarandy',
    kind: 'sight',
    price: '≈ 25–50 Kč (€1–2) vstup',
    note: 'Hluboký přírodní pramen, sytě modrá voda. Pohodové půldne z Ksamilu, kousek pěšky od parkoviště.',
  },
  {
    name: 'Národní park Butrint',
    area: '15 min z Ksamilu',
    kind: 'sight',
    price: '≈ 250 Kč (€10) vstup',
    note: 'UNESCO antické město: řecké a římské ruiny v klidné laguně. Jeď brzy, než začne vedro.',
  },
  {
    name: 'Gjirokastër, staré město + hrad',
    area: '~1 h ze Sarandy',
    kind: 'daytrip',
    price: '≈ 100 Kč (€4) hrad',
    note: 'UNESCO kamenné město s velkým hradem na kopci a výhledy. Celodenní, ale pohodový výlet do vnitrozemí.',
  },
  {
    name: 'Korfu na den trajektem',
    area: 'ze Sarandy',
    kind: 'daytrip',
    price: '≈ 475–625 Kč (€19–25) zpáteční',
    note: 'Rychlý trajekt na Korfu (Řecko) asi za 30 minut. Zábavný bonusový den v jiné zemi.',
  },
  {
    name: 'Lehátka + slunečník v Ksamilu',
    area: 'pláže Ksamil',
    kind: 'beach',
    price: '≈ 250–500 Kč (€10–20) set / den',
    note: 'Dvě lehátka a slunečník na den. Na nejrušnějších centrálních plážích ceny rostou.',
  },
]
