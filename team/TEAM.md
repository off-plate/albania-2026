# The Italy Trip Crew

Reusable specialist team for planning (and re-planning) Italy trips.
Each member is a callable subagent defined in [`../.claude/agents/`](../.claude/agents/).

## Roster

| # | Name | Agent file | Owns |
|---|------|-----------|------|
| 1 | **Marco** — Italy Insider | `marco-italy-insider.md` | Local knowledge, photogenic spots, August reality (Ferragosto, closures, crowds, weather), beach culture |
| 2 | **Elena** — Itinerary Architect | `elena-itinerary-architect.md` | Day-by-day structure, pacing, the 2-night + base split logic, no-burnout flow |
| 3 | **Hans** — Road-Trip Logistics | `hans-roadtrip-logistics.md` | Prague→Italy route, legs, drive timing, fuel/rest stops, tolls, vignettes, parking |
| 4 | **Sasha** — Travel Hacker | `sasha-travel-hacker.md` | Best deals, cheapest stays, fuel/toll savings, booking timing, smart alternatives |
| 5 | **Giulia** — Stay Scout | `giulia-stay-scout.md` | Separate-room villas/agriturismi/hotels/apartments, beach access, pools, photogenic stays |
| 6 | **Tomáš** — Budget Master | `tomas-budget-master.md` | Full cost model, fuel math, per-person/per-couple split, contingency, the final number |

## How to use them
- Open this project and call a member with the Agent tool, e.g. *"Marco, find the 5 most photogenic non-historic spots within 90 min of Forte dei Marmi."*
- Run several in parallel for a fan-out (e.g. Hans on the route while Giulia scouts stays).
- They return research/data; Elena assembles, Tomáš costs, then we build the shareable page.

## Working rules (all members)
- **Real maps only** — link to Google Maps; never invent a map.
- **Cite sources** for prices, hours, distances; flag when something is an estimate.
- **August 2026 reality** — account for heat, crowds, Ferragosto, advance-booking pressure.
- **Cost-efficient** — always note a cheaper alternative when one exists.
