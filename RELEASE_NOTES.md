# Release notes

## 1.0.0 — Initial release (2025)

**US Election Tracker** is a full-stack election dashboard for tracking US primaries and general election results. Use it to follow notable races, the presidential map, and Congress/governor summaries—with optional live updates via a secure API.

### Highlights

- **Notable Races** — Senate, House, and governor primaries with status (too early, too close, called, final), candidate results (votes and percentages), “est. votes in,” and “why it matters” context.
- **State of the Nation** — Presidential electoral map with state-by-state coloring, EV totals, national popular vote, and clickable states that open a side panel with state-level results and “% est. votes in.”
- **Live Results** — Dedicated live-results view (when enabled) for election night, with a single “Results last updated” timestamp across notable races.
- **REST API** — `GET /api/election` returns the full payload; `PATCH /api/election` updates a single notable race or presidential state. Optional secret-based auth in production.
- **Durable storage** — Election data (votes, pct, est. votes in, last updated) persists across server restarts and serverless cold starts via Netlify Blobs in production; local development uses `data/election.json`.
- **Responsive UI** — Works on mobile and desktop, with dark mode and an SVG US map that highlights states and shows details on click.

### Tech stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Tailwind CSS** for styling
- **Netlify Blobs** for production persistence; file-backed JSON locally

### Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For production, set `ELECTION_UPDATE_SECRET` (e.g. on Netlify) to protect PATCH requests. See the [README](README.md) and [DEPLOY.md](DEPLOY.md) for deploy and API details.

### Links

- [Live demo](https://us-election-tracker.com)
- [README](README.md) — features, API overview, project structure
