# US Election Tracker

**Full-stack election dashboard with live results, an interactive US map, and a secure REST API for real-time updates.**

[Live demo](https://us-election-tracker.com)

A Next.js application for tracking US election results: notable primaries, presidential electoral map, and Congress/governor summaries. Data can be updated via an authenticated API without redeploying, making it suitable for election-night workflows or editorial updates.

---

## Features

- **Notable Races** — Upcoming Senate, House, and governor primaries with status, candidates, and “why it matters” context
- **State of the Nation** — Presidential electoral map (state-by-state fills), EV totals, and Congress/governor scorecards
- **Interactive US map** — SVG map with state-level coloring; click highlighted states to view race details in a side panel
- **REST API** — GET for read-only data; PATCH for authenticated updates (notable races, presidential state results)
- **Production-ready** — Optional secret-based auth for PATCH in production; responsive layout and dark mode

---

## Tech stack

| Layer      | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router), React 19 |
| Language  | TypeScript |
| Styling   | Tailwind CSS |
| Data      | File-backed JSON (seed data + optional `data/election.json` from API writes) |

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app loads seed data by default; optional local updates are stored in `data/election.json`.

### Environment (optional)

- **Local:** Copy `.env.example` to `.env.local` and set `ELECTION_UPDATE_SECRET` to require auth on PATCH when testing.
- **Production:** Set `ELECTION_UPDATE_SECRET` in your host (e.g. Netlify) and send it as `Authorization: Bearer <secret>` or `X-Election-Secret: <secret>` on PATCH requests.

See [DEPLOY.md](./DEPLOY.md) for production deploy and API auth details.

---

## API overview

| Method | Endpoint         | Auth    | Description |
|--------|------------------|--------|-------------|
| GET    | `/api/election`  | None   | Full election payload (default tab, notable races, state of nation). |
| PATCH  | `/api/election`  | Secret | Update a single notable race or presidential state. Body: `{ notableRace: { id, status, ... } }` or `{ presidentialState: { stateCode, stateFill, ... } }`. |

In production, PATCH returns 401 without a valid secret and 503 if `ELECTION_UPDATE_SECRET` is not set.

---

## Project structure

- `src/app/` — Next.js routes (home, notable-races, state-of-nation, live-results, API)
- `src/components/` — AppHeader, NotableRaces, StateOfNation, UsMap, tabs
- `src/lib/` — Data loading/writing, seed data, state codes
- `src/data/` — State SVG paths, 2024 results reference
- `original/` — Legacy static HTML/JS tracker (map paths sourced from here)

---

## License

Private / portfolio use.
