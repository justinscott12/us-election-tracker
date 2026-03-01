"use client";

import { useEffect, useState } from "react";
import type { ElectionData, NotableRace } from "@/types/election";
import { NotableRaces } from "@/components/NotableRaces";

/** Race IDs to show on Live Results (e.g. races happening "today"). Update for each election day. */
const LIVE_RESULTS_RACE_IDS = [
  "tx-senate-2026-r",
  "tx-senate-2026-d",
];

function filterLiveRaces(races: NotableRace[]): NotableRace[] {
  const idSet = new Set(LIVE_RESULTS_RACE_IDS);
  return races.filter((r) => idSet.has(r.id)).sort((a, b) => a.date.localeCompare(b.date));
}

export default function LiveResultsPage() {
  const [data, setData] = useState<ElectionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/election")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((d: ElectionData) => setData(d))
      .catch(() => setError("Failed to load data."));
  }, []);

  useEffect(() => {
    if (!data) return;
    const interval = setInterval(() => {
      fetch("/api/election")
        .then((r) => (r.ok ? r.json() : null))
        .then((d: ElectionData | null) => {
          if (d) setData(d);
        })
        .catch(() => {});
    }, 30_000);
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

  return (
    <div className="flex-1 flex flex-col">
      <NotableRaces
        races={races}
        stateFills={stateFills}
        title="Today's Races"
      />
    </div>
  );
}
