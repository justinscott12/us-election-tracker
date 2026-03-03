/**
 * Definitive SEO wordlist: common user searches where we want the site to appear.
 * Single source of truth for keywords; used by seo.ts and page metadata.
 * Keep phrases as users would type them (lowercase, natural).
 */

/** All target search phrases in one flat list (no duplicates). Used for meta keywords and coverage checks. */
export const SEO_WORDLIST = [
  // —— Core / generic ——
  "election",
  "election results",
  "election results today",
  "live election results",
  "election live",
  "election live results",
  "election tracker",
  "track election results",
  "follow election results",
  "check election results",
  "where to see election results",
  "vote results",
  "election night results",
  "real time election results",
  "today's election results",
  "election today",
  "US election results",
  "election results 2026",
  "2026 election",
  // —— Texas-specific ——
  "texas primaries",
  "texas election",
  "texas election results",
  "texas election today",
  "texas election result",
  "texas election results today",
  "texas primary results",
  "texas senate race",
  "texas vote results",
  "texas polls close",
  "texas primary election",
  // —— Primary-focused ——
  "primary results",
  "primary election results",
  "senate primary results",
  "governor primary results",
  "primary election 2026",
  "live primary results",
  "primary election today",
  // —— By office ——
  "senate election results",
  "governor election results",
  "house election results",
  "congressional election results",
  "US senate race",
  "governor race",
  "presidential election results",
  // —— Map / state / nation ——
  "electoral map",
  "election map",
  "election results by state",
  "state election results",
  "election results map",
  "US election map",
  "state of the nation",
  "Congress results",
  "Senate results",
  "House results",
  // —— Intent / FAQ ——
  "when are election results available",
  "when do polls close",
  "election results FAQ",
  "notable races",
  "election results live",
] as const;

export type SeoPhrase = (typeof SEO_WORDLIST)[number];

/** Phrases to emphasize on the homepage and default meta. */
export const CORE_PHRASES = [
  "election",
  "election results",
  "live election results",
  "election live",
  "election tracker",
  "texas primaries",
  "texas election results",
  "texas election today",
  "primary results",
  "election results today",
  "vote results",
  "electoral map",
] as const;

/** Phrases for /live-results page. */
export const LIVE_RESULTS_PHRASES = [
  "live election results",
  "election live results",
  "election live",
  "texas primaries",
  "texas election today",
  "texas election results",
  "texas election result",
  "election results today",
  "today's election results",
  "election today",
  "primary results",
  "real time election results",
  "live primary results",
  "texas primary results",
  "vote results",
  "election night results",
  "when are election results available",
] as const;

/** Phrases for /notable-races page. */
export const NOTABLE_RACES_PHRASES = [
  "notable races",
  "primary results",
  "primary election results",
  "senate primary results",
  "governor primary results",
  "texas primaries",
  "election results",
  "election tracker",
  "live primary results",
  "primary election 2026",
  "primary election today",
  "US senate race",
  "governor race",
  "senate election results",
  "governor election results",
] as const;

/** Phrases for /state-of-nation page. */
export const STATE_OF_NATION_PHRASES = [
  "electoral map",
  "election map",
  "election results by state",
  "state election results",
  "election results map",
  "US election map",
  "state of the nation",
  "Congress results",
  "Senate results",
  "House results",
  "election results",
  "live election results",
  "congressional election results",
  "presidential election results",
] as const;

/** Phrases for /election/texas page. */
export const TEXAS_PAGE_PHRASES = [
  "texas election results",
  "texas primaries",
  "texas election today",
  "texas election result",
  "texas primary results",
  "texas senate race",
  "texas vote results",
  "texas polls close",
  "texas primary election",
  "texas election",
  "live election results",
  "election results",
  "primary results",
] as const;

/** Phrases for /faq page. */
export const FAQ_PHRASES = [
  "election results FAQ",
  "when are election results available",
  "when do polls close",
  "where to see election results",
  "live election results",
  "election results",
  "texas primaries",
  "texas election results today",
  "election tracker",
  "check election results",
  "track election results",
] as const;
