# Italy 2026 — Trip Planner

A private planner for the Ligurian Riviera road trip (2 couples, August 2026). It holds the map, the day-by-day plan, the stays, and who-paid-what. No online suggestions, no auto-fill. It only ever shows what we actually decide.

**Live:** https://off-plate.github.io/italy-trip-2026/

## How it works

Everything on the site is rendered from one file: [`src/data/trip.ts`](src/data/trip.ts). That's the single source of truth.

Michael sends a place, a link, a price, a note. It gets written into `trip.ts`, committed, and the site redeploys. Data lives in git forever, so nothing is ever lost. Viewers (the other couple) just open the link.

Statuses are honest: `idea` → `shortlist` → `booked`. Nothing is invented.

## Sections

- **Map** — every place with coordinates, pins by category (Leaflet + OpenStreetMap)
- **Days** — the itinerary, built together as we decide it
- **Stays** — lodging candidates with photos, price, links
- **Money** — expenses with the split worked out per person against the ~20K Kč budget

## Develop

```bash
npm install
npm run dev      # local dev
npm run build    # builds to docs/ for GitHub Pages
```

Built to `docs/` and served by GitHub Pages at `/italy-trip-2026/`.

## Also here (reference, not the website)

- `locations.md` — the older plain-text master list (kept for history)
- `research/` — the team's earlier research (routes, fuel, stays, food, costs)
- `images/` — original source photos
