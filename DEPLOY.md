# US Election Tracker – production deploy

## 1. Environment variables

Set these in your host’s dashboard (Netlify: Site settings → Environment variables; Vercel: Project → Settings → Environment variables).

| Variable | Required | Description |
|----------|----------|-------------|
| `ELECTION_UPDATE_SECRET` | Yes (for PATCH) | Secret string only you know. Send as `Authorization: Bearer <secret>` or `X-Election-Secret: <secret>` when calling PATCH `/api/election`. If unset in production, PATCH returns 503. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4 measurement ID (e.g. `G-XXXXXXXXXX`). When set, gtag is loaded on every page. |
| `NODE_ENV` | No | Set to `production` automatically by Netlify/Vercel. |

**Generate a strong secret (example):**
```bash
openssl rand -base64 32
```

---

## 2. Netlify

- **Build command:** `npm run build`
- **Publish directory:** `.next` (or leave default; the Next.js plugin sets it)
- **Node version:** 18+ (Netlify usually picks from `.nvmrc` or engine in `package.json` if present)

Optional `netlify.toml` in repo (see below). You can also set build command and publish directory in the Netlify UI.

---

## 3. Vercel

- **Framework:** Next.js (auto-detected)
- **Build command:** `npm run build` (default)
- **Output:** default (no `output: 'export'`)

Add `ELECTION_UPDATE_SECRET` under Project → Settings → Environment Variables for Production.

---

## 4. Data persistence (file-backed updates)

The app reads/writes election data on the server. **Local:** `data/election.json` under the project directory. **Serverless** (Netlify, Vercel): the app writes to the platform’s temp directory (`/tmp`) so PATCH succeeds; that storage is **ephemeral**, so updates may not persist across invocations or after a deploy.

- **GET** always works: it falls back to seed data if the file is missing.
- **PATCH** no longer fails with ENOENT; writes go to a writable temp dir on serverless.

To have persistent updates in production you’d need to switch to a database or Netlify Blobs / Vercel KV (and change `src/lib/data.ts`). For a read-only prod site using seed data, no change is needed.

---

## 5. After deploy

- Open the site URL; the app should load with seed data.
- To update data via API (if you added persistent storage or accept ephemeral updates), call PATCH with your secret:

```bash
curl -X PATCH https://YOUR_SITE_URL/api/election \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ELECTION_UPDATE_SECRET" \
  -d '{"notableRace":{"id":"tx-senate-2026-r","status":"too-early"}}'
```

Replace `YOUR_SITE_URL` and `YOUR_ELECTION_UPDATE_SECRET` with your values.
