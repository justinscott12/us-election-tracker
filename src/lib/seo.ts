/**
 * Central SEO config. Set NEXT_PUBLIC_SITE_URL in production (e.g. https://us-election-tracker.com).
 * No trailing slash. Use https and consistent www/non-www to avoid mixed canonicals.
 */
import {
  SEO_WORDLIST,
  CORE_PHRASES,
  LIVE_RESULTS_PHRASES,
  NOTABLE_RACES_PHRASES,
  STATE_OF_NATION_PHRASES,
  TEXAS_PAGE_PHRASES,
  FAQ_PHRASES,
} from "./seo-wordlist";

export const SITE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SITE_URL) ||
  "https://us-election-tracker.com";

export const SITE_NAME = "US Election Tracker";

/** Default meta description (keep under 160 chars). Uses phrases from SEO wordlist. */
export const DEFAULT_DESCRIPTION =
  "Election results and live election results: Texas primaries, Texas election results today, primary results, electoral map. Track election results and vote results in real time.";

/** Full wordlist as meta keywords (search engines may use for context). */
export const KEYWORDS = [...SEO_WORDLIST];

/** Re-export phrase lists for page-level metadata. */
export {
  CORE_PHRASES,
  LIVE_RESULTS_PHRASES,
  NOTABLE_RACES_PHRASES,
  STATE_OF_NATION_PHRASES,
  TEXAS_PAGE_PHRASES,
  FAQ_PHRASES,
  SEO_WORDLIST,
};
