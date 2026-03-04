"use client";

import { useEffect, useState } from "react";
import type { ElectionData, NotableRace } from "@/types/election";
import { NotableRaces } from "@/components/NotableRaces";

/** Race IDs to show on Live Results (e.g. races happening "today"). Update for each election day. */
const LIVE_RESULTS_RACE_IDS = [
  "tx-senate-2026-r",
  "tx-senate-2026-d",
];

// Texas U.S. Senate primaries — polls close March 3rd, 2026 at 7:00 PM CST (UTC-6).
const POLL_CLOSES_AT_UTC_MS = Date.UTC(2026, 2, 4, 1, 0, 0);

/** Parse test overrides from URL: ?simulatePollsClosed=1 or ?pollClosesInSeconds=30 */
function getPollCloseOverride(): { simulateClosed: boolean; closesInSeconds: number | null } {
  if (typeof window === "undefined" || !window.location?.search) return { simulateClosed: false, closesInSeconds: null };
  const params = new URLSearchParams(window.location.search);
  const simulateClosed = params.get("simulatePollsClosed") === "1" || params.get("pollsClosed") === "1";
  const sec = params.get("pollClosesInSeconds");
  const closesInSeconds = sec != null && /^\d+$/.test(sec) ? Math.max(0, parseInt(sec, 10)) : null;
  return { simulateClosed, closesInSeconds };
}

function filterLiveRaces(races: NotableRace[]): NotableRace[] {
  const idSet = new Set(LIVE_RESULTS_RACE_IDS);
  return races.filter((r) => idSet.has(r.id)).sort((a, b) => a.date.localeCompare(b.date));
}

function formatTimeRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  parts.push(
    `${hours.toString().padStart(2, "0")}h`,
    `${minutes.toString().padStart(2, "0")}m`,
    `${seconds.toString().padStart(2, "0")}s`,
  );
  return parts.join(" ");
}

/** Format ISO timestamp as "3:45 PM" (today), "Mar 2, 3:45 PM" (this year), or "Mar 2, 2025, 3:45 PM" (other year) */
function formatLastUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay = d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  if (sameDay) return timeStr;
  const sameYear = d.getFullYear() === now.getFullYear();
  const dateStr = sameYear
    ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${dateStr}, ${timeStr}`;
}

export function LiveResultsClient({ initialData }: { initialData: ElectionData | null }) {
  const [data, setData] = useState<ElectionData | null>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [timeRemainingMs, setTimeRemainingMs] = useState<number | null>(null);

  // Fetch when we have no data (e.g. no initialData from server)
  useEffect(() => {
    if (data) return;
    fetch("/api/election", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((d: ElectionData) => setData(d))
      .catch(() => setError("Failed to load data."));
  }, [data]);

  // When we have initialData from server, refetch once on mount so we show the same
  // up-to-date data as the Notable Races page (e.g. after a PATCH to /api/election)
  useEffect(() => {
    if (!initialData) return;
    fetch("/api/election", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: ElectionData | null) => { if (d) setData(d); })
      .catch(() => {});
  }, []);

  // Refetch when tab/window gains focus so PATCH updates appear as soon as user returns
  useEffect(() => {
    const refetch = () => {
      fetch("/api/election", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: ElectionData | null) => {
          if (d) setData((prev) => (prev ? d : prev));
        })
        .catch(() => {});
    };
    const onVisible = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") refetch();
    };
    if (typeof document !== "undefined" && document.addEventListener) {
      document.addEventListener("visibilitychange", onVisible);
      window.addEventListener("focus", refetch);
      return () => {
        document.removeEventListener("visibilitychange", onVisible);
        window.removeEventListener("focus", refetch);
      };
    }
  }, []);

  useEffect(() => {
    const { simulateClosed, closesInSeconds } = getPollCloseOverride();
    const effectiveCloseMs =
      simulateClosed ? 0 : closesInSeconds != null ? Date.now() + closesInSeconds * 1000 : POLL_CLOSES_AT_UTC_MS;

    const update = () => {
      setTimeRemainingMs((prev) => Math.max(0, effectiveCloseMs === 0 ? 0 : effectiveCloseMs - Date.now()));
    };
    update();
    const id = setInterval(update, 1_000);
    return () => clearInterval(id);
  }, []);

  // Poll every 5s so PATCH updates appear within a few seconds without manual refresh
  useEffect(() => {
    if (!data) return;
    const interval = setInterval(() => {
      fetch("/api/election", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: ElectionData | null) => { if (d) setData(d); })
        .catch(() => {});
    }, 5_000);
    return () => clearInterval(interval);
  }, [data]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-slate-500 dark:text-slate-400">Loading…</p>
      </div>
    );
  }

  const races = filterLiveRaces(data.notableRaces);
  const stateFills = { TX: "highlight" as const };
  const latestUpdate = races.reduce<string | null>((acc, r) => {
    if (!r.lastUpdated) return acc;
    return !acc || r.lastUpdated > acc ? r.lastUpdated : acc;
  }, null);

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-900/60 px-4 py-3 text-center text-sm">
        <p className="sr-only">
          Election live results and Texas election results today. Track Texas primaries and live primary results.
        </p>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Texas U.S. Senate Primaries — Polls Close at 7:00 PM CT on March 3, 2026
        </p>
        {timeRemainingMs != null && timeRemainingMs > 0 ? (
          <p className="mt-1 text-slate-700 dark:text-slate-200">
            Polls close in{" "}
            <span className="font-mono font-semibold text-blue-700 dark:text-blue-300">
              {formatTimeRemaining(timeRemainingMs)}
            </span>
            .
          </p>
        ) : (
          <p className="mt-1 text-slate-700 dark:text-slate-200">
            Polls have closed in Texas. Live results are coming through now.
          </p>
        )}
        {latestUpdate && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400" title={new Date(latestUpdate).toLocaleString()}>
            Results last updated {formatLastUpdated(latestUpdate)}
          </p>
        )}
      </div>
      <NotableRaces
        races={races}
        stateFills={stateFills}
        title="Notable Races Happening Today"
        titleHeadingLevel={2}
        showResultsOnCards
      />
    </div>
  );
}
