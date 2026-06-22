# Italy 2026 — Trip Planner

A private, editable trip planner for the August 2026 Italy road trip. A self-hosted, one-to-one clone of the core Wanderlog planner, built so the trip survives an expiring subscription. You edit; everyone with the link views.

**Live:** https://off-plate.github.io/italy-trip-2026/

## What it does

Two-pane layout (left = planner, right = live map), matching Wanderlog:

- **Overview** — trip title, dates, travelers, summary, free-text notes, a wishlist of un-scheduled places, a budget summary, and reservations.
- **Itinerary** — day by day. Each stop is a card with a category color, note, scheduled time, and an optional per-place budget. Drive time and distance between consecutive stops are computed automatically. Drag to reorder; an "Add a place" search box geocodes and drops a pin.
- **Budget** — total spent, a set budget with a meter, the expense list, and a per-person split / who-owes-who.
- **Map** — numbered, category-colored markers, a route line per day, and a fly-to when you select a stop.

## Edit vs view

- The trip data lives in **Supabase** (single source of truth, no localStorage, nothing lost).
- **Viewers** open the link and get a clean read-only trip. No edit controls.
- **The owner** signs in (the "Edit" button, password) and gets inline editing everywhere: click a title/note/time/budget to change it, search to add stops, drag to reorder, add/edit/delete expenses. Writes are locked to the owner's account by row-level security, server-side, so a shared link can't be used to change anything.

## Stack

React + TypeScript + Vite, Leaflet + OpenStreetMap (free, no key), Photon for place search and OSRM for drive times (both free, no key), Supabase for data + auth. No paid APIs.

## Data

Tables are namespaced `italy_` in the shared Supabase project (`italy_trips`, `italy_days`, `italy_places`, `italy_expenses`, `italy_travelers`, `italy_reservations`). The trip is keyed by slug `italy-2026`.

## Develop

```bash
npm install
npm run dev      # local dev
npm run build    # builds to docs/ for GitHub Pages
```

Built to `docs/` and served by GitHub Pages at `/italy-trip-2026/`.

## Also here (reference, not the app)

- `locations.md` — the older plain-text master list (kept for history)
- `research/` — earlier route, fuel, stay and cost research
- `public/stays/` — source photos
