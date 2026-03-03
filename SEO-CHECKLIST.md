# Site Owner SEO Checklist

Use this checklist after deploying the US Election Tracker to ensure the site ranks and gets clicks for election-related search queries.

---

## 1. Verify production environment

- [ ] **Set `NEXT_PUBLIC_SITE_URL`** in production to your real domain with no trailing slash (e.g. `https://us-election-tracker.com`). Use HTTPS and stick to one canonical host (either www or non-www).
- [ ] Confirm no mixed http/https or www/non-www in links or redirects.

---

## 2. Google Search Console

- [ ] Add the property for your domain (e.g. `https://us-election-tracker.com`).
- [ ] Submit the sitemap URL: `https://your-domain.com/sitemap.xml`.
- [ ] Request indexing for key URLs:
  - `/` (home)
  - `/live-results` (main “election results” / “live election results” page)
  - `/election/texas` (Texas primaries / Texas election results)
  - `/faq` (Election results FAQ)

---

## 3. Bing Webmaster Tools

- [ ] Add your site in Bing Webmaster Tools.
- [ ] Submit the same sitemap URL: `https://your-domain.com/sitemap.xml`.

---

## 4. Optional: Backlinks and promotion

- [ ] Consider a few high-quality backlinks (e.g. local news, election roundups, press release) pointing to:
  - `/live-results` with anchor text like “live election results” or “election live results”.
  - `/election/texas` or `/live-results` with “Texas election results” or “Texas primaries”.

---

## 5. Before major election days

- [ ] Update event dates in `src/app/layout.tsx` (JSON-LD `Event` for Texas Senate primaries) if the election date changes.
- [ ] Update any “polls close” copy and dates in `src/app/live-results/page.tsx` and `LiveResultsClient.tsx` (e.g. `POLL_CLOSES_AT_UTC_MS`) so schema and content stay current.

---

## 6. Post-launch audit

- [ ] Run [Google Rich Results Test](https://search.google.com/test/rich-results) on:
  - Home URL (`/`)
  - Live results URL (`/live-results`)
- [ ] In Search Console, check mobile-friendliness and Core Web Vitals (LCP, CLS, FID) after a few days of data.
- [ ] Ensure Core Web Vitals are acceptable; fix any blocking resources if indexing or rendering is affected.

---

## Quick reference: what was implemented in code

- **Technical SEO:** Unique keyword-rich titles (<60 chars) and meta descriptions (<160 chars), `metadataBase` from env, canonicals, robots.txt (allow `/`, disallow `/api/`), sitemap with all indexable URLs and `changeFrequency`/`priority`.
- **Home & indexability:** Server-rendered home page with intro text and links (no client-only “Loading…” for crawlers); clear H1 and internal links.
- **Schema:** WebSite, Organization, BreadcrumbList, Event (Texas Senate primaries), WebPage + ItemList on `/live-results`, FAQPage on `/faq`.
- **Content & URLs:** `/election/texas` for Texas queries; visible H2/copy on `/live-results`; FAQ page; internal links with descriptive anchor text.
- **OG/Twitter:** `og:image`, `og:title`, `og:description`, `og:url`; `twitter:card` summary_large_image; alt text on OG images.
- **Crawlability:** Server-rendered snapshot on `/live-results` so first byte includes “Texas primaries”, “election live results”, and race names.

Everything above that could be done in the repository has been implemented. The checklist items are for you to complete in production and in external tools (GSC, Bing, backlinks, audits).
