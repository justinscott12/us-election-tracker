# US Election Tracker

A modern Next.js app for **informational** US election results: notable races (e.g. upcoming primaries) and state of the nation (presidential, governors, Congress), with a colorable SVG US map. Data is **live-updated via API** (e.g. Postman) without code changes.

**Portfolio pitch:** Full-stack election dashboard with file-backed API for live result updates and configurable default tab by election cycle.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API (live updates)

- **GET `/api/election`** — Returns full election data (default tab, state of nation, notable races).
- **PATCH `/api/election`** — Update any part of the data. Body is merged with existing data.

**Production:** In production, PATCH requires authentication so only you can update data. Set the env var `ELECTION_UPDATE_SECRET` in your deployment (e.g. Vercel or Netlify). Send it on each PATCH request as either `Authorization: Bearer YOUR_SECRET` or `X-Election-Secret: YOUR_SECRET`. If the secret is missing or wrong, PATCH returns 401. GET remains public.

### Change default tab

Set which tab opens first (e.g. `notable-races` during primaries, `state-of-nation` on election night):

```bash
curl -X PATCH http://localhost:3000/api/election \
  -H "Content-Type: application/json" \
  -d '{"defaultTab": "state-of-nation"}'
```

### Update presidential map (state colors)

State fill values: `undecided` | `dem` | `rep` | `demLead` | `repLead` | `split`.

```bash
curl -X PATCH http://localhost:3000/api/election \
  -H "Content-Type: application/json" \
  -d '{
    "stateOfNation": {
      "presidential": {
        "demEV": 100,
        "repEV": 150,
        "stateFills": {
          "FL": "rep",
          "PA": "demLead",
          "MI": "undecided"
        }
      }
    }
  }'
```

### Update notable races

```bash
curl -X PATCH http://localhost:3000/api/election \
  -H "Content-Type: application/json" \
  -d '{
    "notableRaces": [
      {
        "id": "sc-primary",
        "title": "South Carolina primary",
        "date": "2026-02-28",
        "type": "primary",
        "state": "South Carolina",
        "description": "Early presidential primary."
      }
    ]
  }'
```

### Update Congress totals

```bash
curl -X PATCH http://localhost:3000/api/election \
  -H "Content-Type: application/json" \
  -d '{
    "stateOfNation": {
      "congress": {
        "senateDem": 48,
        "senateRep": 50,
        "senateInd": 2,
        "houseDem": 215,
        "houseRep": 218
      }
    }
  }'
```

Data is stored in `data/election.json` (created on first write). Omit fields in PATCH to leave them unchanged.

## Tabs

- **Notable Races** — Upcoming major primaries and key races (e.g. early midterm primaries).
- **State of the Nation** — Latest presidential (EV + map), governors, and Congress.

The **default tab** is configurable via the API so you can switch focus by season (e.g. primaries vs general).

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS.
- API reads/writes `data/election.json` for zero-dependency live updates.

## Original

The original static HTML/JS/CSS tracker is in the `original/` folder. The SVG state paths were extracted from it for the new map component.
