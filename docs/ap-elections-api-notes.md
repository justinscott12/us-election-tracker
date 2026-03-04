## AP Elections API – Integration Notes

This document captures how the **AP Elections API (ELAPI)** works and how we could hook it into this app in the future.

---

### What the AP Elections API Provides

- **Live election results and metadata** for:
  - Races (office type, race type, status, etc.)
  - Candidates (names, party, IDs, incumbency, etc.)
  - Vote counts, delegate counts, electoral counts
  - Race calls (winners, runoffs)
- **Election reports**:
  - Delegate tracking for presidential primaries
  - Electoral vote and balance‑of‑power style summaries
- **Advance turnout data**:
  - Absentee ballots requested/sent/returned
  - Early in‑person voting and some demographic breakdowns

Primary docs:
- AP Elections API overview: `https://developer.ap.org/ap-elections-api/index.html`
- Getting Started: `https://developer.ap.org/ap-elections-api/docs/Getting_Started.htm`
- Elections request reference (parameters, examples): `https://developer.ap.org/ap-elections-api/docs/Elections_Request.htm`

---

### Access, Keys, and Quotas

- Access is **not public / self‑serve**:
  - You obtain credentials by contacting AP (e.g. `elections_api_info@ap.org` or via Customer Support).
  - Pricing, contract terms, and per‑minute query quotas are negotiated with AP.
- AP issues an **API key**; every request must include it:

  ```http
  x-api-key: YOUR_AP_ELECTIONS_API_KEY
  ```

- Each key has a **throttle (queries per minute)**. If we exceed it, the API can return:
  - `403` with a “per‑minute quota exceeded” style message.
  - Recommended approach is to back off (e.g. wait 5–10 seconds) and retry.
- All traffic is over **HTTPS with TLS 1.2+**.
- For this project, the key should live in **backend env/config only**, e.g.:
  - `AP_ELECTIONS_API_KEY=...` (never exposed to the browser bundle).

---

### Core Request Shape

- Base URL pattern:

  ```text
  https://api.ap.org/{version}/elections/{electionDate}?[parameters]
  ```

  - `version`: `v2` or `v3` (v3 is the current/live API).
  - `electionDate`: `YYYY-MM-DD`, e.g. `2026-03-03` for Super Tuesday / TX primaries.

- **HTTP method**: `GET`
- **Required headers**:
  - `x-api-key: <our key>`
  - `Accept-Encoding: gzip` (optional but recommended)
- **Format**:
  - Default response is XML.
  - Use `format=json` or `Accept: application/json` for JSON.

Basic example (Texas Senate + other statewide races for a 2026 primary date):

```http
GET https://api.ap.org/v3/elections/2026-03-03?statePostal=TX&officeID=S&format=json
```

---

### Key Query Parameters We’d Likely Use

These are the most relevant knobs for a tracker like this app:

- **`statePostal`**: two‑letter postal code or `US`
  - `TX`, `GA`, `OH`, etc.
  - `US` during a presidential general election to get national rollups for president.
- **`officeID`**: office type
  - `P` – President
  - `S` – U.S. Senate
  - `H` – U.S. House
  - `G` – Governor
  - `I` – Ballot measures, etc.
- **`raceTypeID`**: race type
  - `D` – Dem primary
  - `R` – GOP primary
  - `G` – General
  - Others exist for caucuses, top‑two, etc.
- **`level`**: granularity of results
  - `state` – state‑level only (default)
  - `ru` – reporting units (counties, or cities/towns in New England)
  - `fipscode` – county‑level via FIPS codes
  - `district` – e.g. delegate districts or NE/ME presidential districts (pre‑2024)
- **`national`**:
  - `true` – only “national interest” races (e.g. Senate, governor, marquee ballot measures)
  - `false` – only non‑national races
- **`winner`**:
  - `X` – only called races (winner declared)
  - `R` – only races advancing to runoff
  - `U` – only uncalled races
  - `A` – all (default)
- **`resultsType`**:
  - `l` – live (default)
  - `t` – test data (for AP’s test events)
  - `c` – certified results (historical; v2 only for 2020 and earlier)
- **`raceID` / `reportingUnitID`** (plus `statePostal`):
  - Target specific races and/or specific counties.
  - Useful if we store race IDs and want to poll only those.

Examples:

```http
GET https://api.ap.org/v3/elections/2026-03-03?statePostal=TX&officeID=S&level=ru&format=json
```

```http
GET https://api.ap.org/v3/elections/2026-03-03?statePostal=TX&raceID=7162,6489&reportingUnitID=6001,6002&format=json
```

---

### How Major Trackers Use It (Workflow)

The typical pattern (what outlets like NBC, etc., do) looks like:

1. **Initial request**
   - Query all races of interest (e.g. `statePostal=TX&officeID=S&level=ru`).
   - Response includes:
     - Race + candidate reference data (IDs, names, party, office, etc.).
     - Vote counts and, where relevant, delegate/electoral counts.
     - Race call status (winner, runoff).
     - A **“next request” URL** that encapsulates a continuation token / filter.
2. **Polling loop**
   - The client repeatedly calls the **`next`** URL at some cadence (e.g. every 15–30 seconds on a heavy election night, slower outside peak).
   - Each response returns **only the races that changed** since the last call plus a new `next` link.
3. **Conditional requests (optional optimization)**
   - Use `If-None-Match` with the last response’s `ETag` header.
   - If nothing has changed, the API can return `304 Not Modified`, which reduces payload volume.
4. **Application logic**
   - Ingest the race + result updates into our own data model.
   - Use AP’s fields to drive:
     - Live vote bars / percentages.
     - “Too early to call” vs. “Projected winner” labels.
     - County maps (via reporting units or FIPS).

Our app’s `seed-data` is effectively a **static snapshot** of race definitions and narratives; plugging in AP would replace the manually‑entered vote totals and statuses with **live data** while keeping our editorial text and layout.

---

### How This Could Fit Into This Project

High‑level integration ideas for this repo:

- **Backend service**:
  - Add a small API layer (Node/Next API route, or separate backend) that:
    - Stores which AP race IDs correspond to each local `notableRaces` entry (e.g. `tx-senate-2026-r` ⇒ AP race ID `7162`).
    - Polls AP on a schedule (e.g. in a background worker or on‑demand with caching).
    - Normalizes AP’s JSON into our app’s `ElectionData` / `results` shape.
  - Expose a **read‑only JSON endpoint** for the frontend: `/api/live-results?raceId=tx-senate-2026-r`.
- **Frontend**:
  - Toggle between **seeded** vs **live** data using `LIVE_RESULTS_ENABLED`.
  - When live is on, fetch from our backend endpoint instead of from static `seed-data`.
  - Handle “too early”, “projected”, and “called” states based on AP’s winner + status fields.
- **Persistence / caching**:
  - Cache AP responses short‑term (e.g. in Redis, database, or filesystem) to:
    - Avoid blowing query quotas.
    - Provide resilience if AP is temporarily unavailable.

This document is intentionally provider‑specific so we can revisit later and implement:
- AP Elections API as the initial source of truth for live results.
- A small adapter that maps AP’s data model into the types already used in `seed-data`.

