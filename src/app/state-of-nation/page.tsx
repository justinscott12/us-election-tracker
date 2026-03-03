"use client";

import { useEffect, useState } from "react";
import type { ElectionData, OfficeTabId } from "@/types/election";
import { SubTabs } from "@/components/SubTabs";
import { StateOfNation } from "@/components/StateOfNation";

const OFFICE_TABS: { id: OfficeTabId; label: string }[] = [
  { id: "presidential", label: "President" },
  { id: "congress", label: "Congress" },
];

export default function StateOfNationPage() {
  const [data, setData] = useState<ElectionData | null>(null);
  const [activeTab, setActiveTab] = useState<OfficeTabId>("presidential");
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

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <h1 className="sr-only">State of the Nation – Electoral map and election results by state</h1>
      <SubTabs tabs={OFFICE_TABS} active={activeTab} onSelect={setActiveTab} />
      <StateOfNation data={data.stateOfNation} section={activeTab} />
    </div>
  );
}
