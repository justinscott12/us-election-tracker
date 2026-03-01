/**
 * Central SEO config. Set NEXT_PUBLIC_SITE_URL in production (e.g. https://us-election-tracker.com).
 */
export const SITE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SITE_URL) ||
  "https://us-election-tracker.com";

export const SITE_NAME = "US Election Tracker";

export const DEFAULT_DESCRIPTION =
  "Live US election results and election tracker. Follow presidential, Senate, House, and governor races with real-time results, electoral map, and primary updates.";

export const KEYWORDS = [
  "election results",
  "election tracker",
  "live election results",
  "US election results",
  "election results 2026",
  "primary results",
  "Senate election results",
  "governor election results",
  "electoral map",
  "presidential election results",
  "election night results",
  "vote results",
  "primary election tracker",
];
