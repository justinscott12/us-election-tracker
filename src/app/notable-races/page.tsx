"use client";

import { useEffect, useState } from "react";
import type { ElectionData, OfficeTabId } from "@/types/election";
import type { NotableRace } from "@/types/election";
import { SubTabs } from "@/components/SubTabs";
import { NotableRaces } from "@/components/NotableRaces";

/** Midterms year: hide Presidential tab; US Senate first, then Governor. */
const OFFICE_TABS: { id: OfficeTabId; label: string }[] = [
  { id: "congress", label: "US Senate Primaries" },
  { id: "governor", label: "Governor Primaries" },
];

function filterRacesByOffice(races: NotableRace[], office: OfficeTabId): NotableRace[] {
  return races.filter((r) => r.office === office);
}

export default function NotableRacesPage() {
  const [data, setData] = useState<ElectionData | null>(null);
  const [activeTab, setActiveTab] = useState<OfficeTabId>("congress");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/election")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((d: ElectionData) => setData(d))
      .catch(() => setError("Failed to load election data."));
  }, []);

  // Poll for updates so results update without full page refresh
  useEffect(() => {
    if (!data) return;
    const interval = setInterval(() => {
      fetch("/api/election")
        .then((r) => (r.ok ? r.json() : null))
        .then((d: ElectionData | null) => { if (d) setData(d); })
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

  const races = filterRacesByOffice(data.notableRaces, activeTab).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const senateHighlightStates: Record<string, "highlight"> = {
    TX: "highlight",
    MI: "highlight",
    ME: "highlight",
    AK: "highlight",
  };
  const governorHighlightStates: Record<string, "highlight"> = {
    FL: "highlight",
    CA: "highlight",
    GA: "highlight",
    OH: "highlight",
  };
  const stateFills =
    activeTab === "congress" ? senateHighlightStates : activeTab === "governor" ? governorHighlightStates : {};

  return (
    <div className="flex-1 flex flex-col">
      <SubTabs tabs={OFFICE_TABS} active={activeTab} onSelect={setActiveTab} />
      <NotableRaces races={races} stateFills={stateFills} />
    </div>
  );
}
