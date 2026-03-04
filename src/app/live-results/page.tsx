import { getData } from "@/lib/data";
import { LiveResultsClient } from "./LiveResultsClient";

export const dynamic = "force-dynamic";

/** Race IDs shown on Live Results. Must match LiveResultsClient. */
const LIVE_RESULTS_RACE_IDS = ["tx-senate-2026-r", "tx-senate-2026-d"];

/**
 * Server-rendered snapshot so crawlers and users get keyword-rich HTML in the first byte:
 * "Texas primaries", "election live results", race names.
 */
async function LiveResultsSnapshot() {
  const data = await getData();
  const idSet = new Set(LIVE_RESULTS_RACE_IDS);
  const races = data.notableRaces
    .filter((r) => idSet.has(r.id))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="px-4 pt-4 pb-2 border-b border-slate-200 dark:border-slate-700 text-center">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
        Texas primaries – Live election results
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
        Real-time results for today’s Texas primaries as polls close. Track live vote counts and primary results below.
      </p>
      {races.length > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Tracking: {races.map((r) => r.title).join(" · ")}
        </p>
      )}
    </section>
  );
}

export default async function LiveResultsPage() {
  let initialData: Awaited<ReturnType<typeof getData>> | null = null;
  try {
    initialData = await getData();
  } catch {
    // Fallback: client will fetch
  }

  return (
    <>
      <LiveResultsSnapshot />
      <LiveResultsClient initialData={initialData} />
    </>
  );
}
