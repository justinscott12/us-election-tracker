/**
 * Single toggle for Live Results: tab visibility, default tab, and home redirect.
 * Flip this to true on election days; false otherwise.
 *
 * Optional override: set env LIVE_RESULTS_ENABLED=true or false (e.g. in Netlify)
 * to toggle without changing code.
 */
// Set to true for the Texas U.S. Senate primaries (live results enabled).
const LIVE_RESULTS_ENABLED_DEFAULT = true;

const fromEnv = process.env.LIVE_RESULTS_ENABLED;
const fromEnvBool =
  fromEnv === "true" || fromEnv === "1"
    ? true
    : fromEnv === "false" || fromEnv === "0"
      ? false
      : undefined;

export const LIVE_RESULTS_ENABLED = fromEnvBool ?? LIVE_RESULTS_ENABLED_DEFAULT;
