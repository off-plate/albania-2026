# Italy 2026 — Trip Planner

**WHAT:** A private web planner for the Ligurian Riviera road trip. Map, day-by-day itinerary, stays, expense split.
**WHO:** Michael + girlfriend + one more couple (4 people). Read-only for viewers; Michael's the editor (via me).
**WHY:** One living, shareable home for trip info, developed together over time. Replaces scattered notes.
**MUST:** All trip data lives in `src/data/trip.ts` (single source of truth, committed to git = never lost). No online/auto suggestions — only what Michael actually sends. Honest statuses: idea/shortlist/booked. Anti-slop design (see below). Build to `docs/`, base `/italy-trip-2026/`.
**DONE:** `npm run build` clean, photos load at the base path, pushed, GitHub Pages live.
**ASK:** Before changing the data model in `types.ts`, before adding any backend/login, before pre-filling an itinerary with anything not confirmed.

## Adding data
Edit `src/data/trip.ts` only. Add a `Place` (set `coords` for it to appear on the map), add `Day` entries as plans firm up, add `Expense` entries as costs happen. Then `npm run build` and commit. Drop photos into `public/stays/<slug>/` and reference them as `stays/<slug>/file.jpg`.

## Design (anti-slop — see Jarvis/.claude/design/DESIGN.md)
- Palette: warm paper `#f7f1e7`, ink `#241b12`, ONE accent terracotta `#c2542e` (Ligurian houses). `--sea #3e6e6a` is functional-only (beaches / positive balances). No gradients, no glassmorphism, hairlines over shadows.
- Type: Fraunces (display serif) + Hanken Grotesk (UI). No Inter/Geist.
- Money colors: spent/owed are never green. Positive balance uses the calm sea tone, debt uses accent-deep. (Compass color rule.)
- No em dashes in copy.
